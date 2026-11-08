/* =========================================================
   Módulo «idiomas»
   ---------------------------------------------------------
   El sistema de idiomas de punta a punta (punto 7 del encargo):
   · sin-espanol: en EN y NL no queda ningún texto, atributo,
     <title>, meta description ni mensaje de WhatsApp igual al
     de la página en español, salvo nombres propios y neutros
     (tools/i18n.js) y traducciones iguales a propósito. Un texto
     pendiente de traducir solo vale marcado lang="es" y mientras
     PERMITIR_PENDIENTES sea true (tools/i18n.js); español sin
     marcar es siempre un fallo;
   · ida-vuelta: ES → EN → NL → ES con el teclado deja el DOM
     (outerHTML completo, con los comentarios <!--gen-->) idéntico;
   · primera-pintura: con EN/NL guardado no se pinta ningún
     fotograma con textos traducibles en español;
   · recordado: el idioma elegido pasa de / a /pizarra y a la 404;
     con el almacenamiento bloqueado, sin errores;
   · navegador: sin idioma guardado, el del navegador si es EN o
     NL (si no, español); lo guardado manda;
   · formulario: los mensajes de error salen en el idioma de la
     página y no se quedan en el anterior al cambiarlo; el mensaje
     de WhatsApp lleva las etiquetas traducidas;
   · sinjs: 404 y mantenimiento en español y sin selector.
   Los desbordes en EN/NL los revisa el módulo «responsive» (las
   cuatro páginas con idiomas, también a 320 px).
   ========================================================= */
'use strict';
const { vista } = require('../lib/vistas');
const { abrir, estabilizar, problemasDeRegistro } = require('../lib/pagina');
const I = require('../../i18n.js');
const T = require('../../../js/translations.js');

const PAGINAS = {
  marca: { ruta: '/', estado: 200 },
  pizarra: { ruta: '/pizarra', estado: 200 },
  404: { ruta: '/no-existe-qa', estado: 404 },
  mantenimiento: { ruta: '/pizarra', estado: 503, mantenimiento: true }
};
const baseDe = (pag, entorno) => (PAGINAS[pag].mantenimiento ? entorno.baseMantenimiento : entorno.base);

/* Estado de cada texto, calculado en Node desde las fuentes */
const ENTRADAS = I.entradas();
const PENDIENTE = l => new Set(ENTRADAS.filter(e => e.estado[l] === 'pendiente').map(e => e.id));
/* Traducciones iguales al español a propósito («Pools», nombres en claves) */
const IGUALES = l => ENTRADAS.filter(e => !e.soloEs && e.obj[l] && I.normalizar(e.obj[l]) === I.normalizar(e.es)).map(e => I.normalizar(e.es));
const valor = (clave, l) => {
  const e = T.textos[clave];
  const v = (e && (e[l] || e.es)) || '';
  return v.replace(/\{codigo\}/g, l.toUpperCase());
};

/* Vuelca en la página todo texto visible o audible, también oculto:
   nodos de texto del <body>, alt, aria-label, title, placeholder,
   <title>, meta description y el text= de los enlaces de WhatsApp */
