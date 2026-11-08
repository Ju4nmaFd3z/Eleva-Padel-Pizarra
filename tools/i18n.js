#!/usr/bin/env node
/* =========================================================
   TRADUCCIONES (herramienta local; tools/ no se publica)
   ---------------------------------------------------------
   node tools/i18n.js estado        → cada texto con su estado en EN y NL
   node tools/i18n.js exportar F    → escribe F (JSON) con los textos a
                                      traducir: clave, español, huella,
                                      EN/NL actuales y dónde se ven

   Una sola fuente por texto:
   · interfaz: js/translations.js, { es, en, nl, h: { en, nl } } por clave;
   · datos de cada club: su manifest, los mismos objetos { es, en, nl, h }.
   `h` es la HUELLA del español del que salió cada traducción (los 8 primeros
   caracteres hexadecimales del SHA-256 del texto normalizado). Si el español
   cambia, la huella deja de coincidir y la traducción está DESFASADA.

   Estados de cada traducción (EN y NL por separado):
     al-dia     hay texto y su huella coincide con el español actual
     pendiente  no hay texto (el navegador pinta el español marcado lang="es")
     desfasada  hay texto pero la huella no coincide (o no tiene huella)
   validar.js: «desfasada» es siempre error; «pendiente» es aviso mientras
   PERMITIR_PENDIENTES sea true (fase A: traducciones encargadas) y error
   cuando pase a false (commit que integra las traducciones revisadas) o con
   `node tools/validar.js --estricto`.
   ========================================================= */
'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const IDIOMAS = ['es', 'en', 'nl'];
const TRADUCIDOS = ['en', 'nl'];

/* Fase A del punto 7: las traducciones revisadas aún no están. Pasa a false
   en el commit que las integra; desde entonces un texto sin traducir es error. */
const PERMITIR_PENDIENTES = true;

/* Textos fijos que no son nombres propios pero no se traducen nunca:
   la atribución de OpenStreetMap (licencia ODbL, en inglés). */
const TEXTOS_FIJOS = ['© OpenStreetMap contributors'];

const textos = () => {
  delete require.cache[require.resolve('../js/translations.js')];
  return require('../js/translations.js');
};

function normalizar(s) {
  return String(s == null ? '' : s).normalize('NFC').replace(/\s+/g, ' ').trim();
}
function huella(es) {
  return crypto.createHash('sha256').update(normalizar(es), 'utf8').digest('hex').slice(0, 8);
}

/* Un texto es neutro si, quitando nombres propios, textos fijos, URL, cuentas,
   códigos de idioma, cifras, precios, horas, teléfonos, signos y letras
   mayúsculas sueltas (la inicial de una persona), no queda nada. */
function esNeutro(s, nombres) {
  let r = normalizar(s);
  if (!r) return true;
  const lista = (nombres || textos().nombresPropios).concat(TEXTOS_FIJOS).slice().sort((a, b) => b.length - a.length);
  for (const n of lista) r = r.split(n).join(' ');
  r = r.replace(/https?:\/\/\S+/g, ' ')
    .replace(/@[\w.]+/g, ' ')
    .replace(/\b(ES|EN|NL)\b/g, ' ')
    .replace(/(^|\s)\p{Lu}(?=\s|$)/gu, ' ')
    .replace(/\d+\s*min\b/g, ' ')
    .replace(/[+]?\d[\d\s.,:/–-]*/g, ' ')
    .replace(/[\s\p{P}\p{S}]+/gu, '');
  return r === '';
}

/* ── Recorrido de las fuentes ─────────────────────────────── */

function cargarManifest(archivo) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(archivo, 'utf8'), ctx, { filename: archivo });
  return ctx.window.__ELEVA__;
}

function clubes() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && !['clubs', 'tools', 'node_modules', 'assets', 'css', 'js', 'lib'].includes(d.name))
    .map(d => d.name)
    .filter(n => fs.existsSync(path.join(ROOT, n, 'manifest.js')));
}

/* Objetos traducibles del manifest: los que tienen `es` (y solo campos de
   idioma y `h`). ruta: 'tarifas.clases.grupo.titulo', 'pools.horario.items.0.dia'… */
