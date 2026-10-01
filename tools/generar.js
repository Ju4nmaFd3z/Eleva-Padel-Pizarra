#!/usr/bin/env node
/* =========================================================
   GENERADOR DEL HTML DE LOS CLUBES (herramienta local; tools/ no se publica)
   ---------------------------------------------------------
   node tools/generar.js          → escribe el HTML de cada club
   node tools/generar.js --check  → no escribe; sale con 1 si algo no está al día

   Para cada carpeta de club (<slug>/index.html + <slug>/manifest.js):
   · rellena las zonas data-gen="…" (entre <!--gen--> y <!--/gen-->) con el
     HTML en español que produce js/render.js, el mismo código que usa el
     navegador al cambiar de idioma;
   · pone o quita `hidden` en cada elemento data-seccion="…" según haya datos;
   · escribe los href de los enlaces data-href="…" desde el manifest;
   · genera el JSON-LD (entre <!--gen:jsonld--> y <!--/gen:jsonld-->).
   Así todo lo confirmado se ve sin JavaScript. Vercel no ejecuta nada:
   el HTML generado se versiona. El pre-commit lo ejecuta solo.
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://eleva-padel-pizarra.vercel.app';
const render = require(path.join(ROOT, 'js/render.js'));

function cargar(archivo, global) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(archivo, 'utf8'), ctx, { filename: archivo });
  return ctx.window[global];
}

function clubes() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && !['clubs', 'tools', 'node_modules', 'assets', 'css', 'js'].includes(d.name))
    .map(d => d.name)
    .filter(n => fs.existsSync(path.join(ROOT, n, 'manifest.js')) && fs.existsSync(path.join(ROOT, n, 'index.html')));
}

function generar(slug) {
  const htmlPath = path.join(ROOT, slug, 'index.html');
  const data = cargar(path.join(ROOT, slug, 'manifest.js'), '__ELEVA__');
  const i18n = cargar(path.join(ROOT, 'js/translations.js'), '__ELEVA_I18N__');
  const t = clave => clave.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), i18n.es) || '';
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

  return { slug, htmlPath, html, cambiado: html !== original };
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  let pendientes = 0;
  for (const slug of clubes()) {
    const r = generar(slug);
    if (!r.cambiado) { console.log(`= ${slug}/index.html al día`); continue; }
    if (check) { pendientes++; console.log(`✗ ${slug}/index.html no está generado: ejecuta node tools/generar.js`); }
    else { fs.writeFileSync(r.htmlPath, r.html); console.log(`✓ ${slug}/index.html generado`); }
  }
  process.exit(pendientes ? 1 : 0);
}

module.exports = { generar, clubes };
