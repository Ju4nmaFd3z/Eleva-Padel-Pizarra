/* =========================================================
   Utilidades para abrir y recorrer páginas con Playwright
   ---------------------------------------------------------
   abrir()       contexto + página con registro de consola,
                 errores, peticiones fallidas, respuestas ≥ 400,
                 peticiones a terceros y violaciones de la CSP.
   estabilizar() espera a fuentes y a que terminen las
                 animaciones con fin (las infinitas y las que mueve
                 el scroll no cuentan): sin esperas a ciegas.
   recorrer()    baja la página pantalla a pantalla y ejecuta una
                 función en cada parada.
   problemasDeRegistro() convierte el registro en fallos.
   ========================================================= */
'use strict';

/* Contexto de Playwright a partir de una «vista» de lib/vistas.js y un modo */
function opcionesContexto(vista, modo, lang) {
  const o = {
    viewport: { width: vista.ancho, height: vista.alto },
    deviceScaleFactor: vista.dpr || 1,
    isMobile: !!vista.movil,
    hasTouch: !!vista.movil,
    reducedMotion: modo === 'reducido' ? 'reduce' : 'no-preference',
    javaScriptEnabled: modo !== 'sinjs',
    locale: 'es-ES',
    serviceWorkers: 'block'
  };
  return o;
}

async function abrir(navegador, { vista, modo = 'normal', lang = null, base }) {
  const ctx = await navegador.newContext(opcionesContexto(vista, modo, lang));
  const registro = { consola: [], errores: [], fallidas: [], respuestas: [], terceros: [], documento: null };
  const origen = new URL(base).host;
  if (lang) {
    await ctx.addInitScript(l => { try { localStorage.setItem('eleva-lang', l); } catch (e) { /* sin almacenamiento */ } }, lang);
  }
  /* Violaciones de la CSP que el navegador notifica a la página */
  await ctx.addInitScript(() => {
    window.__qaCsp = [];
    document.addEventListener('securitypolicyviolation', e => {
      window.__qaCsp.push(e.violatedDirective + ' ' + (e.blockedURI || 'inline'));
    });
  });
  const p = await ctx.newPage();
  p.__qaSinJs = modo === 'sinjs';
  /* Un clic o una espera que no se cumple falla en 10 s, no en 30 */
  p.setDefaultTimeout(10000);
  p.on('console', m => {
    if (m.type() === 'error' || m.type() === 'warning') registro.consola.push({ texto: m.type() + ': ' + m.text(), url: (m.location() || {}).url || '' });
  });
  p.on('pageerror', e => registro.errores.push(e.message));
  p.on('requestfailed', r => {
    const f = r.failure();
    registro.fallidas.push(r.url() + ' (' + (f ? f.errorText : '?') + ')');
  });
  p.on('request', r => {
    const u = new URL(r.url());
    if (/^(http|ws)/.test(u.protocol) && u.host !== origen) registro.terceros.push(r.url());
  });
  p.on('response', r => {
    if (r.request().isNavigationRequest() && r.frame() === p.mainFrame()) registro.documento = r;
    else if (r.status() >= 400) registro.respuestas.push(r.status() + ' ' + r.url());
  });
  return { ctx, p, registro };
}

/* Espera a que la página esté quieta: fuentes cargadas, imágenes de la
   pantalla cargadas y sin animaciones finitas en marcha (máx. limiteMs; si
   no se alcanza, devuelve cuáles siguen). Se sondea desde Node con lecturas
   síncronas: sin JavaScript la página no ejecuta temporizadores ni
   requestAnimationFrame, pero el CSS sí anima. */
