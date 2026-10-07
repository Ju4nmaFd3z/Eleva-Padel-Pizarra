#!/usr/bin/env node
/* =========================================================
   BATERÍA PERMANENTE DE QA — punto de entrada único
   ---------------------------------------------------------
   Arranca su propio servidor local (tools/servidor-local.js,
   normal y con MANTENIMIENTO=1), ejecuta los casos de los
   módulos registrados abajo y sale con código 1 si algo falla.

   Uso (desde la raíz del repo; antes, una vez: npm ci en tools/qa):
     node tools/qa/bateria.js                 todo
     node tools/qa/bateria.js --rapido        subconjunto para cada commit
     node tools/qa/bateria.js --modulo responsive,interaccion
     node tools/qa/bateria.js --pagina pizarra,404
     node tools/qa/bateria.js --caso "390x844 · en"   (texto o /regex/)
     node tools/qa/bateria.js --lista         muestra los casos y sale
     node tools/qa/bateria.js --puerto 3801   puerto del servidor (y el siguiente libre)
     node tools/qa/bateria.js --paralelo 2    casos a la vez (por defecto: núcleos − 2, entre 2 y 8)
   Resultados: tools/qa/resultados/ (JSON y capturas de los fallos).
   ========================================================= */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('playwright');
const { arrancarServidores } = require('./lib/servidor');
const CONOCIDOS = require('./lib/conocidos');

/* ── Módulos registrados ──────────────────────────────────────
   Para añadir uno: crea modulos/<nombre>.js con
   { nombre, descripcion, casos() } y añádelo a esta lista. */
const MODULOS = [
  require('./modulos/responsive'),
  require('./modulos/interaccion'),
  require('./modulos/servidor'),
  require('./modulos/accesibilidad')
];

const RESULTADOS = path.join(__dirname, 'resultados');
const LIMITE_CASO_MS = 180000;
/* Casos a la vez: los núcleos menos dos, entre 2 y 8 (8 en un equipo de 12) */
const PARALELO = Math.max(2, Math.min(8, os.cpus().length - 2));

function leerArgumentos(argv) {
  const o = { rapido: false, lista: false, modulos: null, paginas: null, caso: null, puerto: null, paralelo: PARALELO };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], sig = () => {
      const v = argv[++i];
      if (v === undefined) throw new Error('Falta el valor de ' + a);
      return v;
    };
    if (a === '--rapido') o.rapido = true;
    else if (a === '--lista') o.lista = true;
    else if (a === '--modulo') o.modulos = sig().split(',');
    else if (a === '--pagina') o.paginas = sig().split(',');
    else if (a === '--caso') o.caso = sig();
    else if (a === '--puerto') o.puerto = Number(sig());
    else if (a === '--paralelo') o.paralelo = Math.max(1, Number(sig()) || 1);
    else if (a === '--ayuda' || a === '-h') { console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0]); process.exit(0); }
    else throw new Error('Opción desconocida: ' + a + ' (usa --ayuda)');
  }
  return o;
}

function filtroCaso(texto) {
  if (!texto) return () => true;
  const m = /^\/(.*)\/([a-z]*)$/.exec(texto);
  if (m) { const re = new RegExp(m[1], m[2]); return id => re.test(id); }
  return id => id.includes(texto);
}

function seleccionarCasos(o) {
  const nombres = MODULOS.map(m => m.nombre);
  if (o.modulos) for (const n of o.modulos) if (!nombres.includes(n)) throw new Error('Módulo desconocido: ' + n + ' (hay: ' + nombres.join(', ') + ')');
  const pasa = filtroCaso(o.caso);
  const lista = [];
  for (const m of MODULOS) {
    if (o.modulos && !o.modulos.includes(m.nombre)) continue;
    for (const c of m.casos()) {
      if (o.rapido && !c.rapido) continue;
      if (o.paginas && !o.paginas.includes(c.pagina)) continue;
      if (!pasa(c.id)) continue;
      lista.push(Object.assign({ modulo: m.nombre }, c));
    }
  }
  const ids = new Set();
  for (const c of lista) { if (ids.has(c.id)) throw new Error('Id de caso repetido: ' + c.id); ids.add(c.id); }
  return lista;
}

const nombreArchivo = id => id.replace(/[^a-z0-9áéíóúñü]+/gi, '_').replace(/^_|_$/g, '').slice(0, 120);

