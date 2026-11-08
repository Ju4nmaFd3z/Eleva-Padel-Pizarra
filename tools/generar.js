#!/usr/bin/env node
/* =========================================================
   GENERADOR DEL HTML (herramienta local; tools/ no se publica)
   ---------------------------------------------------------
   node tools/generar.js          → escribe lo generado
   node tools/generar.js --check  → no escribe; sale con 1 si algo no está al día

   1. Para cada carpeta de club (<slug>/index.html + <slug>/manifest.js):
      · rellena las zonas data-gen="…" (entre <!--gen--> y <!--/gen-->) con el
        HTML en español que produce js/render.js, el mismo código que usa el
        navegador al cambiar de idioma;
      · pone o quita `hidden` en cada elemento data-seccion="…" según haya datos;
      · alterna data-superficie="tinta" entre las secciones visibles;
      · escribe los href de los enlaces data-href="…" desde el manifest;
      · genera el JSON-LD (entre <!--gen:jsonld--> y <!--/gen:jsonld-->).
   2. En cada página servida (las de los clubes, index.html, 404.html,
      privacidad.html y la de mantenimiento, dentro de middleware.js) escribe
      en español, desde js/translations.js, el texto de cada elemento
      data-i18n="clave" y los atributos de data-i18n-attr="atributo:clave;…" y
      data-i18n-fijo="atributo:clave". Así cada texto tiene una sola fuente.
   Todo lo confirmado se ve sin JavaScript. Vercel no ejecuta nada: lo
   generado se versiona. El pre-commit lo ejecuta solo.
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://eleva-padel-pizarra.vercel.app';
const render = require(path.join(ROOT, 'js/render.js'));

/* Páginas sin club que llevan textos de interfaz */
const PAGINAS = ['index.html', '404.html', 'privacidad.html'];
const MANTENIMIENTO = 'middleware.js';

function cargar(archivo, global) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(archivo, 'utf8'), ctx, { filename: archivo });
  return ctx.window[global];
}
function textos() {
  delete require.cache[require.resolve('../js/translations.js')];
  return require('../js/translations.js').textos;
}

function clubes() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && !['clubs', 'tools', 'node_modules', 'assets', 'css', 'js', 'lib'].includes(d.name))
    .map(d => d.name)
    .filter(n => fs.existsSync(path.join(ROOT, n, 'manifest.js')) && fs.existsSync(path.join(ROOT, n, 'index.html')));
}

/* Texto en español de una clave (con {codigo} = ES); lanza si no existe */
function espanol(T, clave, donde) {
  if (!Object.prototype.hasOwnProperty.call(T, clave)) throw new Error(`${donde}: la clave «${clave}» no está en js/translations.js`);
  return T[clave].es.replace(/\{codigo\}/g, 'ES');
}

/* Escribe los textos de interfaz en español en un HTML (o en la plantilla
   de mantenimiento). Los elementos data-i18n solo pueden llevar texto. */
function aplicarTextos(html, donde) {
  const T = textos();
  let hechos = 0;
  html = html.replace(/(<([a-z0-9]+)\b[^>]*?\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, apertura, tag, clave, dentro, cierre) => {
    hechos++;
    return apertura + render.esc(espanol(T, clave, donde)) + cierre;
  });
  const total = (html.match(/\sdata-i18n="/g) || []).length;
  if (total !== hechos) throw new Error(`${donde}: hay elementos data-i18n con etiquetas dentro (solo pueden llevar texto)`);
  html = html.replace(/<[a-z0-9]+\b[^>]*\sdata-i18n-(?:attr|fijo)="[^"]*"[^>]*>/g, etiqueta => {
    for (const m of etiqueta.matchAll(/\sdata-i18n-(?:attr|fijo)="([^"]*)"/g)) {
      for (const par of m[1].split(';')) {
        const i = par.indexOf(':');
        if (i < 1) throw new Error(`${donde}: data-i18n-attr mal escrito: «${m[1]}»`);
        const atr = par.slice(0, i).trim(), clave = par.slice(i + 1).trim();
        const valor = render.esc(espanol(T, clave, donde));
        const re = new RegExp('(\\s' + atr + '=")[^"]*(")');
        etiqueta = re.test(etiqueta) ? etiqueta.replace(re, (x, a, b) => a + valor + b)
          : etiqueta.replace(/\sdata-i18n-(attr|fijo)="/, x => ` ${atr}="${valor}"` + x);
      }
    }
    return etiqueta;
  });
  return html;
}

