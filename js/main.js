/* ================================================================
   Eleva Pádel — main.js
   Idioma (selector de la cabecera), menú móvil, enlaces de WhatsApp,
   avisos con fecha y formulario. Sirve también a la 404 y a la página de
   mantenimiento: cada parte solo actúa si su elemento existe.
   El contenido del club ya viene en el HTML (tools/generar.js); al
   cambiar de idioma se vuelve a pintar con js/render.js.

   Textos: js/translations.js (window.ElevaTextos), una entrada por clave
   con sus tres idiomas. En el HTML:
     data-i18n="clave"                 el texto del elemento
     data-i18n-attr="atributo:clave;…" atributos (aria-label, alt, content…)
     data-i18n-fijo="atributo:clave"   solo español (og:*): main.js no lo toca
   Traducción pendiente (sin en/nl): se pinta el español y el elemento
   lleva lang="es". El idioma inicial lo decide js/idioma.js (en <head>).
   ================================================================ */
(function () {
  'use strict';

  var ES = 'es';
  var I = window.ElevaIdioma || { idiomas: [ES], inicial: ES, guardado: function () { return null; }, guardar: function () {}, listo: function () {} };
  var currentLang = ES;
  var R = window.ElevaRender;

  document.documentElement.classList.add('js');

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function safe(fn, name) { try { fn(); } catch (e) { console.error('[Eleva] ' + name + ':', e); } }
  function presente(v) { return R ? R.presente(v) : !!v; }
  function waURL(phone, msg) { return 'https://wa.me/' + phone + (msg ? '?text=' + encodeURIComponent(msg) : ''); }
  function reducedMotion() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ── i18n ───────────────────────────────────────────────────── */
  function entrada(key) {
    var T = (window.ElevaTextos || {}).textos || {};
    return Object.prototype.hasOwnProperty.call(T, key) ? T[key] : null;
  }
  /* { v: texto en el idioma activo (o en español si falta), falta: true si cae al español } */
  function texto(key) {
    var e = entrada(key);
    if (!e) return { v: '', falta: currentLang !== ES };
    var v = e[currentLang], falta = false;
    if (v == null || v === '') { v = e.es || ''; falta = currentLang !== ES; }
    return { v: v.replace(/\{codigo\}/g, currentLang.toUpperCase()), falta: falta };
  }
  function tr(key) { return texto(key).v; }

  /* Pares «atributo:clave» de data-i18n-attr */
  function pares(el) {
    return (el.getAttribute('data-i18n-attr') || '').split(';').map(function (p) {
      var i = p.indexOf(':');
      return i > 0 ? [p.slice(0, i).trim(), p.slice(i + 1).trim()] : null;
    }).filter(Boolean);
  }

  /* Vuelve a pintar las zonas del manifest en el idioma activo. Con sus
     marcadores <!--gen-->: el DOM queda igual que el HTML generado. */
  function renderClub() {
    var d = window.__ELEVA__;
    if (!d || !R) return;
    var s = R.crear(d, currentLang, tr);
    $$('[data-gen]').forEach(function (el) {
      var z = s[el.getAttribute('data-gen')];
      if (z) el.innerHTML = '<!--gen-->' + z.html + '<!--/gen-->';
    });
    $$('[data-seccion]').forEach(function (el) {
      var z = s[el.getAttribute('data-seccion')];
      if (z) el.hidden = !z.visible;
    });
    /* El HTML es nuevo: js/movimiento/ vuelve a engancharse */
    document.dispatchEvent(new CustomEvent('eleva:repintado', { detail: { lang: currentLang } }));
  }

  /* Cambia TODO al idioma: lang, <title> y metas, textos y atributos de la
     interfaz, zonas del club, WhatsApp, avisos y mensajes del formulario.
     Mismo orden siempre; volver al idioma anterior deja el DOM igual. */
  function aplicarIdioma(lang) {
    if (I.idiomas.indexOf(lang) < 0) lang = ES;
    var cambia = lang !== currentLang;
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    $$('[data-i18n]').forEach(function (el) {
      var r = texto(el.getAttribute('data-i18n'));
      el.textContent = r.v;
      if (r.falta) el.setAttribute('lang', ES); else el.removeAttribute('lang');
    });
    $$('[data-i18n-attr]').forEach(function (el) {
      pares(el).forEach(function (p) { el.setAttribute(p[0], tr(p[1])); });
    });
    $$('.idioma').forEach(function (b) {
      if (b.getAttribute('data-lang') === lang) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    var codigo = lang.toUpperCase();
    $$('.idioma-actual').forEach(function (el) { el.textContent = codigo; });
    var mb = $('.menu-boton');
    if (mb) mb.setAttribute('aria-label', tr(mb.getAttribute('aria-expanded') === 'true' ? 'nav.menuClose' : 'nav.menuOpen'));

    if (cambia) renderClub();       /* en español el HTML ya viene pintado */
    applyWaLinks();
    renderEventos();
    limpiarValidacion();
    I.listo();
    document.dispatchEvent(new CustomEvent('eleva:idioma', { detail: { lang: lang } }));
  }

  function initI18n() {
    currentLang = ES;
    aplicarIdioma(I.inicial);
    /* Vuelta desde la caché atrás/adelante: si se eligió otro idioma en
       otra página, se aplica */
    window.addEventListener('pageshow', function (e) {
      var l = e.persisted && I.guardado();
      if (l && l !== currentLang) aplicarIdioma(l);
    });
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
        aplicarIdioma(l);
        I.guardar(l);               /* solo se guarda cuando el usuario elige */
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
      boton.setAttribute('aria-label', tr('nav.menuOpen'));
      menu.classList.remove('abierto');
      document.body.classList.remove('sin-scroll');
      if (devolverFoco) boton.focus();
    }
    function abrir() {
      boton.setAttribute('aria-expanded', 'true');
      boton.setAttribute('aria-label', tr('nav.menuClose'));
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
      /* El foco no sale del menú abierto: botón y enlaces, en ciclo (el
         <nav> va antes que el botón en el DOM, así que se ordena a mano) */
      var items = [boton].concat($$('a[href], button', menu).filter(function (el) { return el.offsetParent !== null; }));
      var i = items.indexOf(document.activeElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length].focus();
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
    var cae = function (v) { return currentLang !== ES && !!v && typeof v === 'object' && !v[currentLang]; };
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
      var la = (cae(ev.titulo) || cae(ev.texto) || (ev.enlace && cae(ev.enlace.texto))) ? ' lang="es"' : '';
      return '<p' + la + '><strong>' + R.esc(L(ev.titulo)) + '</strong> ' + R.esc(L(ev.texto)) + link + '</p>';
    }).join('');
    box.hidden = !vigentes.length;
  }

  /* ── Formulario → WhatsApp ──────────────────────────────────── */
  /* Al cambiar de idioma no puede quedar un error en el idioma anterior */
  function limpiarValidacion() {
    var form = document.getElementById('contact-form');
    if (form) $$('input, textarea', form).forEach(function (el) { el.setCustomValidity(''); });
  }

  function initContact() {
    var form = document.getElementById('contact-form');
    var d = window.__ELEVA__;
    var phone = d && d.contacto && d.contacto.whatsapp;
    if (!form || !presente(phone)) return;
    var submit = $('[type="submit"]', form);
    if (submit) submit.disabled = false;
    /* La validación es nuestra (en el idioma de la página), no la nativa del
       navegador (en el idioma del sistema). Sin JS el botón está desactivado. */
    form.noValidate = true;

    var PHONE_OK = /^[0-9 +()-]{6,20}$/;
    function error(el) {
      var v = (el.value || '').trim();
      if (el.required && !v) return tr('contact.errRequired');
      if (el.name === 'telefono' && (!PHONE_OK.test(v) || v.replace(/\D/g, '').length < 6)) return tr('contact.errPhone');
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
        tr('contact.labelName') + ': ' + v('nombre') + '\n' +
        tr('contact.labelPhone') + ': ' + v('telefono') + '\n' +
        tr('contact.labelMessage') + ': ' + v('mensaje');
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

  /* ── Borrador local de la web de la marca ─────────────────────
     Solo en el servidor local y con ?borrador en la dirección: el archivo
     (marca-borrador.js) está fuera de Git y de Vercel. En producción no
     se pide nada. */
  function initBorradorMarca() {
    if (!document.body.classList.contains('marca')) return;
    if (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || !/[?&]borrador\b/.test(location.search)) return;
    var s = document.createElement('script');
    s.src = 'marca-borrador.js';
    document.body.appendChild(s);
  }

  function init() {
    safe(initMenu, 'menu');
    safe(initI18n, 'i18n');
    safe(initSelectorIdioma, 'idioma');
    safe(initContact, 'contact');
    safe(initAnchors, 'anchors');
    safe(initBorradorMarca, 'borrador');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
