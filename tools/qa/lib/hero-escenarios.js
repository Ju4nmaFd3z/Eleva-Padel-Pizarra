/* =========================================================
   Escenarios de carga del hero de /pizarra
   ---------------------------------------------------------
   Cada escenario abre /pizarra en un contexto nuevo (caché
   fría), provoca una situación real (recarga a mitad de página,
   bfcache, cambio de tamaño o de densidad durante la entrada,
   pestaña oculta antes de los 6 s del 3D, primer gesto, scroll
   rápido mientras se crea la escena, fuentes lentas, CPU y red
   lentas, contexto WebGL perdido, sin WebGL, movimiento
   reducido) y comprueba el hero con lib/hero.js en varios
   momentos. Los tiempos aleatorios salen de una semilla por
   repetición: una repetición fallida se puede repetir igual.
   Lo usan modulos/hero.js (batería) y los guiones de la QA
   final (50 repeticiones por escenario y dispositivo).
   ========================================================= */
'use strict';
const H = require('./hero');

const DISPOSITIVOS = {
  'e1920': { ancho: 1920, alto: 1080, dpr: 1, movil: false },
  'e1440': { ancho: 1440, alto: 900, dpr: 1, movil: false },
  'e1280': { ancho: 1280, alto: 720, dpr: 1, movil: false },
  'e1920d2': { ancho: 1920, alto: 1080, dpr: 2, movil: false },
  'm390':  { ancho: 390, alto: 844, dpr: 3, movil: true },
  'm360':  { ancho: 360, alto: 800, dpr: 3, movil: true }
};

/* Chromium con GPU real (ANGLE) y bfcache; «sin-webgl» sin APIs 3D */
const ARGS_GPU = ['--enable-gpu', '--ignore-gpu-blocklist', '--enable-gpu-rasterization'];
if (process.platform === 'win32') ARGS_GPU.push('--use-angle=d3d11');
/* Memoria de GPU del escenario «gpu-justa»: 32 MB para 1920×1080 a densidad 1
   y, con más píxeles físicos, en proporción (128 MB a 1920 con densidad 2;
   46 MB en 390×844 a densidad 3): la misma presión por píxel en todos. Chrome
   da a cada pestaña 512 MB en escritorio (el doble con pantallas de 3500 px
   físicos o más) y en Android 1/8 de la RAM, hasta 256 MB: esto queda muy por
   debajo. El hero anterior al arreglo (octubre de 2026) perdía teselas con esta
   memoria en casi todas las cargas (6 de 6 a 1920 con densidad 2 y 128 MB).
   Por debajo de la proporción ya no cabe ni lo mínimo de un diseño con una
   imagen a pantalla completa: a densidad 2 la ventana sola son 33 MB de
   teselas y la escena congelada, otros 31 MB de imagen. */
const MEMORIA_JUSTA_REF_MB = 32;
function memoriaJusta(disp) {
  const k = disp.ancho * disp.alto * disp.dpr * disp.dpr / (1920 * 1080);
  return Math.max(MEMORIA_JUSTA_REF_MB, Math.round(MEMORIA_JUSTA_REF_MB * k));
}
const LANZAR = {
  gpu: { args: ARGS_GPU, ignoreDefaultArgs: ['--disable-back-forward-cache'] },
  sinwebgl: { args: ['--disable-webgl', '--disable-3d-apis'], ignoreDefaultArgs: ['--disable-back-forward-cache'] },
  /* el bfcache solo funciona con ventana (fuera de la pantalla visible) */
  ventana: { headless: false, args: ARGS_GPU.concat(['--window-position=-32000,-32000']), ignoreDefaultArgs: ['--disable-back-forward-cache'] },
  /* GPU con poca memoria (equipo justo, muchas pestañas, otra aplicación 3D):
     el compositor no puede rasterizar todas las teselas que pide la página */
  justa: mb => ({ args: ARGS_GPU.concat(['--force-gpu-mem-available-mb=' + mb]), ignoreDefaultArgs: ['--disable-back-forward-cache'] })
};

