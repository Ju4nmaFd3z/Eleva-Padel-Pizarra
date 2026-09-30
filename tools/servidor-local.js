#!/usr/bin/env node
/* =========================================================
   SERVIDOR LOCAL QUE IMITA A VERCEL
   ---------------------------------------------------------
   Para previsualizar la web EXACTAMENTE como la sirve Vercel:
     · cleanUrls: /pizarra sirve pizarra/index.html, /privacidad
       sirve privacidad.html; /x.html → 308 a /x
     · trailingSlash:false: /pizarra/ → 308 a /pizarra
     · cabeceras de vercel.json (incluida la CSP)
     · lo que lista .vercelignore no existe
     · 404.html con código 404 para todo lo demás
     · rutas SENSIBLES a mayúsculas (como Vercel, no como macOS)
     · middleware.js (modo mantenimiento): el mismo archivo que usa Vercel

   Por qué no vale abrir el HTML con doble clic ni
   `python3 -m http.server`: ambos resuelven /pizarra como
   /pizarra/ y esconden el bug clásico de este proyecto (una ruta
   relativa como "manifest.js" que en Vercel apunta a /manifest.js).

   Herramienta de desarrollo: Node 22+ sin dependencias.
   No se publica (tools/ está en .vercelignore).

   Uso, desde la raíz del repo:
     node tools/servidor-local.js          → http://localhost:3000
     node tools/servidor-local.js 8080     → otro puerto
   Con el modo mantenimiento activo (bash):
     MANTENIMIENTO=1 MANTENIMIENTO_CLAVE=prueba node tools/servidor-local.js
   ========================================================= */
'use strict';
const http = require('http');
const { pathToFileURL } = require('url');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2]) || 3000;
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const ignore = fs.readFileSync(path.join(ROOT, '.vercelignore'), 'utf8')
  .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml'
};

const ignored = rel => ignore.some(p => {
  p = p.replace(/^\//, '');
  return p.endsWith('/') ? rel.startsWith(p) : (rel === p || rel.startsWith(p + '/'));
});

/* Existe como archivo, con el MISMO uso de mayúsculas en cada tramo */
function exists(rel) {
  if (!rel || rel.startsWith('.') || rel.includes('/.') || ignored(rel)) return false;
  let dir = ROOT;
  for (const seg of rel.split('/')) {
    let names;
    try { names = fs.readdirSync(dir); } catch { return false; }
    if (!names.includes(seg)) return false;
    dir = path.join(dir, seg);
  }
  try { return fs.statSync(dir).isFile(); } catch { return false; }
}

function headersFor(p) {
  const h = {};
  for (const rule of cfg.headers || []) {
    const re = new RegExp('^' + rule.source.replace(/\(\.\*\)/g, '(.*)') + '$');
    if (re.test(p)) for (const { key, value } of rule.headers) h[key] = value;
  }
  return h;
}

function send(res, code, rel, reqPath) {
  const h = headersFor(reqPath);
  h['Content-Type'] = MIME[path.extname(rel)] || 'application/octet-stream';
  res.writeHead(code, h);
  res.end(fs.readFileSync(path.join(ROOT, rel)));
}

/* Igual que en Vercel: si middleware.js devuelve una Response, se envía
   tal cual; si no devuelve nada, la petición sigue su curso. */
async function runMiddleware(req, res, middleware) {
  const out = await middleware(new Request(new URL(req.url, 'http://localhost:' + PORT), {
    method: req.method, headers: req.headers
  }));
  if (!out) return false;
  res.writeHead(out.status, Object.fromEntries(out.headers));
  res.end(Buffer.from(await out.arrayBuffer()));
  return true;
}

function serve(req, res) {
  const u = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(u.pathname);
  const redirect = to => { res.writeHead(308, { Location: to + u.search }); res.end(); };

  if (p.length > 1 && p.endsWith('/')) return redirect(p.slice(0, -1));
  if (p.endsWith('.html')) {
    let t = p.slice(0, -5);
    if (t.endsWith('/index')) t = t.slice(0, -6);
    return redirect(t || '/');
  }

  const rel = p.slice(1);
  let file = null;
  if (p === '/') file = 'index.html';
  else if (exists(rel)) file = rel;
  else if (exists(rel + '.html')) file = rel + '.html';
  else if (exists(rel + '/index.html')) file = rel + '/index.html';

  if (file) return send(res, 200, file, p);
  send(res, 404, '404.html', p);
}

import(pathToFileURL(path.join(ROOT, 'middleware.js')).href).then(({ default: middleware }) => {
  http.createServer((req, res) => {
    runMiddleware(req, res, middleware)
      .then(done => { if (!done) serve(req, res); })
      .catch(err => { console.error(err); res.writeHead(500); res.end(); });
  }).listen(PORT, () => {
    console.log(`Eleva · servidor local tipo Vercel en http://localhost:${PORT}`);
    console.log(`  Landing: http://localhost:${PORT}/   ·   Club: http://localhost:${PORT}/pizarra`);
    if (process.env.MANTENIMIENTO === '1') console.log('  Modo mantenimiento ACTIVO');
  });
});
