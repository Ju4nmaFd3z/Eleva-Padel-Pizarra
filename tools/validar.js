#!/usr/bin/env node
/* =========================================================
   VALIDADOR DEL SITIO (herramienta local; tools/ no se publica)
   ---------------------------------------------------------
   node tools/validar.js            → informe; sale con código 1 si hay errores
   node tools/validar.js --dias 60  → otro plazo de reconfirmación

   Comprueba:
   · PENDIENTE_CLUB / PENDIENTE_MARCA en los archivos servidos (los lista)
   · datos con `verificado` más antiguos que el plazo (90 días por defecto)
   · eventos sin `hasta` válido o ya caducados
   · mismas claves de i18n en ES, EN y NL
   · mismo ?v= en todos los HTML
   · ningún <script> inline salvo JSON-LD (la CSP es 'self')
   · HTML de cada club sincronizado con su manifest (tools/generar.js)
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const DIAS = Number(args[args.indexOf('--dias') + 1]) || 90;
const HOY = new Date();
const errores = [], avisos = [], info = [];

const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const ignorados = fs.readFileSync(path.join(ROOT, '.vercelignore'), 'utf8')
  .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
const esIgnorado = r => ignorados.some(p => p.endsWith('/') ? r.startsWith(p) : (r === p || r.startsWith(p + '/')));

function recorrer(dir, out = []) {
  for (const n of fs.readdirSync(dir)) {
    if (n.startsWith('.') || n === 'node_modules') continue;
    const p = path.join(dir, n);
    if (esIgnorado(rel(p))) continue;
    if (fs.statSync(p).isDirectory()) recorrer(p, out); else out.push(p);
  }
  return out;
}
const servidos = recorrer(ROOT);
const texto = servidos.filter(p => /\.(html|js|css|json|xml|txt|svg)$/.test(p));

/* 1. Pendientes */
for (const p of texto) {
  fs.readFileSync(p, 'utf8').split('\n').forEach((l, i) => {
    const m = l.match(/PENDIENTE_(CLUB|MARCA)/g);
    if (m) info.push(`${rel(p)}:${i + 1}  ${l.trim().slice(0, 110)}`);
  });
}

/* 2-3. Manifests: fechas de verificación y eventos */
function cargarManifest(p) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(p, 'utf8'), ctx, { filename: p });
  return ctx.window.__ELEVA__;
}
function revisarFechas(obj, ruta, archivo) {
  if (!obj || typeof obj !== 'object') return;
  if (typeof obj.verificado === 'string') {
    const f = new Date(obj.verificado + 'T00:00:00');
    const dias = Math.floor((HOY - f) / 864e5);
    if (isNaN(f)) errores.push(`${archivo}: ${ruta}.verificado no es una fecha (${obj.verificado})`);
    else if (dias > DIAS) avisos.push(`${archivo}: ${ruta} verificado hace ${dias} días (${obj.verificado}): reconfirmar`);
  }
  for (const k of Object.keys(obj)) revisarFechas(obj[k], ruta ? `${ruta}.${k}` : k, archivo);
}
for (const p of servidos.filter(p => p.endsWith('manifest.js'))) {
  let m;
  try { m = cargarManifest(p); } catch (e) { errores.push(`${rel(p)}: no se puede cargar (${e.message})`); continue; }
  revisarFechas(m, '', rel(p));
  (m.eventos || []).forEach(ev => {
    const hasta = Date.parse(ev && ev.hasta);
    if (isNaN(hasta)) errores.push(`${rel(p)}: evento «${ev && ev.id}» sin fecha de fin válida`);
    else if (hasta < HOY) avisos.push(`${rel(p)}: evento «${ev.id}» caducado el ${ev.hasta}: bórralo`);
  });
}

/* 4. Claves i18n */
{
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js/translations.js'), 'utf8'), ctx);
  const t = ctx.window.__ELEVA_I18N__ || {};
  const claves = o => Object.keys(o).flatMap(k => (o[k] && typeof o[k] === 'object') ? claves(o[k]).map(s => `${k}.${s}`) : [k]);
  const es = new Set(claves(t.es || {}));
  for (const l of ['en', 'nl']) {
    const otro = new Set(claves(t[l] || {}));
    const faltan = [...es].filter(k => !otro.has(k)), sobran = [...otro].filter(k => !es.has(k));
    if (faltan.length) errores.push(`i18n ${l}: faltan ${faltan.join(', ')}`);
    if (sobran.length) errores.push(`i18n ${l}: sobran ${sobran.join(', ')}`);
  }
  info.unshift(`i18n: ${es.size} claves por idioma`);
}

/* 5-6. HTML: cache-buster y scripts inline */
const versiones = new Map();
for (const p of servidos.filter(p => p.endsWith('.html'))) {
  const s = fs.readFileSync(p, 'utf8');
  for (const m of s.matchAll(/\?v=([0-9a-z]+)/g)) versiones.set(m[1], (versiones.get(m[1]) || []).concat(rel(p)));
  for (const m of s.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)) {
    if (!/application\/ld\+json/.test(m[1])) errores.push(`${rel(p)}: <script> inline (la CSP lo bloquearía)`);
  }
}
if (versiones.size > 1) errores.push('cache-buster distinto: ' + [...versiones].map(([v, f]) => `${v} (${[...new Set(f)].join(', ')})`).join(' · '));

/* 7. HTML de cada club generado desde su manifest */
try {
  const { generar, clubes } = require('./generar.js');
  for (const slug of clubes()) {
    if (generar(slug).cambiado) errores.push(`${slug}/index.html no está generado desde su manifest: ejecuta node tools/generar.js`);
  }
} catch (e) { errores.push('tools/generar.js falló: ' + e.message); }

console.log(`\nValidación (${HOY.toISOString().slice(0, 10)}, plazo ${DIAS} días)\n`);
if (info.length) console.log('Pendientes e info:\n  ' + info.join('\n  ') + '\n');
if (avisos.length) console.log('AVISOS:\n  ' + avisos.join('\n  ') + '\n');
if (errores.length) console.log('ERRORES:\n  ' + errores.join('\n  ') + '\n');
console.log(errores.length ? `✗ ${errores.length} error(es)` : '✓ sin errores');
process.exit(errores.length ? 1 : 0);
