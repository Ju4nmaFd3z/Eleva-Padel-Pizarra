/* =========================================================
   Módulo «servidor»
   ---------------------------------------------------------
   Respuestas HTTP del sitio servido como en Vercel
   (tools/servidor-local.js + middleware.js), sin navegador:
   · cabeceras de seguridad y CSP de vercel.json en cada página;
   · URLs limpias (308), 404 con su página;
   · nada de lo excluido en .vercelignore se sirve;
   · modo mantenimiento: 503 + Retry-After + noindex + CSP propia,
     recursos libres, paso con ?acceso=<clave> y cookie (un HMAC de
     la clave, nunca la clave; Secure en HTTPS).
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');
const { RAIZ } = require('../lib/servidor');

/* CSP esperadas, fijadas aquí a propósito: si alguien la relaja en vercel.json
   o en middleware.js, la batería falla. Cambiarla de verdad (un tercero nuevo)
   obliga a tocar vercel.json, privacidad.html y estas constantes (regla 7). */
const CSP_SITIO = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";
const CSP_MANTENIMIENTO = "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

/* Lo que una CSP del proyecto no puede tener nunca: orígenes externos,
   comodines, eval ni scripts inline */
function cspDebil(csp) {
  const malos = [];
  for (const d of csp.split(';').map(x => x.trim()).filter(Boolean)) {
    const [nombre, ...valores] = d.split(/\s+/);
    for (const v of valores) {
      if (/^(https?:|wss?:|blob:|filesystem:)/.test(v) || v.includes('*') || /^[a-z0-9.-]+\.[a-z]{2,}/i.test(v)) malos.push(nombre + ' ' + v);
      if (v === "'unsafe-eval'" || v === "'wasm-unsafe-eval'") malos.push(nombre + ' ' + v);
      if (v === "'unsafe-inline'" && nombre !== 'style-src') malos.push(nombre + ' ' + v);
    }
  }
  if (!/(^|;)\s*default-src 'none'/.test(csp)) malos.push("default-src no es 'none'");
  return malos;
}