function conRelojTope(promesa, ms, id) {
  let t;
  return Promise.race([
    promesa.finally(() => clearTimeout(t)),
    new Promise((_, rej) => { t = setTimeout(() => rej(new Error('tiempo agotado (' + ms / 1000 + ' s) en ' + id)), ms); })
  ]);
}

/* Marca los fallos de un caso que coinciden EXACTAMENTE (tipo, clave y
   detalle) con un fallo de una entrada conocida: f.conocido = índice */
const mismo = (f, x) => f.tipo === x.tipo && f.clave === x.clave && f.detalle === x.detalle;
function marcarConocidos(r) {
  for (const f of r.fallos) {
    const i = CONOCIDOS.findIndex(k => k.caso.test(r.id) && k.fallos.some(x => mismo(f, x)));
    if (i > -1) f.conocido = i;
  }
}

/* Fallos conocidos que ya no ocurren en ningún caso ejecutado que cubre su
   entrada: [{ k, x }] (x = el fallo de la lista que hay que quitar) */
function clasificar(resultados, todosLosIds) {
  const resueltos = [];
  CONOCIDOS.forEach(k => {
    /* Solo se puede decir que un fallo ya no ocurre si esta ejecución ha
       pasado por TODOS los casos que cubre su entrada (con filtros o con
       --rapido puede faltar justo el caso donde aparece) */
    const ejecutados = new Set(resultados.filter(r => !r.error).map(r => r.id));
    const debidos = todosLosIds.filter(id => k.caso.test(id));
    if (!debidos.length || !debidos.every(id => ejecutados.has(id))) return;
    const cubiertos = resultados.filter(r => k.caso.test(r.id) && !r.error);
    for (const x of k.fallos) if (!cubiertos.some(r => r.fallos.some(f => mismo(f, x)))) resueltos.push({ k, x });
  });
  return resueltos;
}