/* Generador pseudoaleatorio con semilla (mulberry32) */
function azar(semilla) {
  let a = semilla >>> 0;
  const f = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  f.entre = (x, y) => x + (y - x) * f();
  return f;
}

const espera = ms => new Promise(r => setTimeout(r, ms));
async function fotogramas(p, n = 2) {
  await p.evaluate(n => new Promise(r => { const paso = k => (k ? requestAnimationFrame(() => paso(k - 1)) : r()); paso(n); }), n);
}

/* Pestaña oculta: el estado de visibilidad se sustituye (Playwright mantiene
   las páginas visibles) y la página se congela (sin rAF ni temporizadores),
   como una pestaña en segundo plano. */
const INIT_VISIBILIDAD = () => {
  let oculta = false;
  const d = Document.prototype;
  const h = Object.getOwnPropertyDescriptor(d, 'hidden');
  const v = Object.getOwnPropertyDescriptor(d, 'visibilityState');
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => oculta || h.get.call(document) });
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (oculta ? 'hidden' : v.get.call(document)) });
  window.__qaOcultar = si => { oculta = si; document.dispatchEvent(new Event('visibilitychange')); };
};

async function ocultar(p, cdp, si) {
  if (si) {
    await p.evaluate(() => window.__qaOcultar(true));
    await cdp.send('Page.setWebLifecycleState', { state: 'frozen' });
  } else {
    await cdp.send('Page.setWebLifecycleState', { state: 'active' });
    await p.evaluate(() => window.__qaOcultar(false));
  }
}

async function esperar3D(p, ms) {
  return p.waitForFunction(() => window.ElevaTresD && window.ElevaTresD.estado().cargada && document.querySelector('.hero.tres-d-lista'), null, { timeout: ms, polling: 100 })
    .then(() => true, () => false);
}

/* Gesto en el hero: puntero con ratón; toque corto en táctil */
async function gesto(p, cdp, disp, r) {
  const x = Math.round(disp.ancho * r.entre(0.3, 0.7)), y = Math.round(disp.alto * r.entre(0.3, 0.6));
  if (disp.movil) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await p.mouse.move(x, y, { steps: 3 });
  }
}

/* Scroll real: rueda en escritorio, arrastre táctil en móvil */
async function desplazar(p, cdp, disp, dy) {
  if (!disp.movil) { await p.mouse.wheel(0, dy); return; }
  const x = Math.round(disp.ancho / 2), y0 = dy > 0 ? Math.round(disp.alto * 0.75) : Math.round(disp.alto * 0.25);
  const d = Math.max(-disp.alto * 0.5, Math.min(disp.alto * 0.5, dy));
  const t = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
  await t('touchStart', [{ x, y: y0 }]);
  for (let i = 1; i <= 6; i++) await t('touchMove', [{ x, y: Math.round(y0 - d * i / 6) }]);
  await t('touchEnd', []);
}

async function irA(p, y) {
  await p.evaluate(y => window.scrollTo({ top: y, left: 0, behavior: 'instant' }), y);
}

