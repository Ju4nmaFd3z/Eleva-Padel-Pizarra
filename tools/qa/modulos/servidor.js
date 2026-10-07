/* =========================================================
   Módulo «servidor»
   ---------------------------------------------------------
   Respuestas HTTP del sitio servido como en Vercel
   (tools/servidor-local.js + middleware.js), sin navegador:
   · cabeceras de seguridad y CSP de vercel.json en cada página;
   · URLs limpias (308), 404 con su página;
   · nada de lo excluido en .vercelignore se sirve;
   · modo mantenimiento: 503 + Retry-After + noindex + CSP propia,
     recursos libres, paso con ?acceso=<clave> y cookie.
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const { RAIZ } = require('../lib/servidor');

const vercel = JSON.parse(fs.readFileSync(path.join(RAIZ, 'vercel.json'), 'utf8'));
const CSP = vercel.headers.find(h => h.source === '/(.*)').headers.find(h => h.key === 'Content-Security-Policy').value;
const SEGURIDAD = ['x-content-type-options', 'x-frame-options', 'referrer-policy', 'strict-transport-security', 'permissions-policy', 'cross-origin-opener-policy'];

const pedir = (url, opciones = {}) => fetch(url, Object.assign({ redirect: 'manual' }, opciones));

function caso(id, pagina, fn) {
  return {
    id: 'servidor · ' + id,
    pagina,
    rapido: true,
    async ejecutar(entorno) {
      const f = [];
      const ok = (c, clave, detalle) => { if (!c) f.push({ tipo: id.split(' · ')[0], clave, detalle: detalle === undefined ? '' : String(detalle) }); };
      await fn(entorno, ok);
      return f;
    }
  };
}

function cabeceras() {
  return caso('cabeceras', 'todas', async ({ base }, ok) => {
    for (const [ruta, estado] of [['/', 200], ['/pizarra', 200], ['/privacidad', 200], ['/no-existe-qa', 404]]) {
      const r = await pedir(base + ruta);
      ok(r.status === estado, ruta + ': estado ' + r.status, 'se esperaba ' + estado);
      ok(r.headers.get('content-security-policy') === CSP, ruta + ': CSP distinta de vercel.json', r.headers.get('content-security-policy'));
      for (const h of SEGURIDAD) ok(!!r.headers.get(h), ruta + ': falta la cabecera ' + h);
      ok(/text\/html/.test(r.headers.get('content-type') || ''), ruta + ': Content-Type', r.headers.get('content-type'));
      await r.arrayBuffer();
    }
  });
}

function urlsLimpias() {
  return caso('urls-limpias', 'todas', async ({ base }, ok) => {
    for (const [ruta, destino] of [['/pizarra/', '/pizarra'], ['/index.html', '/'], ['/privacidad.html', '/privacidad'], ['/pizarra/index.html', '/pizarra']]) {
      const r = await pedir(base + ruta);
      ok(r.status === 308 && r.headers.get('location') === destino, ruta + ' no redirige con 308 a ' + destino, r.status + ' → ' + r.headers.get('location'));
    }
    const r = await pedir(base + '/Pizarra');
    ok(r.status === 404, '/Pizarra no da 404 (las rutas distinguen mayúsculas, como en Vercel)', r.status);
  });
}

function excluidos() {
  return caso('excluidos', 'todas', async ({ base }, ok) => {
    for (const ruta of ['/CLAUDE.md', '/README.md', '/CONTRIBUTING.md', '/CONFIRMAR.md', '/tools/validar.js', '/tools/qa/bateria.js', '/clubs/_plantilla/manifest.js', '/assets/credits.json', '/.gitignore']) {
      const r = await pedir(base + ruta);
      ok(r.status === 404, ruta + ' se sirve', r.status);
      await r.arrayBuffer();
    }
  });
}

function mantenimiento() {
  return caso('mantenimiento', 'mantenimiento', async ({ baseMantenimiento: b, claveMantenimiento: clave }, ok) => {
    for (const ruta of ['/', '/pizarra', '/privacidad', '/no-existe-qa']) {
      const r = await pedir(b + ruta);
      const cuerpo = await r.text();
      ok(r.status === 503, ruta + ': estado ' + r.status, 'se esperaba 503');
      ok(/^\d+$/.test(r.headers.get('retry-after') || ''), ruta + ': falta Retry-After');
      ok(/noindex/.test(r.headers.get('x-robots-tag') || ''), ruta + ': falta X-Robots-Tag noindex');
      ok(/no-store/.test(r.headers.get('cache-control') || ''), ruta + ': Cache-Control no es no-store', r.headers.get('cache-control'));
      ok(/default-src 'none'/.test(r.headers.get('content-security-policy') || ''), ruta + ': falta la CSP de la página de mantenimiento');
      ok(/<meta name="robots" content="noindex">/.test(cuerpo), ruta + ': la página no lleva meta robots noindex');
    }
    for (const ruta of ['/favicon.ico', '/assets/img/logo-sin-fondo.svg', '/robots.txt']) {
      const r = await pedir(b + ruta);
      ok(r.status === 200, ruta + ' no se sirve en mantenimiento', r.status);
      await r.arrayBuffer();
    }
    const mala = await pedir(b + '/pizarra?acceso=otra');
    ok(mala.status === 503, 'una clave errónea deja pasar', mala.status);
    await mala.arrayBuffer();
    const r = await pedir(b + '/pizarra?acceso=' + clave + '&x=1');
    await r.arrayBuffer();
    const cookie = r.headers.get('set-cookie') || '';
    ok(r.status === 303 && r.headers.get('location') === '/pizarra?x=1', 'la clave no redirige quitando ?acceso', r.status + ' → ' + r.headers.get('location'));
    ok(/^eleva-acceso=/.test(cookie) && /HttpOnly/i.test(cookie) && /SameSite=Lax/i.test(cookie) && /Max-Age=2592000/.test(cookie), 'cookie eleva-acceso incorrecta', cookie);
    const dentro = await pedir(b + '/pizarra', { headers: { cookie: cookie.split(';')[0] } });
    ok(dentro.status === 200, 'con la cookie no se pasa', dentro.status);
    await dentro.arrayBuffer();
  });
}

module.exports = {
  nombre: 'servidor',
  descripcion: 'cabeceras y CSP, URLs limpias, 404, excluidos del despliegue y modo mantenimiento',
  casos: () => [cabeceras(), urlsLimpias(), excluidos(), mantenimiento()]
};