function traduciblesDelManifest(m) {
  const out = [];
  (function ir(o, ruta) {
    if (!o || typeof o !== 'object') return;
    if (!Array.isArray(o) && typeof o.es === 'string') { out.push({ ruta, obj: o }); return; }
    for (const k of Object.keys(o)) ir(o[k], ruta ? ruta + '.' + k : k);
  })(m, '');
  return out;
}

function estadoDe(obj, l) {
  const v = obj[l];
  const h = obj.h && obj.h[l];
  if (v == null || v === '') return h ? 'desfasada' : 'pendiente';
  if (!h || h !== huella(obj.es)) return 'desfasada';
  return 'al-dia';
}

/* Todas las entradas traducibles: interfaz y manifests */
function entradas() {
  const T = textos();
  const lista = [];
  for (const [clave, obj] of Object.entries(T.textos)) {
    lista.push({ id: clave, origen: 'interfaz', obj, soloEs: obj.soloEs === true });
  }
  for (const slug of clubes()) {
    const m = cargarManifest(path.join(ROOT, slug, 'manifest.js'));
    for (const { ruta, obj } of traduciblesDelManifest(m)) {
      lista.push({ id: slug + ':' + ruta, origen: slug + '/manifest.js', obj, soloEs: false });
    }
  }
  for (const e of lista) {
    e.es = e.obj.es;
    e.huella = huella(e.obj.es);
    e.estado = {};
    for (const l of TRADUCIDOS) e.estado[l] = e.soloEs ? 'solo-es' : estadoDe(e.obj, l);
  }
  return lista;
}

/* Comprobaciones de formato que no dependen del estado: errores siempre */
function erroresDeFormato(lista) {
  const err = [];
  const marcas = s => (String(s).match(/\{[a-z]+\}/g) || []).sort().join(',');
  for (const e of lista) {
    const permitidas = new Set(IDIOMAS.concat(['h', 'soloEs']));
    for (const k of Object.keys(e.obj)) if (!permitidas.has(k)) err.push(`${e.id}: campo desconocido «${k}»`);
    if (!normalizar(e.es)) err.push(`${e.id}: el español está vacío`);
    if (e.soloEs) {
      if (e.obj.en != null || e.obj.nl != null || e.obj.h) err.push(`${e.id}: soloEs no lleva traducciones ni huella`);
      continue;
    }
    for (const l of TRADUCIDOS) {
      const v = e.obj[l];
      if (v != null && v !== '' && marcas(v) !== marcas(e.es)) err.push(`${e.id} (${l}): no tiene las mismas marcas {…} que el español`);
    }
  }
  return err;
}