/* Comprobación en un momento: captura + medida + comparación */
async function chequear(ctxEsc, etiqueta, { reposo = false } = {}) {
  const { p, fallos, capturar } = ctxEsc;
  /* el pulso del logo al tocar (tacto.js) dura --dur-larga: se mide quieto */
  await p.waitForFunction(() => !document.getAnimations().some(a => a.playState === 'running' && a.effect && a.effect.target && a.effect.target.classList && a.effect.target.classList.contains('hero-pulso')), null, { timeout: 3000, polling: 50 }).catch(() => {});
  /* La captura y la medida tienen que ser del mismo estado: si el scroll o
     el tamaño cambian entre una y otra (restauración del scroll en varios
     pasos, métricas nuevas), no son del mismo momento y se vuelven a tomar.
     Con «reposo» (gpu-justa), además, el estado del hero tiene que ser el
     estable definido en enReposo() antes y después de la captura (sin que la
     pista 3D empiece o termine de moverse entre una y otra); si no lo es, se
     espera a que lo sea. Nunca se repite una captura que sí era de un estado válido: un fallo
     a la primera es un fallo. Hasta 5 intentos. */
  let png, m, estable = false;
  for (let i = 0; i < 5 && !estable; i++) {
    if (reposo && i) await enReposo(p);
    await scrollParado(p);
    await fotogramas(p, 2).catch(() => {});
    const antes = await p.evaluate(ESTADO_HERO, false);
    png = await p.screenshot({ animations: 'allow', caret: 'initial' });
    m = await H.medir(p);
    const despues = await p.evaluate(ESTADO_HERO, false);
    /* la geometría, la de la propia medida (medir() añade y quita sondas) */
    estable = antes.geometria === [m.scrollY, m.vw, m.vh, m.dpr].join() &&
      (!reposo || (antes.hero === despues.hero && antes.quieto && despues.quieto));
  }
  const f = H.comprobar(m, png, { etiqueta, final: /^final|recuperado/.test(etiqueta) });
  if (!estable) f.push({ tipo: 'hero', clave: etiqueta + ': ' + (reposo ? 'el hero no llega a reposo' : 'el hero no se está quieto para medirlo'), detalle: '' });
  if (f.length && capturar) await capturar(png, etiqueta);
  fallos.push(...f);
  ctxEsc.medidas.push({ etiqueta, p: +m.p.toFixed(3), scrollY: m.scrollY, lienzo: !!m.lienzo, lista: m.lista, fuentes: m.fuentes });
  return m;
}

/* El scroll no se mueve (la restauración al recargar puede ir en varios pasos
   o suave): el mismo scrollY en 4 fotogramas seguidos, hasta 5 s */