function generar(slug) {
  const htmlPath = path.join(ROOT, slug, 'index.html');
  const data = cargar(path.join(ROOT, slug, 'manifest.js'), '__ELEVA__');
  const T = textos();
  const t = clave => (T[clave] ? T[clave].es : '');
  const s = render.crear(data, 'es', t);
  const c = data.contacto || {};
  const ok = render.presente;

  let html = fs.readFileSync(htmlPath, 'utf8');
  const original = html;

  /* JSON-LD: los marcadores van fuera del <script> para que el JSON sea válido */
  html = html.replace(/<!--gen:jsonld-->[\s\S]*?<!--\/gen:jsonld-->/, () =>
    '<!--gen:jsonld--><script type="application/ld+json">\n' + render.jsonld(data, BASE) + '\n</script><!--/gen:jsonld-->');

  /* Zonas generadas */
  html = html.replace(/(data-gen="([a-z-]+)"[^>]*>)<!--gen-->[\s\S]*?<!--\/gen-->/g, (m, apertura, id) => {
    if (!s[id]) throw new Error(`${slug}: zona data-gen="${id}" desconocida`);
    return `${apertura}<!--gen-->${s[id].html}<!--/gen-->`;
  });

  /* Visibilidad de secciones y de sus enlaces */
  html = html.replace(/<([a-z]+)([^>]*?)\sdata-seccion="([a-z-]+)"([^>]*?)>/g, (m, tag, antes, id, despues) => {
    if (!s[id]) return m;
    return `<${tag}${antes.replace(/\shidden\b/g, '')} data-seccion="${id}"${despues.replace(/\shidden\b/g, '')}${s[id].visible ? '' : ' hidden'}>`;
  });

  /* Superficies alternas: entre las secciones visibles, por orden, la
     primera tinta, la siguiente negro… Así una sección que aparece o
     desaparece no deja dos del mismo color seguidas. */
  let orden = 0;
  html = html.replace(/<section\b([^>]*)>/g, (m, attrs) => {
    if (!/\sclass="(?:[^"]*\s)?seccion(?:\s[^"]*)?"/.test(attrs)) return m;
    const limpio = attrs.replace(/\sdata-superficie="[^"]*"/g, '');
    if (/\shidden\b/.test(limpio) || orden++ % 2) return `<section${limpio}>`;
    return `<section${limpio.replace(/(\sclass="[^"]*")/, '$1 data-superficie="tinta"')}>`;
  });

  /* Enlaces desde el manifest */
  const destinos = {
    reservas:  ok(c.reservas) ? c.reservas : null,
    whatsapp:  ok(c.whatsapp) ? 'https://wa.me/' + c.whatsapp : null,
    instagram: ok(c.instagram) ? c.instagram.url : null,
    comunidad: ok(c.comunidad) ? c.comunidad : null,
    maps:      ok(c.mapsUrl) ? c.mapsUrl : null
  };
  html = html.replace(/<a([^>]*?)\shref="[^"]*"([^>]*?)\sdata-href="([a-z]+)"([^>]*)>/g, (m, a, b, clave, d) => {
    if (!(clave in destinos)) throw new Error(`${slug}: data-href="${clave}" desconocido`);
    const url = destinos[clave];
    return `<a${a} href="${url ? render.esc(url) : '#'}"${b.replace(/\shidden\b/g, '')} data-href="${clave}"${d.replace(/\shidden\b/g, '')}${url ? '' : ' hidden'}>`;
  });

  html = aplicarTextos(html, slug + '/index.html');
  return { rel: slug + '/index.html', archivo: htmlPath, html, cambiado: html !== original };
}

function generarPagina(rel) {
  const archivo = path.join(ROOT, rel);
  const original = fs.readFileSync(archivo, 'utf8');
  const html = aplicarTextos(original, rel);
  return { rel, archivo, html, cambiado: html !== original };
}

/* La página de mantenimiento es la plantilla PAGINA de middleware.js */
function generarMantenimiento() {
  const archivo = path.join(ROOT, MANTENIMIENTO);
  const original = fs.readFileSync(archivo, 'utf8');
  const re = /(const PAGINA = `)([\s\S]*?)(`;)/;
  const m = original.match(re);
  if (!m) throw new Error(MANTENIMIENTO + ': no se encuentra la plantilla PAGINA');
  const pagina = aplicarTextos(m[2], MANTENIMIENTO);
  if (/`|\$\{/.test(pagina)) throw new Error(MANTENIMIENTO + ': un texto rompería la plantilla (` o ${)');
  const html = original.replace(re, (x, a, b, c) => a + pagina + c);
  return { rel: MANTENIMIENTO, archivo, html, cambiado: html !== original };
}

/* Todo lo que genera esta herramienta */
function todo() {
  return clubes().map(generar)
    .concat(PAGINAS.filter(p => fs.existsSync(path.join(ROOT, p))).map(generarPagina))
    .concat([generarMantenimiento()]);
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  let pendientes = 0;
  for (const r of todo()) {
    if (!r.cambiado) { console.log(`= ${r.rel} al día`); continue; }
    if (check) { pendientes++; console.log(`✗ ${r.rel} no está generado: ejecuta node tools/generar.js`); }
    else { fs.writeFileSync(r.archivo, r.html); console.log(`✓ ${r.rel} generado`); }
  }
  process.exit(pendientes ? 1 : 0);
}

module.exports = { generar, clubes, todo, aplicarTextos };