/* ── Dónde se ve cada clave de interfaz (para el traductor) ── */
function usosDeInterfaz() {
  const usos = {};
  const anota = (k, d) => { (usos[k] = usos[k] || []).push(d); };
  const paginas = { 'index.html': '/', 'pizarra/index.html': '/pizarra', '404.html': '404', 'privacidad.html': '/privacidad', 'middleware.js': 'mantenimiento' };
  for (const [archivo, pagina] of Object.entries(paginas)) {
    const p = path.join(ROOT, archivo);
    if (!fs.existsSync(p)) continue;
    const s = fs.readFileSync(p, 'utf8');
    for (const m of s.matchAll(/<([a-z0-9]+)\b([^>]*)>/g)) {
      const tag = m[1], at = m[2];
      const id = (at.match(/\sid="([^"]+)"/) || [])[1];
      const cls = (at.match(/\sclass="([^"]+)"/) || [])[1];
      const donde = pagina + ' · <' + tag + (id ? '#' + id : '') + (cls ? '.' + cls.split(' ').join('.') : '') + '>';
      const k = (at.match(/\sdata-i18n="([^"]+)"/) || [])[1];
      if (k) anota(k, donde + ' (texto)');
      for (const a of ['data-i18n-attr', 'data-i18n-fijo']) {
        const v = (at.match(new RegExp('\\s' + a + '="([^"]+)"')) || [])[1];
        if (v) for (const par of v.split(';')) { const [atr, clave] = par.split(':'); anota(clave, donde + ' (atributo ' + atr + (a === 'data-i18n-fijo' ? ', solo en español' : '') + ')'); }
      }
      const wa = (at.match(/\sdata-wa="([^"]+)"/) || [])[1];
      if (wa) anota(wa, donde + ' (mensaje de WhatsApp de este enlace)');
    }
  }
  for (const archivo of ['js/render.js', 'js/main.js']) {
    const s = fs.readFileSync(path.join(ROOT, archivo), 'utf8');
    for (const m of s.matchAll(/\b(?:t|tr)\('([a-z0-9]+\.[A-Za-z0-9.]+)'/g)) anota(m[1], '/pizarra · pintado por ' + archivo);
    for (const m of s.matchAll(/data-wa="([a-z]+\.[A-Za-z]+)"/g)) anota(m[1], '/pizarra · pintado por ' + archivo + ' (mensaje de WhatsApp)');
  }
  for (const k of Object.keys(usos)) usos[k] = [...new Set(usos[k])];
  return usos;
}

function exportar() {
  const usos = usosDeInterfaz();
  return entradas().filter(e => !e.soloEs).map(e => ({
    clave: e.id,
    origen: e.origen,
    es: e.es,
    huella: e.huella,
    en_actual: e.obj.en || null,
    nl_actual: e.obj.nl || null,
    estado: e.estado,
    donde: e.origen === 'interfaz' ? (usos[e.id] || []) : ['/pizarra · dato del manifest (' + e.id.split(':')[1] + ')']
  }));
}

/* ── Textos visibles sin clave ─────────────────────────────── */

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodificar = s => s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : (ENTIDADES[e] !== undefined ? ENTIDADES[e] : m));
const VACIOS = new Set(['meta', 'link', 'img', 'br', 'input', 'source', 'hr', 'wbr', 'area', 'base', 'col', 'embed', 'track']);
/* Etiquetas en línea: su texto se junta con el del elemento que las contiene
   (el titular «Eleva» «Pádel» «Pizarra» va en tres <span>) */
const EN_LINEA = new Set(['span', 'strong', 'em', 'b', 'i', 'small', 'time', 'abbr', 'svg', 'use']);
const ATRIBUTOS = ['alt', 'aria-label', 'title', 'placeholder'];
const METAS = /^(description|og:title|og:description|og:image:alt|og:site_name|twitter:title|twitter:description)$/;

/* Recorre un HTML conocido (sin dependencias) y devuelve los textos y
   atributos visibles o audibles que no salen de una clave y no son neutros.
   Las zonas generadas desde el manifest (<!--gen-->) se comprueban aparte. */