async function scrollParado(p) {
  await p.evaluate(() => new Promise(r => {
    let y = scrollY, n = 0; const t0 = performance.now();
    const paso = () => { if (scrollY === y) n++; else { y = scrollY; n = 0; } if (n >= 4 || performance.now() - t0 > 5000) r(); else requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  })).catch(() => {});
}

/* Estado del hero que tiene que ser el mismo en la captura y en la medida;
   «quieto» = el estado estable de enReposo() (se ejecuta en la página) */
const ESTADO_HERO = soloQuieto => {
  const h = document.querySelector('.hero');
  const t = window.ElevaTresD ? window.ElevaTresD.estado() : {};
  const mov = !!document.querySelector('.en-movimiento');
  const lista = !!(h && h.classList.contains('tres-d-lista')), cong = !!(h && h.classList.contains('tres-d-congelada'));
  const anim = document.getAnimations().some(a => a.playState === 'running' && a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('.hero'));
  const quieto = !mov && !anim && !t.cargando && (!lista || cong);
  if (soloQuieto) return quieto;
  return {
    geometria: [scrollY, innerWidth, innerHeight, devicePixelRatio].join(),
    hero: [mov, lista, cong, !!t.cargando, anim].join(),
    quieto
  };
};

/* Espera a que la página esté quieta (fuentes, imagen del hero) */
async function quieta(p, ms = 8000) {
  await p.waitForFunction(() => document.readyState === 'complete' && (!document.fonts || document.fonts.status === 'loaded') &&
    (() => { const i = document.querySelector('.hero-imagen img'); return !i || i.complete; })(), null, { timeout: ms, polling: 100 }).catch(() => {});
}

/* La escena 3D no ha llegado: con el motivo que dé la página */
async function noLlega(e) {
  const est = await e.p.evaluate(() => ({ estado: window.ElevaTresD ? window.ElevaTresD.estado().cargada : null, lista: !!document.querySelector('.hero.tres-d-lista'), visible: document.visibilityState })).catch(() => ({}));
  e.fallos.push({ tipo: 'hero', clave: 'la pista 3D no llega', detalle: JSON.stringify(est) + (e.consola.length ? ' · ' + e.consola.join(' | ') : '') });
}

/* Estado estable del hero: nada se mueve (sin .en-movimiento ni animaciones
   o transiciones en marcha), la pista 3D no se está creando y, si está, ya
   congelada en su último fotograma (tres-d.js) */
async function enReposo(p) {
  await p.waitForFunction(ESTADO_HERO, true, { timeout: 15000, polling: 50 }).catch(() => {});
  await fotogramas(p, 3);
}

const URL_PIZARRA = base => base.replace(/\/$/, '') + '/pizarra';

/* ── Escenarios ── cada uno: async (e) => void; e = { p, ctx, cdp, disp, r, base, fallos, ... } */
const ESCENARIOS = {
  /* Carga en frío sin tocar nada: el 3D llega a los 6 s */
  'frio': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'domcontentloaded' });
    await chequear(e, 'al leer el documento');
    await e.p.waitForLoadState('load');
    await chequear(e, 'al cargar');
    /* sin gestos: llega a los 6 s + un momento libre; con la máquina cargada, más */
    if (e.conGL) { if (!await esperar3D(e.p, 30000)) await noLlega(e); }
    await espera(e.r.entre(0, 600));
    await chequear(e, 'final');
  },

  /* Recarga a mitad de página: el navegador restaura el scroll */
  'recarga': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'load' });
    const y = Math.round(e.disp.alto * e.r.entre(0.1, 1.6));
    await irA(e.p, y);
    await espera(e.r.entre(50, 400));
    await e.p.reload({ waitUntil: 'load' });
    await quieta(e.p);
    await chequear(e, 'restaurado en ' + y);
    await irA(e.p, 0);
    await chequear(e, 'de vuelta arriba');
    if (e.conGL) await esperar3D(e.p, 12000);
    await chequear(e, 'final');
  },

  /* Atrás/adelante con bfcache */
  'bfcache': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'load' });
    await gesto(e.p, e.cdp, e.disp, e.r);
    if (e.conGL && e.r() < 0.7) await esperar3D(e.p, 12000);
    if (e.r() < 0.5) await irA(e.p, Math.round(e.disp.alto * e.r.entre(0.05, 0.6)));
    await e.p.evaluate(() => { window.__qaVuelta = null; addEventListener('pageshow', ev => { window.__qaVuelta = ev.persisted; }, { once: true }); });
    await e.p.goto(e.base.replace(/\/$/, '') + '/privacidad', { waitUntil: 'load' });
    await espera(e.r.entre(100, 800));
    await e.p.goBack({ waitUntil: 'commit' });
    await e.p.waitForFunction(() => window.__qaVuelta !== undefined && document.readyState === 'complete', null, { timeout: 15000 }).catch(() => {});
    const persistida = await e.p.evaluate(() => window.__qaVuelta).catch(() => null);
    if (persistida !== true) e.fallos.push({ tipo: 'entorno', clave: 'sin bfcache en la prueba', detalle: String(persistida) });
    await chequear(e, 'vuelta del bfcache');
    await espera(e.r.entre(200, 900));
    await irA(e.p, 0);
    if (e.conGL) await esperar3D(e.p, 12000);
    await chequear(e, 'final');
  },

  /* Cambio de tamaño u orientación durante la entrada */
  'redimension': async e => {
    const { ancho, alto } = e.disp;
    const otro = e.disp.movil ? { width: alto, height: ancho } : (ancho === 1280 ? { width: 1920, height: 1080 } : { width: 1280, height: 720 });
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'domcontentloaded' });
    await espera(e.r.entre(0, 1200));
    await e.p.setViewportSize(otro);
    await espera(e.r.entre(30, 700));
    if (e.r() < 0.5) { await gesto(e.p, e.cdp, Object.assign({}, e.disp, { ancho: otro.width, alto: otro.height }), e.r); if (e.conGL) await esperar3D(e.p, 12000); }
    await quieta(e.p);
    await espera(250);
    await chequear(e, 'en ' + otro.width + 'x' + otro.height);
    await e.p.setViewportSize({ width: ancho, height: alto });
    await espera(e.r.entre(30, 400));
    await gesto(e.p, e.cdp, e.disp, e.r);
    if (e.conGL) await esperar3D(e.p, 12000);
    await espera(250);
    await chequear(e, 'final');
  },

  /* Pestaña oculta antes de los 6 s del 3D */
  'oculta': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'domcontentloaded' });
    await espera(e.r.entre(100, 5000));
    await ocultar(e.p, e.cdp, true);
    await espera(e.r.entre(500, 4000));
    await ocultar(e.p, e.cdp, false);
    await quieta(e.p);
    await chequear(e, 'al volver');
    if (e.conGL) await esperar3D(e.p, 14000);
    await chequear(e, 'final');
  },

  /* Primer gesto durante la entrada */
  'gesto': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'domcontentloaded' });
    await espera(e.r.entre(0, 1500));
    await gesto(e.p, e.cdp, e.disp, e.r);
    if (e.conGL) await esperar3D(e.p, 12000);
    await chequear(e, 'final');
  },

  /* Scroll rápido mientras se crea la escena 3D */
  'scroll-rapido': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: e.r() < 0.5 ? 'domcontentloaded' : 'load' });
    await gesto(e.p, e.cdp, e.disp, e.r);
    const n = Math.round(e.r.entre(6, 16));
    for (let i = 0; i < n; i++) {
      await desplazar(e.p, e.cdp, e.disp, Math.round(e.r.entre(-1, 1.4) * e.disp.alto * 0.5));
      await espera(e.r.entre(0, 60));
    }
    await espera(e.r.entre(0, 300));
    const y = Math.round(e.disp.alto * e.r.entre(0, 0.5));
    await irA(e.p, y);
    await chequear(e, 'parado en ' + y);
    await irA(e.p, 0);
    if (e.conGL) await esperar3D(e.p, 12000);
    await chequear(e, 'final');
  },

  /* Fuentes que cargan tarde */
  'fuentes': async e => {
    const retraso = e.r.entre(800, 4000);
    await e.ctx.route(/\.woff2(\?|$)/, async ruta => { await espera(retraso); await ruta.continue(); });
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'domcontentloaded' });
    await espera(e.r.entre(0, 600));
    await chequear(e, 'con las fuentes en camino');
    if (e.r() < 0.5) await gesto(e.p, e.cdp, e.disp, e.r);
    await e.p.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 15000 }).catch(() => {});
    await chequear(e, 'con las fuentes cargadas');
    if (e.conGL) await esperar3D(e.p, 12000);
    await chequear(e, 'final');
  },

  /* Cambio de densidad de píxeles y zoom (durante la entrada y con el 3D vivo) */
  'dpr-zoom': async e => {
    const { ancho, alto, dpr, movil } = e.disp;
    /* la página tarda unos fotogramas en recibir las métricas nuevas: se espera a verlas */
    const metricas = async (k, d) => {
      await e.cdp.send('Emulation.setDeviceMetricsOverride', { width: Math.round(ancho / k), height: Math.round(alto / k), deviceScaleFactor: d, mobile: movil });
      await e.p.waitForFunction(d => Math.abs(devicePixelRatio - d) < 0.01, d, { timeout: 5000, polling: 50 }).catch(() => {});
    };
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'domcontentloaded' });
    await espera(e.r.entre(0, 1200));
    /* zoom del navegador en escritorio: menos px CSS y más densidad. En móvil
       no hay zoom de página: se cambia la densidad (2 · 2,625 · 3,5) */
    const zoom = movil ? [2, 2.625, 3.5][Math.floor(e.r() * 3)] : [1.1, 1.25, 1.5][Math.floor(e.r() * 3)];
    if (movil) await metricas(1, zoom); else await metricas(zoom, dpr * zoom);
    await gesto(e.p, e.cdp, e.disp, e.r);
    if (e.conGL) await esperar3D(e.p, 12000);
    await quieta(e.p);
    await chequear(e, 'zoom ' + zoom);
    /* solo densidad (pantalla externa, arrastrar la ventana a otro monitor) */
    const otra = movil ? 2 : [1.25, 1.5, 2][Math.floor(e.r() * 3)];
    await metricas(1, otra);
    await espera(e.r.entre(50, 500));
    await chequear(e, 'dpr ' + otra);
    await metricas(1, dpr);
    await espera(300);
    await chequear(e, 'final');
  },

  /* CPU y red lentas */
  'cpu-red': async e => {
    await e.cdp.send('Emulation.setCPUThrottlingRate', { rate: e.disp.movil ? 6 : 4 });
    await e.cdp.send('Network.enable');
    await e.cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await chequear(e, 'al leer el documento');
    await e.p.waitForLoadState('load', { timeout: 60000 });
    await chequear(e, 'al cargar');
    if (e.r() < 0.5) await gesto(e.p, e.cdp, e.disp, e.r);
    if (e.conGL) await esperar3D(e.p, 30000);
    await chequear(e, 'final');
    await e.cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  },

  /* Pérdida y recuperación del contexto WebGL */
  'webgl-perdido': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'load' });
    await gesto(e.p, e.cdp, e.disp, e.r);
    if (!e.conGL) return;
    if (!await esperar3D(e.p, 12000)) { await noLlega(e); return; }
    if (e.r() < 0.4) await irA(e.p, Math.round(e.disp.alto * e.r.entre(0.05, 0.4)));
    const ok = await e.p.evaluate(() => {
      const c = document.querySelector('.hero-lienzo'); const gl = c && c.getContext('webgl2');
      const x = gl && gl.getExtension('WEBGL_lose_context');
      if (!x) return false; window.__qaPerder = x; x.loseContext(); return true;
    });
    if (!ok) { e.fallos.push({ tipo: 'entorno', clave: 'no se pudo perder el contexto', detalle: '' }); return; }
    await espera(e.r.entre(100, 600));
    await chequear(e, 'contexto perdido');
    await e.p.evaluate(() => { try { window.__qaPerder.restoreContext(); } catch (err) { /* el lienzo ya no existe */ } });
    await espera(400);
    await gesto(e.p, e.cdp, e.disp, e.r);
    await irA(e.p, 0);
    const vuelve = await esperar3D(e.p, 12000);
    await chequear(e, 'contexto recuperado');
    if (!vuelve) e.fallos.push({ tipo: 'hero', clave: 'la pista 3D no vuelve tras recuperar el contexto', detalle: '' });
  },

  /* Equipos sin WebGL: imagen fija */
  'sin-webgl': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'load' });
    await gesto(e.p, e.cdp, e.disp, e.r);
    await espera(e.r.entre(300, 2500));
    await quieta(e.p);
    const m = await chequear(e, 'final');
    if (m.lienzo) e.fallos.push({ tipo: 'hero', clave: 'hay lienzo 3D sin WebGL', detalle: '' });
    if (!m.imagen || !m.imagen.completa) e.fallos.push({ tipo: 'hero', clave: 'sin imagen fija', detalle: JSON.stringify(m.imagen) });
  },

  /* GPU con poca memoria: carga, scroll por el rango del hero y vuelta */
  /* GPU con poca memoria: en reposo (sin nada moviéndose: encendido
     terminado, sin .en-movimiento, fundido del 3D acabado) el hero tiene que
     verse entero. Durante el movimiento puede faltar memoria un instante;
     lo que se comprueba es que nada se quede así. */
  'gpu-justa': async e => {
    /* gpu-compartida: antes, otras 4 páginas del hero abiertas en el mismo
       navegador (la misma memoria de GPU), con su pista 3D y en reposo */
    if (e.compartida) {
      for (let i = 0; i < 4; i++) {
        const otra = await e.ctx.newPage();
        await otra.goto(URL_PIZARRA(e.base), { waitUntil: 'load' });
        await otra.mouse.move(200 + i * 50, 300);
        await otra.evaluate(() => dispatchEvent(new Event('scroll')));
      }
    }
    await e.p.bringToFront();
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'load' });
    await quieta(e.p);
    await enReposo(e.p);
    await chequear(e, 'al cargar', { reposo: true });
    await gesto(e.p, e.cdp, e.disp, e.r);
    const y = Math.round(e.disp.alto * e.r.entre(0.05, 0.9));
    await irA(e.p, y);
    await enReposo(e.p);
    await chequear(e, 'en ' + y, { reposo: true });
    await irA(e.p, 0);
    await esperar3D(e.p, 12000);
    await enReposo(e.p);
    await chequear(e, 'final', { reposo: true });
  },

  /* 32 MB (proporcional) con otras 4 páginas del hero a la vez en el mismo navegador */
  'gpu-compartida': async e => { e.compartida = true; return ESCENARIOS['gpu-justa'](e); },

  /* Movimiento reducido */
  'reducido': async e => {
    await e.p.goto(URL_PIZARRA(e.base), { waitUntil: 'load' });
    await quieta(e.p);
    await chequear(e, 'al cargar');
    await desplazar(e.p, e.cdp, e.disp, Math.round(e.disp.alto * 0.4));
    await espera(300);
    await irA(e.p, 0);
    await gesto(e.p, e.cdp, e.disp, e.r);
    await espera(e.r.entre(200, 1500));
    const m = await chequear(e, 'final');
    if (m.lienzo) e.fallos.push({ tipo: 'hero', clave: 'pista 3D con movimiento reducido', detalle: '' });
  }
};