function volcar() {
  const EN_LINEA = new Set(['SPAN', 'STRONG', 'EM', 'B', 'I', 'SMALL', 'TIME', 'ABBR']);
  const ruta = e => {
    const p = [];
    for (let x = e; x && x.nodeType === 1 && x !== document.documentElement; x = x.parentElement) {
      let s = x.tagName.toLowerCase();
      if (x.id) { p.unshift(s + '#' + x.id); break; }
      if (x.classList.length) s += '.' + x.classList[0];
      p.unshift(s);
    }
    return p.slice(-4).join('>');
  };
  const marcadoEs = e => { const l = e.closest('[lang]'); return !!l && l.getAttribute('lang') === 'es' && l !== document.documentElement; };
  const bloque = e => { let b = e; while (b && EN_LINEA.has(b.tagName) && b.parentElement) b = b.parentElement; return b; };
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const t = n.textContent.replace(/\s+/g, ' ').trim();
    const e = n.parentElement;
    if (!t || !e || e.closest('script, style, noscript, template')) continue;
    out.push({ tipo: 'texto', ruta: ruta(e), v: t, contexto: bloque(e).textContent.replace(/\s+/g, ' ').trim(), es: marcadoEs(e) });
  }
  for (const e of document.querySelectorAll('body [alt], body [aria-label], body [title], body [placeholder]')) {
    const claves = {};
    (e.getAttribute('data-i18n-attr') || '').split(';').forEach(p => { const i = p.indexOf(':'); if (i > 0) claves[p.slice(0, i).trim()] = p.slice(i + 1).trim(); });
    for (const a of ['alt', 'aria-label', 'title', 'placeholder']) {
      const v = e.getAttribute(a);
      if (v && v.trim()) out.push({ tipo: '@' + a, ruta: ruta(e), v: v.replace(/\s+/g, ' ').trim(), contexto: '', es: marcadoEs(e), clave: claves[a] || null });
    }
  }
  out.push({ tipo: 'title', ruta: 'head>title', v: document.title.trim(), contexto: '', es: false, clave: (document.querySelector('title') || { getAttribute: () => null }).getAttribute('data-i18n') });
  const md = document.querySelector('meta[name="description"]');
  if (md) out.push({ tipo: 'meta', ruta: 'meta[name=description]', v: md.content.trim(), contexto: '', es: false, clave: ((md.getAttribute('data-i18n-attr') || '').match(/content:([^;]+)/) || [])[1] || null });
  for (const a of document.querySelectorAll('a[href*="wa.me/"]')) {
    const m = /[?&]text=([^&]*)/.exec(a.getAttribute('href'));
    if (m) out.push({ tipo: 'whatsapp', ruta: ruta(a), v: decodeURIComponent(m[1]).replace(/\s+/g, ' ').trim(), contexto: '', es: false, clave: a.getAttribute('data-wa') });
  }
  return out;
}

async function cargar(entorno, pag, v, { lang = null, locale = 'es-ES', modo = 'normal' } = {}) {
  const r = await abrir(entorno.navegador, { vista: v, modo, lang, locale, base: baseDe(pag, entorno) });
  await r.p.goto(baseDe(pag, entorno) + PAGINAS[pag].ruta, { waitUntil: 'load' });
  await estabilizar(r.p);
  return r;
}

/* Elige un idioma con el teclado, como una persona (el ratón mueve el
   paralaje y el cursor y cambiaría el DOM) */
async function elegir(p, lang) {
  await p.focus('.idioma-boton');
  await p.keyboard.press('Enter');
  await p.keyboard.press('Home');
  for (let i = 0; i < ['es', 'en', 'nl'].indexOf(lang); i++) await p.keyboard.press('ArrowDown');
  await p.keyboard.press('Enter');
  await estabilizar(p);
}

function caso(id, pagina, rapido, fn, limiteMs) {
  return {
    id: 'idiomas · ' + id,
    pagina,
    rapido,
    limiteMs,
    async ejecutar(entorno) {
      const f = [];
      const ok = (c, clave, detalle) => { if (!c) f.push({ tipo: id.split(' · ')[1], clave, detalle: detalle === undefined ? '' : String(detalle) }); };
      const abiertos = [];
      try {
        await fn(entorno, ok, async (...a) => { const r = await cargar(entorno, ...a); abiertos.push(r); return r; }, f);
        if (f.length && abiertos.length) await entorno.capturar(abiertos[abiertos.length - 1].p, 'idiomas · ' + id);
        return f;
      } finally {
        for (const r of abiertos) await r.ctx.close().catch(() => {});
      }
    }
  };
}

function sinEspanol(pag, lang, nv) {
  return caso([pag, 'sin-espanol', lang, nv].join(' · '), pag, nv === '390x844', async (entorno, ok, cargarP, f) => {
    const v = vista(nv);
    const es = await cargarP(pag, v);
    const textosEs = new Set((await es.p.evaluate(volcar)).map(x => x.v));
    const r = await cargarP(pag, v, { lang });
    const pend = PENDIENTE(lang);
    const nombres = T.nombresPropios.concat(IGUALES(lang));
    ok(await r.p.evaluate(() => document.documentElement.lang) === lang, 'lang de <html>', await r.p.evaluate(() => document.documentElement.lang));
    for (const x of await r.p.evaluate(volcar)) {
      if (!textosEs.has(x.v) || I.esNeutro(x.v, nombres) || (x.contexto && I.esNeutro(x.contexto, nombres))) continue;
      /* Igual que en español: solo vale si es una traducción pendiente declarada */
      const pendiente = x.es || (x.clave && pend.has(x.clave));
      if (pendiente && I.PERMITIR_PENDIENTES) continue;
      ok(false, (pendiente ? 'pendiente de traducir (PERMITIR_PENDIENTES es false) ' : 'español sin traducir ni marcar ') + x.tipo + ' ' + x.ruta, x.v.slice(0, 90));
    }
    f.push(...await problemasDeRegistro(r.p, r.registro, { esperado: PAGINAS[pag].estado }));
  });
}