async function principal() {
  const o = leerArgumentos(process.argv.slice(2));
  const casos = seleccionarCasos(o);
  if (o.lista) {
    for (const c of casos) console.log(c.id + (c.rapido ? '   [rápido]' : ''));
    console.log('\n' + casos.length + ' casos');
    return 0;
  }
  if (!casos.length) { console.error('Ningún caso coincide con los filtros.'); return 1; }

  fs.rmSync(RESULTADOS, { recursive: true, force: true });
  fs.mkdirSync(path.join(RESULTADOS, 'capturas'), { recursive: true });

  const t0 = Date.now();
  const srv = await arrancarServidores(o.puerto);
  const navegadores = new Map();
  const navegador = async (clave, opciones) => {
    if (!navegadores.has(clave)) navegadores.set(clave, chromium.launch(opciones || {}));
    return navegadores.get(clave);
  };
  const principalNav = await navegador('normal');
  console.log('Eleva · batería de QA: ' + casos.length + ' casos, ' + o.paralelo + ' a la vez · servidor ' + srv.base + ' (mantenimiento: ' + srv.baseMantenimiento + ')\n');

  const resultados = [];
  let siguiente = 0, hechos = 0;
  async function trabajador() {
    while (siguiente < casos.length) {
      const c = casos[siguiente++];
      const ini = Date.now();
      const r = { id: c.id, modulo: c.modulo, fallos: [], error: null, captura: null, ms: 0 };
      const entorno = {
        navegador: principalNav,
        lanzar: navegador,
        base: srv.base,
        baseMantenimiento: srv.baseMantenimiento,
        claveMantenimiento: srv.clave,
        async capturar(p, id) {
          const f = path.join(RESULTADOS, 'capturas', nombreArchivo(id) + '.png');
          try { await p.screenshot({ path: f, fullPage: true, timeout: 30000 }); r.captura = path.relative(process.cwd(), f); } catch (e) { /* sin captura */ }
        }
      };
      try {
        r.fallos = (await conRelojTope(Promise.resolve().then(() => c.ejecutar(entorno)), c.limiteMs || LIMITE_CASO_MS, c.id)) || [];
      } catch (e) {
        r.error = (e && e.message ? e.message : String(e)).split('\n')[0];
      }
      r.ms = Date.now() - ini;
      resultados.push(r);
      hechos++;
      marcarConocidos(r);
      const estado = r.error ? 'ERROR ' : r.fallos.some(f => f.conocido === undefined) ? 'FALLO ' : r.fallos.length ? 'conoc.' : 'ok    ';
      console.log(String(hechos).padStart(4) + '/' + casos.length + '  ' + estado + ' ' + c.id + '  (' + (r.ms / 1000).toFixed(1) + ' s)');
    }
  }
  try {
    await Promise.all(Array.from({ length: Math.min(o.paralelo, casos.length) }, trabajador));
  } finally {
    for (const n of navegadores.values()) await (await n).close().catch(() => {});
    srv.parar();
  }

  resultados.sort((a, b) => casos.findIndex(c => c.id === a.id) - casos.findIndex(c => c.id === b.id));
  const resueltos = clasificar(resultados, seleccionarCasos({ rapido: false, modulos: null, paginas: null, caso: null }).map(c => c.id));
  const nuevos = resultados.filter(r => r.error || r.fallos.some(f => f.conocido === undefined));
  const conConocidos = resultados.filter(r => r.fallos.some(f => f.conocido !== undefined));
  const seg = ((Date.now() - t0) / 1000).toFixed(0);

  const linea = '─'.repeat(72);
  if (nuevos.length) {
    console.log('\n' + linea + '\nFALLOS (' + nuevos.length + ' casos)\n' + linea);
    for (const r of nuevos) {
      console.log('\n✗ ' + r.id + (r.captura ? '\n  captura: ' + r.captura : ''));
      if (r.error) console.log('  error del caso: ' + r.error);
      for (const f of r.fallos.filter(x => x.conocido === undefined)) console.log('  · [' + f.tipo + '] ' + f.clave + (f.detalle ? ' — ' + f.detalle : '') + (f.veces > 1 ? ' (×' + f.veces + ')' : ''));
    }
  }
  if (conConocidos.length || CONOCIDOS.length) {
    console.log('\n' + linea + '\nFALLOS CONOCIDOS DEL SITIO, SIN ARREGLAR (lib/conocidos.js)\n' + linea);
    CONOCIDOS.forEach((k, i) => {
      const casosK = conConocidos.filter(r => r.fallos.some(f => f.conocido === i));
      console.log('\n! ' + k.motivo + '\n  apuntado: ' + k.apuntado + ' · casos afectados en esta ejecución: ' + casosK.length);
      for (const r of casosK.slice(0, 6)) console.log('    ' + r.id + (r.captura ? '  → ' + r.captura : ''));
      if (casosK.length > 6) console.log('    … y ' + (casosK.length - 6) + ' más');
    });
  }
  if (resueltos.length) {
    console.log('\n' + linea + '\nCONOCIDOS QUE YA NO FALLAN: quítalos de lib/conocidos.js (y la entrada si queda vacía)\n' + linea);
    for (const { k, x } of resueltos) console.log('  · ' + k.motivo.slice(0, 70) + '…\n      [' + x.tipo + '] ' + x.clave + ' — ' + x.detalle);
  }

  const ok = !nuevos.length && !resueltos.length;
  const resumen = {
    fecha: new Date().toISOString(), segundos: Number(seg), casos: casos.length,
    correctos: resultados.filter(r => !r.error && !r.fallos.length).length,
    conFallos: nuevos.length, conFallosConocidos: conConocidos.length, conocidosResueltos: resueltos.length,
    filtros: { rapido: o.rapido, modulos: o.modulos, paginas: o.paginas, caso: o.caso },
    resultados
  };
  fs.writeFileSync(path.join(RESULTADOS, 'resultado.json'), JSON.stringify(resumen, null, 1));
  console.log('\n' + linea);
  console.log((ok ? 'BIEN' : 'MAL') + ': ' + resumen.correctos + ' correctos, ' + nuevos.length + ' con fallos, ' +
    conConocidos.length + ' con fallos conocidos, ' + resueltos.length + ' conocidos resueltos · ' + casos.length + ' casos en ' + seg + ' s');
  console.log('Detalle: ' + path.relative(process.cwd(), path.join(RESULTADOS, 'resultado.json')));
  return ok ? 0 : 1;
}

principal().then(c => { process.exitCode = c; }, e => { console.error('La batería no ha podido ejecutarse: ' + (e && e.stack || e)); process.exitCode = 2; });