const vercel = JSON.parse(fs.readFileSync(path.join(RAIZ, 'vercel.json'), 'utf8'));
const reglaGeneral = vercel.headers.find(h => h.source === '/(.*)');
const CSP_VERCEL = reglaGeneral ? (reglaGeneral.headers.find(h => h.key === 'Content-Security-Policy') || {}).value : null;
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
    ok(CSP_VERCEL === CSP_SITIO, 'la CSP de vercel.json no es la esperada (tools/qa/modulos/servidor.js)', CSP_VERCEL);
    for (const m of cspDebil(CSP_VERCEL || '')) ok(false, 'CSP de vercel.json debilitada', m);
    for (const [ruta, estado] of [['/', 200], ['/pizarra', 200], ['/privacidad', 200], ['/no-existe-qa', 404]]) {
      const r = await pedir(base + ruta);
      ok(r.status === estado, ruta + ': estado ' + r.status, 'se esperaba ' + estado);
      ok(r.headers.get('content-security-policy') === CSP_SITIO, ruta + ': CSP servida distinta de la esperada', r.headers.get('content-security-policy'));
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
    for (const ruta of ['/CLAUDE.md', '/README.md', '/CONTRIBUTING.md', '/CONFIRMAR.md', '/tools/validar.js', '/tools/qa/bateria.js', '/clubs/_plantilla/manifest.js', '/assets/credits.json', '/.gitignore', '/.vercelignore', '/.gitattributes', '/.editorconfig', '/CHANGELOG.md', '/lib/three/README.txt', '/vercel.json', '/middleware.js']) {
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
      ok(r.headers.get('content-security-policy') === CSP_MANTENIMIENTO, ruta + ': CSP de mantenimiento distinta de la esperada', r.headers.get('content-security-policy'));
      for (const m of cspDebil(r.headers.get('content-security-policy') || '')) ok(false, ruta + ': CSP de mantenimiento debilitada', m);
      ok(/<meta name="robots" content="noindex">/.test(cuerpo), ruta + ': la página no lleva meta robots noindex');
    }
    for (const ruta of ['/favicon.ico', '/assets/img/logo-sin-fondo.svg', '/robots.txt', '/assets/icons/lucide.svg', '/js/idioma.js', '/js/translations.js', '/js/main.js']) {
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
    /* La cookie guarda un HMAC-SHA256 de la clave, nunca la clave */
    const valor = cookie.split(';')[0].slice('eleva-acceso='.length);
    ok(/^[0-9a-f]{64}$/.test(valor), 'la cookie eleva-acceso no es un HMAC-SHA256 (64 hex)', valor.length + ' caracteres');
    ok(!valor.includes(clave) && !valor.includes(encodeURIComponent(clave)), 'la cookie eleva-acceso lleva la clave en claro');
    for (const [nombre, v] of [['la clave en claro', encodeURIComponent(clave)], ['un HMAC cambiado', valor.slice(0, -1) + (valor.endsWith('0') ? '1' : '0')], ['un HMAC cortado', valor.slice(0, 32)]]) {
      const x = await pedir(b + '/pizarra', { headers: { cookie: 'eleva-acceso=' + v } });
      ok(x.status === 503, 'una cookie con ' + nombre + ' deja pasar', x.status);
      await x.arrayBuffer();
    }
    /* Entradas vacías o basura: siempre la página de mantenimiento, nunca un 500 */
    const raras = [
      ['?acceso= vacío', '/pizarra?acceso=', {}],
      ['?acceso sin valor', '/pizarra?acceso', {}],
      ['?acceso= incorrecto', '/pizarra?acceso=' + encodeURIComponent('x' + clave), {}],
      ['?acceso= muy largo', '/pizarra?acceso=' + 'a'.repeat(5000), {}],
      ['cookie vacía', '/pizarra', { cookie: 'eleva-acceso=' }],
      ['cookie basura', '/pizarra', { cookie: 'eleva-acceso=%E0%A4%A;%%; x' }],
      ['cookie sin =', '/pizarra', { cookie: 'eleva-acceso' }]
    ];
    for (const [nombre, ruta, cab] of raras) {
      const x = await pedir(b + ruta, { headers: cab });
      await x.arrayBuffer();
      ok(x.status === 503 && /^\d+$/.test(x.headers.get('retry-after') || '') && /noindex/.test(x.headers.get('x-robots-tag') || ''),
        nombre + ': no da el 503 de mantenimiento (Retry-After y noindex)', x.status);
    }
    /* En HTTPS (Vercel) la cookie lleva Secure: se llama al middleware directamente */
    const { pathToFileURL } = require('url');
    const { default: mw } = await import(pathToFileURL(path.join(RAIZ, 'middleware.js')).href);
    const antes = { m: process.env.MANTENIMIENTO, c: process.env.MANTENIMIENTO_CLAVE };
    process.env.MANTENIMIENTO = '1'; process.env.MANTENIMIENTO_CLAVE = clave;
    try {
      const s = await mw(new Request('https://ejemplo.invalid/pizarra?acceso=' + encodeURIComponent(clave)));
      const c = (s && s.headers.get('set-cookie')) || '';
      ok(/;\s*Secure/i.test(c) && /HttpOnly/i.test(c) && /SameSite=Lax/i.test(c), 'en HTTPS la cookie eleva-acceso no lleva Secure, HttpOnly y SameSite=Lax', c);
      ok(c.split(';')[0] === 'eleva-acceso=' + valor, 'la cookie de HTTPS no es la misma firma que la de HTTP', c.split(';')[0]);
    } finally {
      for (const [k, v] of [['MANTENIMIENTO', antes.m], ['MANTENIMIENTO_CLAVE', antes.c]]) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
    }
  });
}

module.exports = {
  nombre: 'servidor',
  descripcion: 'cabeceras y CSP, URLs limpias, 404, excluidos del despliegue y modo mantenimiento',
  casos: () => [cabeceras(), urlsLimpias(), excluidos(), mantenimiento()]
};