async function estabilizar(p, limiteMs = 6000) {
  const fin = Date.now() + limiteMs;
  let vivas = [];
  for (;;) {
    vivas = await p.evaluate(() => {
      const pend = [];
      if (document.fonts && document.fonts.status !== 'loaded') pend.push('fuentes');
      for (const i of document.images) {
        const r = i.getBoundingClientRect();
        if (!i.complete && r.bottom > 0 && r.top < innerHeight && r.width > 0) pend.push('imagen ' + (i.currentSrc || i.src).split('/').pop());
      }
      for (const a of (document.getAnimations ? document.getAnimations() : [])) {
        if (a.playState !== 'running' || a.timeline !== document.timeline || !a.effect) continue;
        if (isFinite(a.effect.getComputedTiming().endTime)) pend.push(a.animationName || a.transitionProperty || 'animación');
      }
      return pend;
    });
    if (!vivas.length || Date.now() > fin) break;
    await p.waitForTimeout(40);
  }
  /* Dos fotogramas más: el motor de scroll aplica sus tiempos en el
     siguiente requestAnimationFrame. Sin JS no hay motor ni rAF. */
  await fotogramas(p, 2);
  return vivas.length ? [...new Set(vivas)].slice(0, 5) : null;
}

async function fotogramas(p, n) {
  if (p.__qaSinJs) { await p.waitForTimeout(17 * n); return; }
  await p.evaluate(n => new Promise(r => { const paso = k => (k ? requestAnimationFrame(() => paso(k - 1)) : r()); paso(n); }), n);
}

/* Baja la página de pantalla en pantalla (scroll instantáneo, sin el
   «smooth» del CSS) y llama a fn(y) en cada parada, ya estabilizada. */
async function recorrer(p, fn, { paso = null } = {}) {
  const alto = await p.evaluate(() => innerHeight);
  const salto = paso || Math.max(200, Math.round(alto * 0.85));
  let y = 0;
  for (let i = 0; i < 200; i++) {
    const total = await p.evaluate(v => { window.scrollTo({ top: v, left: 0, behavior: 'instant' }); return document.documentElement.scrollHeight; }, y);
    await estabilizar(p);
    await fn(y);
    if (y + alto >= total) break;
    y = Math.min(y + salto, total - alto);
  }
  await p.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  await estabilizar(p);
}

/* Convierte el registro de una página en fallos.
   esperado: estado HTTP previsto del documento (200, 404, 503). */
async function problemasDeRegistro(p, registro, { esperado = 200 } = {}) {
  const f = [];
  const doc = registro.documento;
  if (!doc) f.push({ tipo: 'documento', clave: 'sin respuesta', detalle: '' });
  else {
    if (doc.status() !== esperado) f.push({ tipo: 'estado-http', clave: String(doc.status()), detalle: 'se esperaba ' + esperado });
    const csp = doc.headers()['content-security-policy'];
    if (!csp) f.push({ tipo: 'csp', clave: 'falta la cabecera Content-Security-Policy', detalle: doc.url() });
  }
  registro.consola.forEach(m => {
    /* El aviso del propio documento con el estado previsto (404, 503) no es un fallo */
    if (doc && doc.status() === esperado && esperado !== 200 && m.url === doc.url() &&
        m.texto.includes('status of ' + esperado)) return;
    f.push({ tipo: 'consola', clave: m.texto.slice(0, 160), detalle: m.url });
  });
  registro.errores.forEach(t => f.push({ tipo: 'error-de-pagina', clave: t.slice(0, 160), detalle: '' }));
  registro.fallidas.forEach(t => f.push({ tipo: 'peticion-fallida', clave: t, detalle: '' }));
  registro.respuestas.forEach(t => f.push({ tipo: 'respuesta-error', clave: t, detalle: '' }));
  registro.terceros.forEach(t => f.push({ tipo: 'peticion-a-terceros', clave: t, detalle: '' }));
  const csp = await p.evaluate(() => window.__qaCsp || []).catch(() => []);
  csp.forEach(t => f.push({ tipo: 'csp', clave: t, detalle: 'violación' }));
  return f;
}

/* Agrupa los problemas repetidos (mismo tipo y clave) en uno solo */
function agrupar(lista) {
  const m = new Map();
  for (const x of lista) {
    const k = x.tipo + '|' + x.clave;
    if (!m.has(k)) m.set(k, Object.assign({ veces: 1 }, x));
    else m.get(k).veces++;
  }
  return [...m.values()];
}

module.exports = { abrir, estabilizar, recorrer, problemasDeRegistro, agrupar, opcionesContexto };