function idaVuelta(pag, nv, modo) {
  return caso([pag, 'ida-vuelta', nv, modo].join(' · '), pag, false, async (entorno, ok, cargarP, f) => {
    const r = await cargarP(pag, vista(nv), { modo });
    /* En /pizarra, después de que se cree la pista 3D (a los 6 s) */
    if (pag === 'pizarra' && modo === 'normal') { await r.p.waitForTimeout(7000); await estabilizar(r.p); }
    /* En reposo: las capas de .en-movimiento se sueltan 400 ms después del último fotograma */
    await r.p.waitForTimeout(600);
    await estabilizar(r.p);
    const antes = await r.p.evaluate(() => document.documentElement.outerHTML);
    for (const l of ['en', 'nl', 'es']) await elegir(r.p, l);
    await r.p.waitForTimeout(600);
    await estabilizar(r.p);
    const despues = await r.p.evaluate(() => document.documentElement.outerHTML);
    if (antes !== despues) {
      const A = antes.replace(/>/g, '>\n').split('\n'), B = despues.replace(/>/g, '>\n').split('\n');
      const distintas = [];
      for (let i = 0; i < Math.max(A.length, B.length) && distintas.length < 4; i++) if (A[i] !== B[i]) distintas.push('línea ' + (i + 1) + ': «' + String(A[i]).slice(0, 70) + '» → «' + String(B[i]).slice(0, 70) + '»');
      ok(false, 'el DOM no vuelve igual tras ES → EN → NL → ES', distintas.join(' | '));
    }
    ok((await r.p.evaluate(() => (document.documentElement.outerHTML.match(/<!--\/?gen-->/g) || []).length)) === (antes.match(/<!--\/?gen-->/g) || []).length, 'se pierden marcadores <!--gen-->');
    f.push(...await problemasDeRegistro(r.p, r.registro, { esperado: PAGINAS[pag].estado }));
  }, 120000);
}

/* Con EN/NL guardado, ningún fotograma con textos traducibles visibles
   antes de que main.js aplique el idioma (eleva:idioma) */
function primeraPintura(pag, lang) {
  return caso([pag, 'primera-pintura', lang, '390x844'].join(' · '), pag, pag === 'pizarra', async (entorno, ok) => {
    const v = vista('390x844');
    const { opcionesContexto } = require('../lib/pagina');
    const ctx = await entorno.navegador.newContext(opcionesContexto(v, 'normal'));
    try {
      await ctx.addInitScript(l => {
        try { localStorage.setItem('eleva-lang', l); } catch (e) { /* sin almacenamiento */ }
        window.__qaPintura = { fotogramas: 0, conEspanol: 0, muestra: null, aplicadoMs: null };
        document.addEventListener('eleva:idioma', () => { if (window.__qaPintura.aplicadoMs === null) window.__qaPintura.aplicadoMs = Math.round(performance.now()); });
        const mirar = () => {
          const q = window.__qaPintura;
          if (q.aplicadoMs !== null) return;
          q.fotogramas++;
          for (const e of document.querySelectorAll('[data-i18n], [data-gen]')) {
            if (e.closest('head') || !e.getClientRects().length || getComputedStyle(e).visibility !== 'visible' || !e.textContent.trim()) continue;
            q.conEspanol++;
            q.muestra = q.muestra || e.textContent.trim().slice(0, 60);
            break;
          }
          requestAnimationFrame(mirar);
        };
        requestAnimationFrame(mirar);
      }, lang);
      const p = await ctx.newPage();
      await p.goto(baseDe(pag, entorno) + PAGINAS[pag].ruta, { waitUntil: 'load' });
      await estabilizar(p);
      const q = await p.evaluate(() => window.__qaPintura);
      ok(q.aplicadoMs !== null, 'el idioma no se aplica (no llega eleva:idioma)');
      ok(q.conEspanol === 0, 'fotogramas pintados con textos en español antes de aplicar ' + lang, q.conEspanol + ' de ' + q.fotogramas + ' («' + q.muestra + '»)');
      ok(q.aplicadoMs === null || q.aplicadoMs < 1500, 'el idioma tarda más que el límite de js/idioma.js (1500 ms)', q.aplicadoMs + ' ms');
    } finally { await ctx.close(); }
  });
}

