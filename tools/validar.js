#!/usr/bin/env node
/* =========================================================
   VALIDADOR DEL SITIO (herramienta local; tools/ no se publica)
   ---------------------------------------------------------
   node tools/validar.js            → informe; sale con código 1 si hay errores
   node tools/validar.js --dias 60  → otro plazo de reconfirmación
   node tools/validar.js --estricto → una traducción pendiente es error

   Comprueba:
   · PENDIENTE_CLUB / PENDIENTE_MARCA en los archivos servidos (los lista)
   · datos con `verificado` más antiguos que el plazo (90 días por defecto)
   · bloques que caducan publicados sin `verificado` o sin `fuente`
   · eventos sin `hasta` válido o ya caducados
   · i18n (tools/i18n.js): cada texto con sus tres idiomas y su huella;
     traducción desfasada = error; pendiente = aviso (error con --estricto
     o cuando PERMITIR_PENDIENTES sea false); claves sin uso o que no
     existen; ningún texto visible sin clave en las páginas servidas ni en
     los datos del manifest; nombres propios iguales en el código y en
     CLAUDE.md
   · mismo ?v= en todos los HTML
   · ningún <script> inline salvo JSON-LD (la CSP es 'self')
   · lo generado al día: HTML de cada club, textos de interfaz de cada
     página y página de mantenimiento (tools/generar.js)
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const DIAS = args.includes('--dias') ? Number(args[args.indexOf('--dias') + 1]) || 90 : 90;
const ESTRICTO = args.includes('--estricto');
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
/* Bloques que caducan: si se publican, llevan `verificado` (AAAA-MM-DD) y `fuente` */
const CADUCAN = ['instalaciones', 'reservas', 'tarifas.pistas', 'tarifas.clases', 'tarifas.infantil',
  'otrosServicios', 'cancelaciones', 'pools', 'pools.horario', 'colaborar', 'colaborar.disponibilidad', 'contacto.geo'];
const { presente } = require('../js/render.js');
function revisarCaducables(m, archivo) {
  for (const ruta of CADUCAN) {
    const v = ruta.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), m);
    if (!presente(v) || typeof v !== 'object') continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.verificado || '')) errores.push(`${archivo}: ${ruta} se publica sin \`verificado\` (AAAA-MM-DD)`);
    if (!presente(v.fuente)) errores.push(`${archivo}: ${ruta} se publica sin \`fuente\``);
  }
  /* El número que pinta «Colaborar» es el mismo WhatsApp del club */
  const co = m.colaborar, wa = m.contacto && m.contacto.whatsapp;
  if (presente(co) && typeof co === 'object' && presente(co.numero)) {
    if (!presente(wa) || !wa.endsWith(String(co.numero).replace(/\D/g, ''))) errores.push(`${archivo}: colaborar.numero no coincide con contacto.whatsapp`);
  }
}
for (const p of servidos.filter(p => p.endsWith('manifest.js'))) {
  let m;
  try { m = cargarManifest(p); } catch (e) { errores.push(`${rel(p)}: no se puede cargar (${e.message})`); continue; }
  revisarFechas(m, '', rel(p));
  revisarCaducables(m, rel(p));
  (m.eventos || []).forEach(ev => {
    const hasta = Date.parse(ev && ev.hasta);
    if (isNaN(hasta)) errores.push(`${rel(p)}: evento «${ev && ev.id}» sin fecha de fin válida`);
    else if (hasta < HOY) avisos.push(`${rel(p)}: evento «${ev.id}» caducado el ${ev.hasta}: bórralo`);
  });
}