/* Ejecuta un escenario en un dispositivo con una semilla. Devuelve
   { fallos, medidas }. navegadores(clave) → navegador lanzado con LANZAR[clave]. */
async function ejecutar(navegadores, { escenario, dispositivo, semilla, base, capturar, video }) {
  const disp = DISPOSITIVOS[dispositivo];
  const sinGL = escenario === 'sin-webgl';
  /* gpu-justa y gpu-compartida: un navegador propio por ejecución (la memoria
     de GPU forzada es de todo el navegador; con otras ejecuciones a la vez
     sería otro escenario) que se cierra al terminar */
  const justa = escenario === 'gpu-justa' || escenario === 'gpu-compartida';
  const clave = sinGL ? 'sinwebgl' : escenario === 'bfcache' ? 'ventana' : justa ? 'justa-' + memoriaJusta(disp) + '-' + dispositivo + '-' + semilla + '-' + escenario : 'gpu';
  const nav = await navegadores(clave);
  const ctx = await nav.newContext({
    viewport: { width: disp.ancho, height: disp.alto }, deviceScaleFactor: disp.dpr,
    isMobile: disp.movil, hasTouch: disp.movil,
    reducedMotion: escenario === 'reducido' ? 'reduce' : 'no-preference',
    locale: 'es-ES', serviceWorkers: 'block',
    /* vídeo opcional (carpeta): para enseñar el hero cargando en cada escenario */
    recordVideo: video ? { dir: video, size: { width: disp.ancho, height: disp.alto } } : undefined
  });
  await ctx.addInitScript(INIT_VISIBILIDAD);
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  const errores = [];
  p.on('pageerror', err => errores.push(err.message));
  const consola = [];
  p.on('console', m => { if (/Eleva/.test(m.text())) consola.push(m.text().slice(0, 160)); });
  const e = {
    p, ctx, cdp, disp, base, r: azar(semilla), fallos: [], medidas: [], consola,
    conGL: !sinGL && escenario !== 'reducido',
    capturar: capturar ? (png, etiqueta) => capturar(png, etiqueta) : null
  };
  try {
    await ESCENARIOS[escenario](e);
  } catch (err) {
    e.fallos.push({ tipo: 'ejecucion', clave: String(err.message).split('\n')[0].slice(0, 160), detalle: '' });
  } finally {
    errores.forEach(t => e.fallos.push({ tipo: 'error-de-pagina', clave: t.slice(0, 160), detalle: '' }));
    await ctx.close().catch(() => {});
    if (justa) await nav.close().catch(() => {});
  }
  const ruta = video && p.video() ? await p.video().path().catch(() => null) : null;
  return { fallos: e.fallos, medidas: e.medidas, video: ruta };
}

/* Opciones de lanzamiento de Chromium para una clave de ejecutar() */
function opcionesLanzar(clave) {
  const m = /^justa-([0-9]+)/.exec(clave);
  return m ? LANZAR.justa(Number(m[1])) : LANZAR[clave];
}

module.exports = { DISPOSITIVOS, ESCENARIOS, LANZAR, opcionesLanzar, memoriaJusta, ejecutar, azar };