function recordado() {
  return caso('recordado · marca-pizarra-404 · 1280x800', 'pizarra', true, async (entorno, ok, cargarP, f) => {
    const r = await cargarP('marca', vista('1280x800'));
    const p = r.p;
    await elegir(p, 'nl');
    ok(await p.evaluate(() => localStorage.getItem('eleva-lang')) === 'nl', 'el idioma elegido no se guarda');
    for (const ruta of ['/pizarra', '/no-existe-qa']) {
      await p.goto(entorno.base + ruta, { waitUntil: 'load' });
      await estabilizar(p);
      const s = await p.evaluate(() => ({ lang: document.documentElement.lang, actual: (document.querySelector('.idioma[aria-current="true"]') || {}).dataset?.lang || null }));
      ok(s.lang === 'nl' && s.actual === 'nl', ruta + ' no abre en el idioma elegido en /', JSON.stringify(s));
    }
    await elegir(p, 'es');
    await p.goto(entorno.base + '/', { waitUntil: 'load' });
    await estabilizar(p);
    ok(await p.evaluate(() => document.documentElement.lang) === 'es', 'volver a ES en la 404 no se recuerda en /');
    f.push(...await problemasDeRegistro(p, r.registro, { esperado: 200 }).then(x => x.filter(y => !(y.tipo === 'consola' && /status of 404/.test(y.clave)))));
  });
}

function sinAlmacenamiento() {
  return caso('recordado · pizarra · almacenamiento-bloqueado · 1280x800', 'pizarra', false, async (entorno, ok, cargarP, f) => {
    const { opcionesContexto } = require('../lib/pagina');
    const ctx = await entorno.navegador.newContext(Object.assign(opcionesContexto(vista('1280x800'), 'normal'), { locale: 'en-GB' }));
    try {
      await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('almacenamiento bloqueado'); } }); });
      const p = await ctx.newPage();
      const errores = [];
      p.on('pageerror', e => errores.push(e.message));
      p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
      await p.goto(entorno.base + '/pizarra', { waitUntil: 'load' });
      await estabilizar(p);
      ok(await p.evaluate(() => document.documentElement.lang) === 'en', 'sin almacenamiento no se usa el idioma del navegador (en-GB)');
      await elegir(p, 'nl');
      ok(await p.evaluate(() => document.documentElement.lang) === 'nl', 'sin almacenamiento no se puede cambiar de idioma');
      ok(!errores.length, 'errores con el almacenamiento bloqueado', errores.join(' | ').slice(0, 160));
    } finally { await ctx.close(); }
  });
}

function navegador(pag) {
  return caso([pag, 'navegador', '1280x800'].join(' · '), pag, false, async (entorno, ok, cargarP) => {
    for (const [locale, guardado, esperado] of [['en-GB', null, 'en'], ['nl-NL', null, 'nl'], ['de-DE', null, 'es'], ['en-GB', 'es', 'es'], ['es-ES', 'nl', 'nl']]) {
      const r = await cargarP(pag, vista('1280x800'), { locale, lang: guardado });
      const s = await r.p.evaluate(() => ({ lang: document.documentElement.lang, guardado: localStorage.getItem('eleva-lang') }));
      ok(s.lang === esperado, 'navegador ' + locale + (guardado ? ' con «' + guardado + '» guardado' : '') + ': idioma', s.lang + ' (se esperaba ' + esperado + ')');
      ok(s.guardado === guardado, 'navegador ' + locale + ': se guarda un idioma sin que el usuario lo elija', s.guardado);
      await r.ctx.close();
    }
  });
}