/* 4. i18n: una sola fuente por texto, con sus tres idiomas y su huella */
{
  const I = require('./i18n.js');
  const T = require('../js/translations.js');
  const lista = I.entradas();
  errores.push(...I.erroresDeFormato(lista).map(e => 'i18n: ' + e));

  /* Estado de cada traducción */
  const pendientes = { en: [], nl: [] };
  for (const e of lista) for (const l of I.TRADUCIDOS) {
    if (e.estado[l] === 'desfasada') errores.push(`i18n ${l}: ${e.id} desfasada (el español ha cambiado o falta la huella): retradúcela y pon h.${l} = ${e.huella}`);
    if (e.estado[l] === 'pendiente') pendientes[l].push(e.id);
  }
  const nPend = pendientes.en.length + pendientes.nl.length;
  if (nPend) {
    const msg = `i18n: TRADUCCIONES PENDIENTES: ${pendientes.en.length} sin inglés y ${pendientes.nl.length} sin neerlandés (se pintan en español con lang="es"). Lista: node tools/i18n.js estado`;
    if (ESTRICTO || !I.PERMITIR_PENDIENTES) errores.push(msg); else avisos.push(msg + '. Fase B del punto 7: PERMITIR_PENDIENTES = true en tools/i18n.js');
  }

  /* Claves usadas que no existen y claves que nadie usa */
  const usos = I.usosDeInterfaz();
  for (const k of Object.keys(usos)) if (!T.textos[k]) errores.push(`i18n: la clave «${k}» se usa (${usos[k][0]}) y no está en js/translations.js`);
  for (const k of Object.keys(T.textos)) if (!usos[k]) errores.push(`i18n: la clave «${k}» no se usa en ninguna página: bórrala`);

  /* Textos visibles o audibles sin clave en lo servido */
  const paginas = I.clubes().map(c => c + '/index.html').concat(['index.html', '404.html']);
  for (const p of paginas) for (const x of I.textosSinClave(fs.readFileSync(path.join(ROOT, p), 'utf8'))) errores.push(`i18n: ${p}: texto sin clave ${x}`);
  const mant = (fs.readFileSync(path.join(ROOT, 'middleware.js'), 'utf8').match(/const PAGINA = `([\s\S]*?)`;/) || [])[1];
  if (!mant) errores.push('i18n: middleware.js sin plantilla PAGINA');
  else for (const x of I.textosSinClave(mant)) errores.push(`i18n: mantenimiento (middleware.js): texto sin clave ${x}`);
  info.push('i18n: privacidad.html queda fuera de la comprobación de textos sin clave hasta el bloque legal (decisión D1)');
  const render = require('../js/render.js');
  for (const c of I.clubes()) {
    for (const x of I.textosSueltosDelManifest(I.cargarManifest(path.join(ROOT, c, 'manifest.js')), render)) errores.push(`i18n: ${c}/manifest.js: texto que se pinta sin { es, en, nl } y no es neutro: ${x}`);
  }

  /* NOMBRES_PROPIOS: la copia de CLAUDE.md es exacta */
  const claude = fs.readFileSync(path.join(ROOT, 'CLAUDE.md'), 'utf8');
  const bloque = (claude.match(/\*\*Nombres propios que no se traducen\*\*[^\n]*\n?((?:[^\n]+\n?)*)/) || [])[0] || '';
  const copia = [...bloque.matchAll(/«([^»]+)»/g)].map(m => m[1]);
  if (copia.join('|') !== T.nombresPropios.join('|')) errores.push('i18n: la lista «Nombres propios que no se traducen» de CLAUDE.md no es igual que NOMBRES_PROPIOS de js/translations.js');

  const nInterfaz = lista.filter(e => e.origen === 'interfaz').length;
  info.unshift(`i18n: ${lista.length} textos (${nInterfaz} de interfaz, ${lista.length - nInterfaz} de manifests) · pendientes: ${pendientes.en.length} EN, ${pendientes.nl.length} NL`);
}

/* 5-6. HTML (y la página de mantenimiento): cache-buster y scripts inline */
const versiones = new Map();
for (const p of servidos.filter(p => p.endsWith('.html') || rel(p) === 'middleware.js')) {
  const s = fs.readFileSync(p, 'utf8');
  for (const m of s.matchAll(/\?v=([0-9a-z]+)/g)) versiones.set(m[1], (versiones.get(m[1]) || []).concat(rel(p)));
  for (const m of s.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)) {
    if (!/application\/ld\+json/.test(m[1])) errores.push(`${rel(p)}: <script> inline (la CSP lo bloquearía)`);
  }
}
if (versiones.size > 1) errores.push('cache-buster distinto: ' + [...versiones].map(([v, f]) => `${v} (${[...new Set(f)].join(', ')})`).join(' · '));

/* 7. Lo generado, al día (HTML de los clubes, textos de cada página y mantenimiento) */
try {
  const { todo } = require('./generar.js');
  for (const r of todo()) {
    if (r.cambiado) errores.push(`${r.rel} no está generado (manifest o js/translations.js): ejecuta node tools/generar.js`);
  }
} catch (e) { errores.push('tools/generar.js falló: ' + e.message); }

console.log(`\nValidación (${HOY.toISOString().slice(0, 10)}, plazo ${DIAS} días)\n`);
if (info.length) console.log('Pendientes e info:\n  ' + info.join('\n  ') + '\n');
if (avisos.length) console.log('AVISOS:\n  ' + avisos.join('\n  ') + '\n');
if (errores.length) console.log('ERRORES:\n  ' + errores.join('\n  ') + '\n');
console.log(errores.length ? `✗ ${errores.length} error(es)` : '✓ sin errores');
process.exit(errores.length ? 1 : 0);
