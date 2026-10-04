/* ================================================================
   Eleva Pádel — main.js
   Idioma (selector de la cabecera), menú móvil, enlaces de WhatsApp,
   avisos con fecha y formulario.
   El contenido del club ya viene en el HTML (tools/generar.js); al
   cambiar de idioma se vuelve a pintar con js/render.js.
   ================================================================ */
(function () {
  'use strict';

  var DEFAULT_LANG = 'es';
  var LANG_KEY = 'eleva-lang';
  var currentLang = DEFAULT_LANG;
  var R = window.ElevaRender;

  document.documentElement.classList.add('js');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function safe(fn, name) { try { fn(); } catch (e) { console.error('[Eleva] ' + name + ':', e); } }
  function presente(v) { return R ? R.presente(v) : !!v; }
  function waURL(phone, msg) { return 'https://wa.me/' + phone + (msg ? '?text=' + encodeURIComponent(msg) : ''); }
  function reducedMotion() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* El almacenamiento puede lanzar (ventana privada): nunca debe romper */
  function getStoredLang() { try { return window.localStorage.getItem(LANG_KEY) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; } }
  function setStoredLang(l) { try { window.localStorage.setItem(LANG_KEY, l); } catch (e) { /* no-op */ } }

  /* ── i18n ───────────────────────────────────────────────────── */
  function hasOwn(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
  function tr(key, fallback) {
    var g = window.__ELEVA_I18N__ || {};
    var get = function (l) {
      return hasOwn(g, l) ? key.split('.').reduce(function (o, k) { return (o != null && hasOwn(o, k)) ? o[k] : undefined; }, g[l]) : undefined;
    };
    var v = get(currentLang);
    if (v === undefined) v = get(DEFAULT_LANG);
    return v === undefined ? (fallback || '') : v;
  }

  /* Vuelve a pintar las zonas del manifest en el idioma activo */
  function renderClub() {
    var d = window.__ELEVA__;
    if (!d || !R) return;
    var s = R.crear(d, currentLang, function (k) { return tr(k); });
    $$('[data-gen]').forEach(function (el) {
      var z = s[el.getAttribute('data-gen')];
      if (z) el.innerHTML = z.html;
    });
    $$('[data-seccion]').forEach(function (el) {
      var z = s[el.getAttribute('data-seccion')];
      if (z) el.hidden = !z.visible;
    });
    /* El HTML es nuevo: js/movimiento/ vuelve a engancharse */
    document.dispatchEvent(new CustomEvent('eleva:repintado', { detail: { lang: currentLang } }));
  }

  function applyLang(lang) {
    var g = window.__ELEVA_I18N__ || {};
    if (!hasOwn(g, lang)) lang = DEFAULT_LANG;
    var cambia = lang !== currentLang;
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    $$('[data-i18n]').forEach(function (el) {
      var v = tr(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });
    $$('[data-i18n-arialabel]').forEach(function (el) {
      var v = tr(el.getAttribute('data-i18n-arialabel'));
      if (v) el.setAttribute('aria-label', v);
    });
    $$('.idioma').forEach(function (b) {
      if (b.getAttribute('data-lang') === lang) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    var codigo = lang.toUpperCase();
    $$('.idioma-actual').forEach(function (el) { el.textContent = codigo; });
    $$('.idioma-boton').forEach(function (b) { b.setAttribute('aria-label', tr('nav.langLabel', 'Idioma') + ': ' + codigo); });
    var mb = $('.menu-boton');
    if (mb) mb.setAttribute('aria-label', tr(mb.getAttribute('aria-expanded') === 'true' ? 'nav.menuClose' : 'nav.menuOpen'));

    if (cambia) renderClub();       /* en español el HTML ya viene pintado */
    applyWaLinks();
    renderEventos();
  }

  function initI18n() {
    var inicial = getStoredLang();
    currentLang = DEFAULT_LANG;
    applyLang(inicial);
  }

  /* ── Selector de idioma (cabecera) ──────────────────────────
     Patrón de botón desplegable: el botón muestra el idioma actual y
     abre la lista (aria-expanded). Enter, Espacio o flecha abajo la abren
     con el foco en la opción actual (flecha arriba: en la última);
     flechas, Inicio y Fin recorren las opciones; Escape cierra y devuelve
     el foco al botón; Tab o un clic fuera la cierran. La opción activa
     lleva aria-current. */
  function initSelectorIdioma() {
    var sel = $('.idioma-selector');
    if (!sel) return;
    var boton = $('.idioma-boton', sel);
    var lista = $('.idioma-lista', sel);
    function opciones() { return $$('.idioma', lista); }
    function abierto() { return boton.getAttribute('aria-expanded') === 'true'; }
    function abrir(foco) {
      boton.setAttribute('aria-expanded', 'true');
      lista.hidden = false;
      if (!foco) return;
      var o = opciones();
      var i = Math.max(0, o.findIndex(function (b) { return b.getAttribute('aria-current') === 'true'; }));
      (foco === 'ultima' ? o[o.length - 1] : o[i]).focus();
    }
    function cerrar(devolverFoco) {
      if (!abierto()) return;
      boton.setAttribute('aria-expanded', 'false');
      lista.hidden = true;
      if (devolverFoco) boton.focus();
    }
    var porTeclado = false;
    boton.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); abrir(e.key === 'ArrowUp' ? 'ultima' : 'actual'); }
      else if (e.key === 'Enter' || e.key === ' ') porTeclado = true;
    });
    boton.addEventListener('click', function () {
      if (abierto()) cerrar(false); else abrir(porTeclado ? 'actual' : null);
      porTeclado = false;
    });
    lista.addEventListener('keydown', function (e) {
      var o = opciones(), i = o.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); o[(i + 1) % o.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); o[(i - 1 + o.length) % o.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); o[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); o[o.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); cerrar(true); }
      else if (e.key === 'Tab') cerrar(false);
    });
    opciones().forEach(function (b) {
      b.addEventListener('click', function () {
        var l = b.getAttribute('data-lang');
        applyLang(l);
        setStoredLang(l);           /* solo se guarda cuando el usuario elige */
        cerrar(true);
      });
    });
    document.addEventListener('click', function (e) { if (abierto() && !sel.contains(e.target)) cerrar(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && abierto()) cerrar(true); });
  }

  /* ── Menú móvil ─────────────────────────────────────────────── */
  function initMenu() {
    var boton = $('.menu-boton');
    var menu = document.getElementById('menu');
    if (!boton || !menu) return;
    var escritorio = window.matchMedia('(min-width: 64rem)');

    function abierto() { return boton.getAttribute('aria-expanded') === 'true'; }
    function cerrar(devolverFoco) {
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', tr('nav.menuOpen', 'Abrir menú'));
      menu.classList.remove('abierto');
      document.body.classList.remove('sin-scroll');
      if (devolverFoco) boton.focus();
    }
    function abrir() {
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', tr('nav.menuClose', 'Cerrar menú'));
      menu.classList.add('abierto');
      document.body.classList.add('sin-scroll');
      var primero = $('a, button', menu);
      if (primero) primero.focus();
    }

    boton.addEventListener('click', function () { if (abierto()) cerrar(true); else abrir(); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { if (abierto()) cerrar(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!abierto()) return;
      if (e.key === 'Escape') { cerrar(true); return; }
      if (e.key !== 'Tab') return;
      var items = [boton].concat($$('a[href], button', menu).filter(function (el) { return el.offsetParent !== null; }));
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    var onMq = function (e) { if (e.matches && abierto()) cerrar(false); };
    if (escritorio.addEventListener) escritorio.addEventListener('change', onMq); else escritorio.addListener(onMq);
  }

  /* ── WhatsApp con mensaje en el idioma activo ───────────────── */
  function applyWaLinks() {
    var d = window.__ELEVA__;
    var phone = d && d.contacto && d.contacto.whatsapp;
    if (!presente(phone)) return;
    $$('a[data-wa]').forEach(function (a) { a.href = waURL(phone, tr(a.getAttribute('data-wa'))); });
  }

  /* ── Avisos con fecha: solo entre `desde` y `hasta` ─────────── */
  function renderEventos() {
    var box = document.getElementById('eventos');
    var d = window.__ELEVA__;
    if (!box || !d || !R) return;
    var L = function (v) { return typeof v === 'string' ? v : (v && (v[currentLang] || v.es)) || ''; };
    var now = Date.now();
    var vigentes = (Array.isArray(d.eventos) ? d.eventos : []).filter(function (ev) {
      var hasta = Date.parse(ev && ev.hasta);
      if (isNaN(hasta)) { console.warn('[Eleva] aviso sin fecha de fin válida:', ev && ev.id); return false; }
      var desde = ev.desde ? Date.parse(ev.desde) : -Infinity;
      return now >= desde && now < hasta;
    });
    box.innerHTML = vigentes.map(function (ev) {
      var link = ev.enlace && presente(ev.enlace.url)
        ? ' <a href="' + R.esc(ev.enlace.url) + '" target="_blank" rel="noopener noreferrer">' + R.esc(L(ev.enlace.texto)) + '</a>'
        : '';
      return '<p><strong>' + R.esc(L(ev.titulo)) + '</strong> ' + R.esc(L(ev.texto)) + link + '</p>';
    }).join('');
    box.hidden = !vigentes.length;
  }

  /* ── Formulario → WhatsApp ──────────────────────────────────── */
  function initContact() {
    var form = document.getElementById('contact-form');
    var d = window.__ELEVA__;
    var phone = d && d.contacto && d.contacto.whatsapp;
    if (!form || !presente(phone)) return;
    var submit = $('[type="submit"]', form);
    if (submit) submit.disabled = false;

    var PHONE_OK = /^[0-9 +()-]{6,20}$/;
    function error(el) {
      var v = (el.value || '').trim();
      if (el.required && !v) return tr('contact.errRequired', 'Rellena este campo.');
      if (el.name === 'telefono' && (!PHONE_OK.test(v) || v.replace(/\D/g, '').length < 6)) return tr('contact.errPhone', 'Escribe un teléfono válido.');
      return '';
    }
    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { el.setCustomValidity(''); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var campos = $$('input, textarea', form);
      for (var i = 0; i < campos.length; i++) {
        var err = error(campos[i]);
        if (err) { campos[i].setCustomValidity(err); campos[i].reportValidity(); return; }
      }
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var msg = tr('wa.contact') + '\n\n' +
        tr('contact.labelName', 'Nombre') + ': ' + v('nombre') + '\n' +
        tr('contact.labelPhone', 'Teléfono') + ': ' + v('telefono') + '\n' +
        tr('contact.labelMessage', 'Mensaje') + ': ' + v('mensaje');
      var link = document.createElement('a');
      link.href = waURL(phone, msg);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  /* Anclas: el foco acompaña al salto (teclado y lectores de pantalla) */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target || target.hidden) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  function init() {
    safe(initMenu, 'menu');
    safe(initI18n, 'i18n');
    safe(initSelectorIdioma, 'idioma');
    safe(initContact, 'contact');
    safe(initAnchors, 'anchors');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