function formulario() {
  return caso('pizarra · formulario · 390x844', 'pizarra', true, async (entorno, ok, cargarP, f) => {
    const r = await cargarP('pizarra', vista('390x844'), { lang: 'en' });
    const p = r.p;
    const mensaje = sel => p.evaluate(s => document.querySelector(s).validationMessage, sel);
    const enviar = async () => { await p.evaluate(() => document.querySelector('#contact-form [type="submit"]').click()); };
    await enviar();
    ok(await mensaje('#f-nombre') === valor('contact.errRequired', 'en'), 'campo vacío: el mensaje no está en inglés (o es el nativo del navegador)', await mensaje('#f-nombre'));
    await p.fill('#f-nombre', 'QA');
    await p.fill('#f-telefono', 'abc');
    await p.fill('#f-mensaje', 'QA');
    await enviar();
    ok(await mensaje('#f-telefono') === valor('contact.errPhone', 'en'), 'teléfono mal escrito: el mensaje no está en inglés', await mensaje('#f-telefono'));
    await elegir(p, 'nl');
    ok(await mensaje('#f-telefono') === '', 'tras cambiar a NL queda el error en inglés', await mensaje('#f-telefono'));
    await enviar();
    ok(await mensaje('#f-telefono') === valor('contact.errPhone', 'nl'), 'teléfono mal escrito: el mensaje no está en neerlandés', await mensaje('#f-telefono'));
    await p.fill('#f-telefono', '600 000 000');
    await p.evaluate(() => { window.__qaWa = null; HTMLAnchorElement.prototype.click = function () { window.__qaWa = this.href; }; });
    await enviar();
    const wa = await p.evaluate(() => window.__qaWa);
    const texto = wa ? decodeURIComponent((/[?&]text=([^&]*)/.exec(wa) || [])[1] || '') : '';
    const esperado = valor('wa.contact', 'nl') + '\n\n' + valor('contact.labelName', 'nl') + ': QA\n' + valor('contact.labelPhone', 'nl') + ': 600 000 000\n' + valor('contact.labelMessage', 'nl') + ': QA';
    ok(texto === esperado, 'el mensaje de WhatsApp no va en neerlandés', JSON.stringify(texto).slice(0, 120));
    f.push(...await problemasDeRegistro(p, r.registro, { esperado: 200 }));
  });
}

function sinJs(pag) {
  return caso([pag, 'sinjs', '390x844'].join(' · '), pag, false, async (entorno, ok, cargarP) => {
    const r = await cargarP(pag, vista('390x844'), { modo: 'sinjs', lang: 'nl', locale: 'nl-NL' });
    const s = await r.p.evaluate(() => {
      const sel = document.querySelector('.idioma-selector');
      return { lang: document.documentElement.lang, selector: sel ? getComputedStyle(sel).display : 'no hay', h1: (document.querySelector('h1') || {}).textContent };
    });
    ok(s.lang === 'es', 'sin JS no está en español', s.lang);
    ok(s.selector === 'none', 'sin JS el selector se ve', s.selector);
    if (pag === '404') ok(s.h1 === valor('e404.heading', 'es'), 'sin JS el título no es el español', s.h1);
  });
}

function casos() {
  const lista = [];
  for (const pag of Object.keys(PAGINAS)) for (const lang of ['en', 'nl']) for (const nv of ['390x844', '1280x800']) lista.push(sinEspanol(pag, lang, nv));
  lista.push(idaVuelta('pizarra', '390x844', 'normal'), idaVuelta('pizarra', '1280x800', 'normal'), idaVuelta('pizarra', '1280x800', 'reducido'),
    idaVuelta('marca', '390x844', 'normal'), idaVuelta('marca', '1280x800', 'normal'), idaVuelta('404', '1280x800', 'normal'), idaVuelta('mantenimiento', '390x844', 'normal'));
  lista.push(primeraPintura('pizarra', 'nl'), primeraPintura('pizarra', 'en'), primeraPintura('marca', 'nl'), primeraPintura('404', 'nl'), primeraPintura('mantenimiento', 'en'));
  lista.push(recordado(), sinAlmacenamiento());
  for (const pag of ['pizarra', '404', 'mantenimiento']) lista.push(navegador(pag));
  lista.push(formulario(), sinJs('404'), sinJs('mantenimiento'));
  return lista;
}

module.exports = {
  nombre: 'idiomas',
  descripcion: 'EN y NL sin español, ida y vuelta exacta, sin destello, idioma recordado y del navegador, formulario, 404 y mantenimiento',
  casos
};