function textosSinClave(html) {
  const sinZonas = html.replace(/<!--gen-->[\s\S]*?<!--\/gen-->/g, '').replace(/<!--gen:jsonld-->[\s\S]*?<!--\/gen:jsonld-->/g, '')
    .replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, '');
  const out = [];
  const pila = [];
  const nombre = (tag, at) => '<' + tag + ((at.match(/\sid="([^"]+)"/) || [])[1] ? '#' + at.match(/\sid="([^"]+)"/)[1] : '') + ((at.match(/\sclass="([^"]+)"/) || [])[1] ? '.' + at.match(/\sclass="([^"]+)"/)[1].split(' ')[0] : '') + '>';
  for (const m of sinZonas.matchAll(/<(\/?)([a-z0-9-]+)\b([^>]*?)(\/?)>|([^<]+)/gi)) {
    if (m[5] !== undefined) {
      const top = pila[pila.length - 1];
      if (top && !top.clave) top.texto += decodificar(m[5]);
      continue;
    }
    const cierre = m[1] === '/', tag = m[2].toLowerCase(), at = m[3] || '';
    if (!cierre) {
      /* Atributos con texto */
      const cubiertos = new Set();
      for (const a of ['data-i18n-attr', 'data-i18n-fijo']) {
        const v = (at.match(new RegExp('\\s' + a + '="([^"]*)"')) || [])[1];
        if (v) v.split(';').forEach(p => cubiertos.add(p.split(':')[0].trim()));
      }
      const revisar = ATRIBUTOS.slice();
      if (tag === 'meta' && METAS.test((at.match(/\s(?:name|property)="([^"]+)"/) || [])[1] || '')) revisar.push('content');
      for (const a of revisar) {
        const v = (at.match(new RegExp('\\s' + a + '="([^"]*)"')) || [])[1];
        if (v !== undefined && !cubiertos.has(a) && !esNeutro(decodificar(v))) out.push(nombre(tag, at) + ' @' + a + ': «' + decodificar(v) + '»');
      }
      if (VACIOS.has(tag) || m[4] === '/') continue;
      const padre = pila[pila.length - 1];
      pila.push({ tag, at, texto: '', clave: /\sdata-i18n="/.test(at) || !!(padre && padre.clave) });
      continue;
    }
    /* Cierre: hasta su apertura (HTML conocido y bien formado) */
    let i = pila.length - 1;
    while (i >= 0 && pila[i].tag !== tag) i--;
    if (i < 0) continue;
    while (pila.length > i) {
      const e = pila.pop();
      const padre = pila[pila.length - 1];
      if (EN_LINEA.has(e.tag) && padre && !padre.clave) { padre.texto += e.texto; continue; }
      if (!e.clave && !esNeutro(e.texto)) out.push(nombre(e.tag, e.at) + ': «' + normalizar(e.texto) + '»');
    }
  }
  return out;
}

/* Datos del manifest que se pintan como cadena simple (sin { es, en, nl }):
   tienen que ser neutros. Se pinta el club con cada texto traducible y cada
   rótulo de interfaz cambiado por «§»: lo que queda tiene que ser neutro. */
function textosSueltosDelManifest(m, render) {
  const copia = JSON.parse(JSON.stringify(m));
  (function ir(o) {
    if (!o || typeof o !== 'object') return;
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (v && typeof v === 'object' && !Array.isArray(v) && typeof v.es === 'string') o[k] = { es: '§' };
      else ir(v);
    }
  })(copia);
  const s = render.crear(copia, 'es', () => '§');
  const out = [];
  for (const [zona, z] of Object.entries(s)) {
    const alts = [...z.html.matchAll(/\salt="([^"]*)"/g)].map(x => decodificar(x[1]));
    for (const t of [decodificar(z.html.replace(/<[^>]+>/g, ' '))].concat(alts)) {
      const resto = normalizar(t.split('§').join(' '));
      if (!esNeutro(resto)) out.push('zona ' + zona + ': «' + resto + '»');
    }
  }
  return out;
}

module.exports = { IDIOMAS, TRADUCIDOS, PERMITIR_PENDIENTES, TEXTOS_FIJOS, normalizar, huella, esNeutro, entradas, erroresDeFormato, usosDeInterfaz, exportar, traduciblesDelManifest, cargarManifest, clubes, textosSinClave, textosSueltosDelManifest };

if (require.main === module) {
  const [orden, arg] = process.argv.slice(2);
  if (orden === 'estado') {
    const lista = entradas();
    const cuenta = {};
    for (const e of lista) for (const l of TRADUCIDOS) {
      const s = e.estado[l];
      cuenta[l + ' ' + s] = (cuenta[l + ' ' + s] || 0) + 1;
      if (s !== 'al-dia' && s !== 'solo-es') console.log(`${l} ${s.padEnd(9)} ${e.id}  «${normalizar(e.es).slice(0, 70)}»`);
    }
    console.log('\n' + lista.length + ' textos · ' + Object.entries(cuenta).map(([k, v]) => k + ': ' + v).join(' · '));
  } else if (orden === 'exportar' && arg) {
    fs.writeFileSync(path.resolve(arg), JSON.stringify(exportar(), null, 1) + '\n');
    console.log('escrito ' + path.resolve(arg));
  } else {
    console.log('Uso: node tools/i18n.js estado | exportar <archivo.json>');
    process.exit(1);
  }
}
