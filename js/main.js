/* ================================================================
   Eleva Pádel — main.js
   Idioma, menú, botón de reservar, pintado desde el manifest del club
   (window.__ELEVA__) y formulario de WhatsApp. Sin dependencias.
   Regla: un dato ausente o marcado PENDIENTE_* no se pinta, y la
   sección que se queda sin datos se oculta.
   ================================================================ */
(function () {
  'use strict';

  var DEFAULT_LANG = 'es';
  var LANG_KEY = 'eleva-lang';
  var POOLS_BASE = '../assets/pools/opt/';
  var currentLang = DEFAULT_LANG;

  /* ── Utilidades ─────────────────────────────────────────────── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function safe(fn, name) { try { fn(); } catch (e) { console.error('[Eleva] ' + name + ':', e); } }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Dato publicable: ni vacío ni marcado como pendiente */
  function presente(v) {
    if (v == null || v === '') return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.indexOf('PENDIENTE_') !== 0;
    return true;
  }

  /* Texto localizado: { es, en, nl } con respaldo en español */
  function L(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[currentLang] || v[DEFAULT_LANG] || '';
  }

  function waURL(phone, msg) {
    return 'https://wa.me/' + phone + (msg ? '?text=' + encodeURIComponent(msg) : '');
  }

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* El almacenamiento puede lanzar (ventana privada): nunca debe romper */
  function getStoredLang() {
    try { return window.localStorage.getItem(LANG_KEY) || DEFAULT_LANG; } catch (e) { return DEFAULT_LANG; }
  }
  function setStoredLang(lang) {
    try { window.localStorage.setItem(LANG_KEY, lang); } catch (e) { /* no-op */ }
  }

  /* ── i18n ───────────────────────────────────────────────────── */
  function hasOwn(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }

  function resolveKey(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o != null && hasOwn(o, k)) ? o[k] : undefined;
    }, obj);
  }

  function tr(key, fallback) {
    var g = window.__ELEVA_I18N__ || {};
    var v = hasOwn(g, currentLang) ? resolveKey(g[currentLang], key) : undefined;
    if (v === undefined && hasOwn(g, DEFAULT_LANG)) v = resolveKey(g[DEFAULT_LANG], key);
    return v === undefined ? fallback : v;
  }

  function applyLang(lang) {
    var g = window.__ELEVA_I18N__ || {};
    if (!hasOwn(g, lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);

    $$('[data-i18n]').forEach(function (el) {
      var v = tr(el.getAttribute('data-i18n'));
      if (v !== undefined) el.textContent = v;
    });
    $$('[data-i18n-arialabel]').forEach(function (el) {
      var v = tr(el.getAttribute('data-i18n-arialabel'));
      if (v !== undefined) el.setAttribute('aria-label', v);
    });
    $$('.lang-btn').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
    var burger = $('.nav-burger');
    if (burger) {
      burger.setAttribute('aria-label', tr(burger.classList.contains('is-open') ? 'nav.menuClose' : 'nav.menuOpen', ''));
    }

    renderClub();
    applyWaLinks();
  }

  function initI18n() {
    applyLang(getStoredLang());
    $$('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var l = btn.getAttribute('data-lang');
        applyLang(l);
        setStoredLang(l);        /* solo se guarda cuando el usuario elige */
      });
    });
  }

  /* ── Menú móvil ─────────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('main-nav');
    var burger = nav && $('.nav-burger', nav);
    var overlay = document.getElementById('nav-overlay');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav-scrolled', window.scrollY > 60);
    }, { passive: true });

    if (!burger || !overlay) return;
    overlay.setAttribute('inert', '');

    function close(returnFocus) {
      overlay.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', tr('nav.menuOpen', 'Abrir menú'));
      overlay.setAttribute('inert', '');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (returnFocus) burger.focus();
    }
    function open() {
      overlay.removeAttribute('inert');
      overlay.removeAttribute('aria-hidden');
      overlay.classList.add('is-open');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', tr('nav.menuClose', 'Cerrar menú'));
      document.body.style.overflow = 'hidden';
      var first = $('a, button', overlay);
      if (first) first.focus();
    }

    burger.addEventListener('click', function () {
      if (overlay.classList.contains('is-open')) close(true); else open();
    });
    $$('a', overlay).forEach(function (a) { a.addEventListener('click', function () { close(false); }); });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(true); return; }
      if (e.key !== 'Tab') return;
      /* Foco atrapado entre el botón del menú y los enlaces del menú */
      var items = [burger].concat($$('a[href], button:not([disabled])', overlay));
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    var mq = window.matchMedia('(max-width: 1024px)');
    var onMq = function (e) { if (!e.matches && overlay.classList.contains('is-open')) close(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }

  /* ── Botón flotante: oculto sobre el hero, el contacto y el pie ── */
  function initFab() {
    var fab = $('.fab-triangle');
    if (!fab || !('IntersectionObserver' in window)) return;
    var zones = ['hero', 'contacto', 'footer'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
      var hide = Object.keys(seen).some(function (k) { return seen[k]; });
      fab.classList.toggle('is-hidden', hide);
      var a = $('a', fab);
      if (a) { if (hide) a.setAttribute('tabindex', '-1'); else a.removeAttribute('tabindex'); }
    });
    zones.forEach(function (z) { io.observe(z); });
  }

  /* ── Pintado desde el manifest ──────────────────────────────── */
  function show(id, on) {
    var el = document.getElementById(id);
    if (el) el.hidden = !on;
    return el;
  }

  function list(items, cls) {
    return '<ul' + (cls ? ' class="' + cls + '"' : '') + '>' +
      items.map(function (i) { return '<li>' + esc(L(i)) + '</li>'; }).join('') + '</ul>';
  }

  function priceCard(b) {
    if (!b) return '';
    var price = presente(b.precio)
      ? '<p class="academy-rate-price">' + esc(b.precio) + ' <span class="academy-rate-unit">' + esc(L(b.unidad)) + '</span></p>'
      : '';
    return '<div class="academy-rate-block"><h3 class="academy-rate-cat">' + esc(L(b.titulo)) + '</h3>' +
      price + (presente(b.detalle) ? list(b.detalle, 'academy-includes') : '') + '</div>';
  }

  function renderClub() {
    var d = window.__ELEVA__;
    if (!d) return;
    var c = d.contacto || {};

    /* El club: instalaciones, reservas, comunidad y horario si existe */
    var defs = $('#club-defs');
    if (defs) {
      var rows = [];
      if (d.instalaciones && presente(d.instalaciones.items)) {
        rows.push(['club.facilities', list(d.instalaciones.items, 'club-list')]);
      }
      if (d.reservas && presente(c.reservas)) {
        rows.push(['club.bookings', esc(L(d.reservas.canales)) + '<br><a href="' + esc(c.reservas) +
          '" target="_blank" rel="noopener noreferrer">Vola</a>']);
      }
      if (presente(c.comunidad)) {
        rows.push(['club.community', '<a href="' + esc(c.comunidad) + '" target="_blank" rel="noopener noreferrer">' +
          esc(tr('contact.communityLink', '')) + '</a>']);
      }
      defs.innerHTML = rows.map(function (r) {
        return '<div class="club-def"><dt>' + esc(tr(r[0], '')) + '</dt><dd>' + r[1] + '</dd></div>';
      }).join('');
    }

    /* Clases */
    var t = d.tarifas || {};
    var cl = presente(t.clases) ? t.clases : null;
    var inf = presente(t.infantil) ? t.infantil : null;
    var grid = $('#clases-grid');
    if (grid) {
      grid.innerHTML = (cl ? priceCard(cl.grupo) + priceCard(cl.otras) : '') + (inf ? priceCard(inf) : '');
      show('clases', !!(cl || inf));
    }

    /* Pools */
    var p = d.pools;
    var poolsGrid = $('#pools-grid');
    if (poolsGrid && p && presente(p.insignias)) {
      poolsGrid.innerHTML = p.insignias.map(function (i) {
        var s = POOLS_BASE + i.img;
        return '<li class="pool-item"><picture>' +
          '<source type="image/avif" srcset="' + s + '-240.avif 240w, ' + s + '-480.avif 480w, ' + s + '-720.avif 720w" ' +
          'sizes="(min-width: 64rem) 240px, (min-width: 40rem) 30vw, 45vw">' +
          '<img src="' + s + '-480.jpg" width="480" height="480" loading="lazy" decoding="async" alt="' + esc(i.alt) + '">' +
          '</picture></li>';
      }).join('');
      var pt = $('#pools-text');
      if (pt) pt.textContent = L(p.texto);
      show('pools', true);
    }

    /* Otros servicios */
    if (d.otrosServicios && presente(d.otrosServicios.texto)) {
      var st = $('#servicios-text');
      if (st) st.textContent = L(d.otrosServicios.texto);
      show('servicios', true);
    }

    /* Cancelaciones */
    var cn = d.cancelaciones;
    var cb = $('#cancelaciones-body');
    if (cb && presente(cn)) {
      cb.innerHTML = [cn.pistas, cn.clases].filter(Boolean).map(function (b) {
        return '<div class="policy-block"><h3>' + esc(L(b.titulo)) + '</h3>' + list(b.items) + '</div>';
      }).join('') + (cn.nota ? '<p class="policy-note">' + esc(L(cn.nota)) + '</p>' : '');
      show('cancelaciones', true);
    }

    /* Equipo: nombre siempre; foto, cargo y bio solo si están confirmados */
    var tg = $('#team-grid');
    if (tg && presente(d.equipo)) {
      tg.innerHTML = d.equipo.map(function (m) {
        var photo = presente(m.foto)
          ? '<img class="team-photo" src="' + esc(m.foto) + '" width="632" height="800" loading="lazy" decoding="async" alt="' + esc(m.nombre) + '">'
          : '<div class="team-photo team-photo--empty" aria-hidden="true"><span class="team-photo-initial">' +
              esc(String(m.nombre).charAt(0)) + '</span></div>';
        return '<div class="team-card"><div class="team-photo-wrap">' + photo + '</div><div class="team-info">' +
          '<h3 class="team-name">' + esc(m.nombre) + '</h3>' +
          (presente(m.rol) ? '<p class="team-role">' + esc(L(m.rol)) + '</p>' : '') +
          (presente(m.bio) ? '<p class="team-bio">' + esc(L(m.bio)) + '</p>' : '') +
          '</div></div>';
      }).join('');
      show('equipo', true);
    }

    /* Patrocinadores */
    var sl = $('#sponsors-list');
    if (sl && presente(d.patrocinadores)) {
      sl.innerHTML = d.patrocinadores.map(function (s) {
        return '<li class="sponsor-row"><span class="sponsor-row-name">' + esc(s.nombre) + '</span>' +
          (presente(s.tipo) ? '<span class="sponsor-row-badge">' + esc(L(s.tipo)) + '</span>' : '') + '</li>';
      }).join('');
      show('patrocinadores', true);
    }

    /* Galería: solo con fotos reales (AVIF + JPEG, varios tamaños) */
    var gg = $('#galeria-lista');
    if (gg && presente(d.galeria)) {
      gg.innerHTML = d.galeria.map(function (f) {
        var b = f.base;
        return '<li><picture>' +
          '<source type="image/avif" srcset="' + b + '-480.avif 480w, ' + b + '-960.avif 960w, ' + b + '-1440.avif 1440w" ' +
          'sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw">' +
          '<img src="' + b + '-960.jpg" width="' + esc(f.w) + '" height="' + esc(f.h) + '" loading="lazy" decoding="async" alt="' + esc(L(f.alt)) + '">' +
          '</picture></li>';
      }).join('');
      show('galeria', true);
    }

    /* Plano estático (clubs/_plantilla/generar-mapa.js): solo con coordenadas confirmadas */
    var map = $('#club-map');
    if (map && presente(c.mapImage) && presente(c.mapsUrl)) {
      map.innerHTML = '<a href="' + esc(c.mapsUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="' +
        esc(tr('contact.maps', '')) + '"><img src="' + esc(c.mapImage) + '" width="1200" height="480" alt="" loading="lazy" decoding="async"></a>' +
        '<small>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors</small>';
      map.hidden = false;
    }

    renderEventos(d);
  }

  /* Avisos con fecha: se pintan solo entre `desde` y `hasta`.
     Sin `hasta` válido no se pintan nunca. */
  function renderEventos(d) {
    var box = $('#eventos');
    if (!box) return;
    var now = Date.now();
    var vigentes = (Array.isArray(d.eventos) ? d.eventos : []).filter(function (ev) {
      var hasta = Date.parse(ev && ev.hasta);
      if (isNaN(hasta)) { console.warn('[Eleva] evento sin fecha de fin válida:', ev && ev.id); return false; }
      var desde = ev.desde ? Date.parse(ev.desde) : -Infinity;
      return now >= desde && now < hasta;
    });
    box.innerHTML = vigentes.map(function (ev) {
      var link = ev.enlace && presente(ev.enlace.url)
        ? ' <a href="' + esc(ev.enlace.url) + '" target="_blank" rel="noopener noreferrer">' + esc(L(ev.enlace.texto)) + '</a>'
        : '';
      return '<p class="club-event"><strong>' + esc(L(ev.titulo)) + '</strong> ' + esc(L(ev.texto)) + link + '</p>';
    }).join('');
    box.hidden = !vigentes.length;
  }

  /* Enlaces de WhatsApp con mensaje en el idioma activo */
  function applyWaLinks() {
    var d = window.__ELEVA__;
    var phone = d && d.contacto && d.contacto.whatsapp;
    if (!presente(phone)) return;
    $$('.js-wa').forEach(function (a) { a.href = waURL(phone, tr(a.getAttribute('data-wa'), '')); });
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
      if (el.name === 'telefono' && (!PHONE_OK.test(v) || v.replace(/\D/g, '').length < 6)) {
        return tr('contact.errPhone', 'Escribe un teléfono válido.');
      }
      return '';
    }
    $$('input, textarea', form).forEach(function (el) {
      el.addEventListener('input', function () { el.setCustomValidity(''); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = $$('input, textarea', form);
      for (var i = 0; i < fields.length; i++) {
        var msgErr = error(fields[i]);
        if (msgErr) { fields[i].setCustomValidity(msgErr); fields[i].reportValidity(); return; }
      }
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var msg = tr('wa.contact', '') + '\n\n' +
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
      if (!a) return;
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target || target.hidden) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  function init() {
    safe(initNav, 'nav');
    safe(initFab, 'fab');
    safe(initI18n, 'i18n');          /* también pinta el club */
    safe(initContact, 'contact');
    safe(initAnchors, 'anchors');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
