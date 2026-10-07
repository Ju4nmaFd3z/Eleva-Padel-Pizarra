/* =========================================================
   Servidores locales de la batería
   ---------------------------------------------------------
   Arranca tools/servidor-local.js (el mismo que se usa para
   previsualizar: imita a Vercel e incluye el middleware) como
   proceso hijo, espera a que responda y lo para al terminar.
   Dos instancias: la normal y otra con MANTENIMIENTO=1.
   ========================================================= */
'use strict';
const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..', '..', '..');
const SERVIDOR = path.join(RAIZ, 'tools', 'servidor-local.js');

/* Clave de prueba del modo mantenimiento: solo existe en este proceso local */
const CLAVE_MANTENIMIENTO = 'qa-local';

function puertoLibre(preferido) {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.unref();
    s.on('error', err => (preferido ? resolve(puertoLibre(0)) : reject(err)));
    s.listen(preferido || 0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => resolve(port));
    });
  });
}

function responde(puerto) {
  return new Promise(resolve => {
    const req = http.get({ host: '127.0.0.1', port: puerto, path: '/robots.txt', timeout: 1000 }, res => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function arrancar(puerto, entorno) {
  const hijo = spawn(process.execPath, [SERVIDOR, String(puerto)], {
    cwd: RAIZ,
    env: Object.assign({}, process.env, { MANTENIMIENTO: '0', MANTENIMIENTO_CLAVE: '' }, entorno),
    stdio: ['ignore', 'ignore', 'pipe']
  });
  let errores = '';
  hijo.stderr.on('data', d => { errores += d; });
  const limite = Date.now() + 15000;
  while (Date.now() < limite) {
    if (hijo.exitCode !== null) throw new Error('El servidor local se ha cerrado: ' + errores);
    if (await responde(puerto)) return hijo;
    await new Promise(r => setTimeout(r, 100));
  }
  hijo.kill();
  throw new Error('El servidor local no responde en el puerto ' + puerto);
}

/* Devuelve { base, baseMantenimiento, clave, parar() } */
async function arrancarServidores(puertoPedido) {
  const p1 = puertoPedido ? Number(puertoPedido) : await puertoLibre(0);
  if (puertoPedido && !(await puertoLibre(p1).then(p => p === p1))) {
    throw new Error('El puerto ' + p1 + ' está ocupado');
  }
  const p2 = await puertoLibre(p1 + 1);
  const normal = await arrancar(p1);
  let mant;
  try {
    mant = await arrancar(p2, { MANTENIMIENTO: '1', MANTENIMIENTO_CLAVE: CLAVE_MANTENIMIENTO });
  } catch (e) {
    normal.kill();
    throw e;
  }
  const parar = () => { for (const h of [normal, mant]) if (h.exitCode === null) h.kill(); };
  process.on('exit', parar);
  return {
    base: 'http://localhost:' + p1,
    baseMantenimiento: 'http://localhost:' + p2,
    clave: CLAVE_MANTENIMIENTO,
    parar
  };
}

module.exports = { arrancarServidores, RAIZ };
