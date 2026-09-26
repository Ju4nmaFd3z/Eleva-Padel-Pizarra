/* ================================================================
   ELEVA PADEL CLUB — main.js
   IIFE pattern. Sin módulos, sin build. Funciona en file://.
   ================================================================ */
(function () {
  'use strict';

  /* ────────────────────────────────────────────────────────────────
     UTILIDADES
  ──────────────────────────────────────────────────────────────── */
  function safe(fn, name) {
    try { fn(); }
    catch (e) { console.error('[Eleva] ' + name + ' falló:', e); }
  }

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function lerp(a, b, n) { return (1 - n) * a + n * b; }

  function waURL(phone, msg) {
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg);
  }

  function isTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /* ────────────────────────────────────────────────────────────────
     CONSTANTES
  ──────────────────────────────────────────────────────────────── */
  var DEFAULT_LANG = 'es';
  var LANG_KEY     = 'eleva-lang';
  var SPLASH_KEY   = 'eleva-splash-seen';
  var SPLASH_MS    = 1000;             /* splash: ~1s, una vez por sesión */

  /* WhatsApp de MARCA para la landing B2B (dueños de club). Es el mismo
     número del club fundador, pero se declara una sola vez aquí: la landing
     no carga manifest, así que no puede leerlo de window.__ELEVA__. */
  var B2B_PHONE = '34659143103';

  /* ────────────────────────────────────────────────────────────────
     ALMACENAMIENTO TOLERANTE A FALLOS
     En ventana privada / con cookies bloqueadas, localStorage y
     sessionStorage LANZAN (SecurityError) al leer o escribir. Sin este
     envoltorio, el i18n entero y el formulario de contacto se caían.
  ──────────────────────────────────────────────────────────────── */
  function getStoredLang() {
    try {
      var v = window.localStorage.getItem(LANG_KEY);
      return v || DEFAULT_LANG;
    } catch (e) { return DEFAULT_LANG; }
  }
  function setStoredLang(lang) {
    try { window.localStorage.setItem(LANG_KEY, lang); } catch (e) { /* no-op */ }
  }
  function sessionGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function sessionSet(key, val) {
    try { window.sessionStorage.setItem(key, val); } catch (e) { /* no-op */ }
  }

  /* Avisos de diagnóstico sin inundar la consola */
  var warned = {};
  function warnOnce(msg) {
    if (warned[msg]) return;
    warned[msg] = true;
    console.warn('[Eleva] ' + msg);
  }

  /* Número finito real (no acepta 0 "falsy" como ausente, ni NaN/strings) */
  function finiteNum(v) {
    return (typeof v === 'number' && isFinite(v)) ? v : null;
  }

  /* ────────────────────────────────────────────────────────────────
     I18N — capa de resolución con OVERRIDES POR CLUB
     Un manifest puede definir window.__ELEVA__.i18n = { es:{}, en:{}, nl:{} }
     con las mismas claves (planas o anidadas) que las traducciones globales.
     Orden: override del club en ese idioma → global en ese idioma →
            override del club en ES → global ES → fallback.
  ──────────────────────────────────────────────────────────────── */
  var currentLang = DEFAULT_LANG;

  function clubI18n() {
    var d = window.__ELEVA__;
    return (d && d.i18n) || null;
  }

  /* Solo propiedades PROPIAS: con un valor manipulado en localStorage
     ('toString', '__proto__'…) g[l] devolvía algo del prototipo y la
     página acababa con <html lang="toString">. */
  function hasOwn(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
  function hasLang(l) {
    if (typeof l !== 'string') return false;
    var g = window.__ELEVA_I18N__ || {};
    var c = clubI18n();
    return !!((hasOwn(g, l) && g[l]) || (hasOwn(c, l) && c[l]));
  }

  /* tr(clave [, idioma] [, fallback]) */
  function tr(key, lang, fallback) {
    var g = window.__ELEVA_I18N__ || {};
    var c = clubI18n();
    var l = lang || currentLang;
    var sources = [ c && c[l], g[l], c && c[DEFAULT_LANG], g[DEFAULT_LANG] ];
    for (var i = 0; i < sources.length; i++) {
      if (!sources[i]) continue;
      var v = resolveKey(sources[i], key);
      if (v !== undefined) return v;
    }
    return fallback;
  }

  /* Teléfono parametrizado desde el manifest (brand.phoneRegex / phoneDisplayPrefix)
     para soportar clubes internacionales (ES, NL, …) sin hardcodear +34. */
  function phoneRegexOf(brand) {
    try { return (brand && brand.phoneRegex) ? new RegExp(brand.phoneRegex) : null; }
    catch (e) { return null; }
  }

  function formatDisplayPhone(brand, phone) {
    if (!phone) return (brand && brand.phone) || '';
    var prefixStr = (brand && brand.phoneDisplayPrefix) || ('+' + phone);
    var cc  = prefixStr.replace(/\D/g, '');                       /* dígitos del prefijo país */
    var nat = (cc && phone.indexOf(cc) === 0) ? phone.slice(cc.length) : phone;
    if (nat.length === 9) {                                       /* agrupación tipo ES: 3·2·2·2 */
      return prefixStr + ' ' + nat.slice(0, 3) + ' ' + nat.slice(3, 5) + ' ' + nat.slice(5, 7) + ' ' + nat.slice(7);
    }
    return prefixStr + ' ' + nat;
  }

  /* ────────────────────────────────────────────────────────────────
     SPLASH — una sola vez por sesión de navegador y ~1s.
     · Ya vista  → html.splash-seen lo antes posible (CSS lo pone a
       display:none) + .hidden, y no se monta la animación.
     · Primera vez → se programa el ocultado ANTES de cualquier otra
       operación, así nada puede dejar la página tapada para siempre.
  ──────────────────────────────────────────────────────────────── */
  var splashSeen = sessionGet(SPLASH_KEY) === '1';

  /* Lo más temprano posible dentro de este archivo (se ejecuta al cargar
     el script, no en DOMContentLoaded). Lo ideal sería un <script> inline
     en <head>; ver informe. */
  if (splashSeen && document.documentElement) {
    document.documentElement.classList.add('splash-seen');
  }

  function initSplash() {
    var splash = document.getElementById('splash');
    if (!splash) return;

    /* Ya vista en esta sesión: fuera sin animación (doble red: clase en
       <html> para el CSS nuevo + .hidden para el CSS actual) */
    if (splashSeen) {
      document.documentElement.classList.add('splash-seen');
      splash.classList.add('hidden');
      return;
    }

    /* 1) Programar el ocultado PRIMERO: si algo falla después, la página
          nunca se queda cubierta. */
    setTimeout(function () {
      splash.classList.add('hidden');
    }, SPLASH_MS);

    /* 2) Registrar como vista ya (no en el timeout) */
    sessionSet(SPLASH_KEY, '1');

    /* 3) Longitud real del triángulo SVG para el trazado */
    var path = splash.querySelector('.triangle-path');
    if (path && path.getTotalLength) {
      var len = path.getTotalLength();
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
    }
  }

  /* ────────────────────────────────────────────────────────────────
     CURSOR PERSONALIZADO
  ──────────────────────────────────────────────────────────────── */
  /* Elemento de etiqueta del cursor + último [data-cursor] bajo el puntero:
     permite refrescar la etiqueta ya visible al cambiar de idioma. */
  var cursorLabelEl = null;
  var cursorHoverEl = null;

  function initCursor() {
    /* Sin cursor propio → el CSS NO debe aplicar cursor:none. La clase se
       añade sólo si el cursor personalizado arranca de verdad, así un fallo
       de JS ya no deja al usuario sin puntero del sistema. */
    var root = document.documentElement;
    root.classList.remove('has-custom-cursor');

    if (isTouch()) {
      document.body.classList.add('touch-device');
      return;
    }

    var cursor = document.getElementById('cursor');
    if (!cursor) return;

    var dot   = cursor.querySelector('.cursor-dot');
    var ring  = cursor.querySelector('.cursor-ring');
    var label = cursor.querySelector('.cursor-label');
    if (!dot || !ring || !label) return;
    cursorLabelEl = label;

    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var rafId = null;

    /* Oculto hasta el primer movimiento real: antes el anillo aparecía
       quieto en el centro de la pantalla hasta que se movía el ratón. */
    cursor.style.opacity = '0';
    var cursorShown = false;

    document.addEventListener('mousemove', function (e) {
      if (!cursorShown) {
        cursorShown = true;
        rx = e.clientX; ry = e.clientY;          /* sin arrastre desde el centro */
        cursor.style.opacity = '';
      }
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    }, { passive: true });

    function tick() {
      rx = lerp(rx, mx, 0.14);
      ry = lerp(ry, my, 0.14);
      ring.style.left  = rx + 'px';
      ring.style.top   = ry + 'px';
      /* Label sigue al anillo: 34px a la derecha del centro del ring */
      label.style.left = (rx + 34) + 'px';
      label.style.top  = (ry - 6)  + 'px';
      rafId = requestAnimationFrame(tick);
    }

    /* rafId sí se usa: el bucle se pausa cuando la pestaña no está visible
       y se reanuda al volver (antes se asignaba y nunca se cancelaba). */
    function startLoop() { if (rafId === null) rafId = requestAnimationFrame(tick); }
    function stopLoop()  { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopLoop(); else startLoop();
    });
    startLoop();

    /* A partir de aquí el cursor personalizado está operativo */
    root.classList.add('has-custom-cursor');

    /* Cambio de label contextual */
    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-cursor]');
      if (el) {
        cursorHoverEl = el;
        label.textContent = el.dataset.cursor;
        cursor.classList.add('has-label');
      }
      if (e.target.closest('a, button')) {
        cursor.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', function (e) {
      /* Solo retira la etiqueta al salir realmente de un elemento con
         data-cursor (no al moverse entre sus hijos ni al salir de otros). */
      var fromCursor = e.target.closest('[data-cursor]');
      if (fromCursor && (!e.relatedTarget || e.relatedTarget.closest('[data-cursor]') !== fromCursor)) {
        cursor.classList.remove('has-label');
        if (cursorHoverEl === fromCursor) cursorHoverEl = null;
      }
      if (e.target.closest('a, button') && (!e.relatedTarget || !e.relatedTarget.closest('a, button'))) {
        cursor.classList.remove('is-hovering');
      }
    });
  }

  /* ────────────────────────────────────────────────────────────────
     NAVEGACIÓN — scrolled state + burger menu
  ──────────────────────────────────────────────────────────────── */
  function initNav() {
    var nav     = document.getElementById('main-nav');
    var burger  = nav ? nav.querySelector('.nav-burger') : null;
    var overlay = document.getElementById('nav-overlay');

    if (!nav) return;

    /* Scroll state — throttled vía rAF (coherente con initHero/initPools) */
    var scrolled = false;
    var navTicking = false;
    window.addEventListener('scroll', function () {
      if (navTicking) return;
      navTicking = true;
      requestAnimationFrame(function () {
        var now = window.scrollY > 60;
        if (now !== scrolled) {
          scrolled = now;
          nav.classList.toggle('nav-scrolled', now);
        }
        navTicking = false;
      });
    }, { passive: true });

    /* Burger menu */
    if (burger && overlay) {
      function burgerLabel(key, fallback) {
        return tr(key, null, fallback);
      }

      /* Sólo tocamos display en línea si el CSS cerrado lo necesita
         (CSS antiguo: .nav-overlay{display:none}). Con el CSS nuevo
         (visibility:hidden) no se toca nada. */
      var displayForced = false;
      var hideTimer = null;

      function setClosedState() {
        /* inert: saca del orden de tabulación y del árbol de accesibilidad
           TODO el contenido del overlay, incluso si el CSS lo deja pintado
           con opacity:0 (antes los enlaces seguían siendo focusables). */
        overlay.setAttribute('inert', '');
        overlay.setAttribute('aria-hidden', 'true');
      }

      function setOpenState() {
        overlay.removeAttribute('inert');
        overlay.removeAttribute('aria-hidden');
      }

      /* Estado inicial coherente en carga */
      setClosedState();

      function closeOverlay() {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        overlay.classList.remove('is-open');
        burger.classList.remove('is-open');
        nav.classList.remove('nav-menu-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', burgerLabel('nav.menuOpen', 'Abrir menú'));
        document.body.style.overflow = '';
        setClosedState();
        burger.focus();
        hideTimer = setTimeout(function () {
          hideTimer = null;
          /* Devolver el control al CSS tras el fundido */
          if (displayForced) { overlay.style.display = ''; displayForced = false; }
        }, 320);
      }

      function openOverlay() {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        setOpenState();
        /* Si el CSS lo mantiene en display:none, forzamos flex; si el CSS
           ya usa visibility:hidden, no se toca el display. */
        if (window.getComputedStyle(overlay).display === 'none') {
          overlay.style.display = 'flex';
          displayForced = true;
        }
        requestAnimationFrame(function () {
          overlay.classList.add('is-open');
          var firstFocusable = overlay.querySelector('a, button');
          if (firstFocusable) firstFocusable.focus();
        });
        burger.classList.add('is-open');
        nav.classList.add('nav-menu-open');     /* barra opaca sobre el menú */
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', burgerLabel('nav.menuClose', 'Cerrar menú'));
        document.body.style.overflow = 'hidden';
      }

      /* Focus trap: el ciclo incluye el BURGER, que vive en #main-nav (fuera
         del overlay) y es el botón de cerrar. Sin él, con aria-modal="true"
         no había forma de cerrar el menú con teclado.
         El listener va en document (no en overlay) porque cuando el foco
         está en el burger el evento no pasa por el overlay. */
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !overlay.classList.contains('is-open')) return;
        /* El burger va PRIMERO: en el DOM está antes del overlay, así el
           ciclo queda cerrado (último enlace → Tab → burger → Tab → primero). */
        var focusable = [burger].concat(
          $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', overlay)
            .filter(function (el) { return el.offsetParent !== null || el === document.activeElement; })
        );
        if (focusable.length < 2) return;
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      });

      burger.addEventListener('click', function () {
        if (overlay.classList.contains('is-open')) {
          closeOverlay();
        } else {
          openOverlay();
        }
      });

      /* Cierra al pulsar un link del overlay */
      overlay.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeOverlay);
      });

      /* Cierra con Escape */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
          closeOverlay();
        }
      });

      /* Cierra al pasar a escritorio (girar la tablet, agrandar la ventana):
         el burger desaparece por encima de 1024px y el menú se quedaba
         abierto a pantalla completa sin ningún botón para cerrarlo. */
      var burgerMQ = window.matchMedia('(max-width: 1024px)');
      var onBurgerMQ = function (e) {
        if (!e.matches && overlay.classList.contains('is-open')) closeOverlay();
      };
      if (burgerMQ.addEventListener) burgerMQ.addEventListener('change', onBurgerMQ);
      else if (burgerMQ.addListener) burgerMQ.addListener(onBurgerMQ);
    }
  }

  /* ────────────────────────────────────────────────────────────────
     FAB — oculto mientras se ve el hero (que ya tiene el mismo CTA) y
     cuando el pie está en pantalla: ahí tapaba botones del hero, el
     enlace legal y los datos de contacto.
  ──────────────────────────────────────────────────────────────── */
  function initFab() {
    var fab = $('.fab-triangle');
    if (!fab || !('IntersectionObserver' in window)) return;
    var zones = [document.getElementById('hero'), document.getElementById('contacto'),
                 document.querySelector('footer')].filter(Boolean);
    if (!zones.length) return;
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id || en.target.tagName] = en.isIntersecting; });
      var hide = Object.keys(visible).some(function (k) { return visible[k]; });
      fab.classList.toggle('is-hidden', hide);
      /* Oculto = fuera del orden de tabulación */
      var a = fab.querySelector('a');
      if (a) { if (hide) a.setAttribute('tabindex', '-1'); else a.removeAttribute('tabindex'); }
    }, { threshold: 0 });
    zones.forEach(function (z) { io.observe(z); });
  }

  /* ────────────────────────────────────────────────────────────────
     HERO — parallax muy sutil en el background
  ──────────────────────────────────────────────────────────────── */
  function initHero() {
    var heroBg = $('.hero-bg');
    if (!heroBg || isTouch()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var heroEl = document.getElementById('hero');
    if (!heroEl) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var scrollY = window.scrollY;
        var heroH   = heroEl.offsetHeight;
        if (scrollY > heroH) return;
        var pct = scrollY / heroH;
        heroBg.style.transform = 'scale(1.04) translateY(' + (pct * 30) + 'px)';
      });
    }, { passive: true });
  }

  /* ────────────────────────────────────────────────────────────────
     MODO RESPONSIVE RE-INICIALIZABLE
     El modo (desktop pin+scrub ⇄ móvil/táctil snap) se decidía UNA vez en
     la carga: girar una tablet o cruzar 768/1024 dejaba el pinning de GSAP
     y el layout descuadrados. Cada init crea un "ctx" con:
       · un AbortController para TODOS sus listeners (cero fugas),
       · la lista de tweens GSAP creados (para matarlos con su ScrollTrigger),
       · funciones de limpieza de estilos en línea y nodos generados.
     Al cambiar de modo se destruye el ctx y se vuelve a montar.
  ──────────────────────────────────────────────────────────────── */
  var CAN_REINIT = (typeof AbortController === 'function');

  function newCtx() {
    var ac = CAN_REINIT ? new AbortController() : null;
    return {
      opts:    ac ? { passive: true, signal: ac.signal } : { passive: true },
      abort:   function () { if (ac) { try { ac.abort(); } catch (e) { /* no-op */ } } },
      tweens:  [],
      cleanup: []
    };
  }

  function killCtx(ctx) {
    if (!ctx) return;
    ctx.abort();
    ctx.tweens.forEach(function (tw) {
      try {
        if (tw && tw.scrollTrigger) tw.scrollTrigger.kill(true);  /* revierte el pin */
        if (tw && tw.kill) tw.kill();
      } catch (e) { /* no-op */ }
    });
    ctx.tweens.length = 0;
    ctx.cleanup.forEach(function (fn) { try { fn(); } catch (e) { /* no-op */ } });
    ctx.cleanup.length = 0;
  }

  function clearTransform(el) {
    if (!el) return;
    if (window.gsap) { try { gsap.set(el, { clearProps: 'all' }); return; } catch (e) { /* no-op */ } }
    el.style.transform = '';
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ────────────────────────────────────────────────────────────────
     SERVICIOS — scroll horizontal con GSAP en desktop
  ──────────────────────────────────────────────────────────────── */
  var servicesCtx = null;

  function initServices() {
    var sticky = document.getElementById('services-sticky');
    var track  = document.getElementById('services-track');
    var cards  = $$('.service-card');

    if (!sticky || !track || !cards.length) return;

    killCtx(servicesCtx);
    var ctx = servicesCtx = newCtx();
    /* Modo en la sección: .is-pinned (escritorio con GSAP) o .is-carousel
       (móvil/tablet táctil). Sin ninguna de las dos —sin JS, sin GSAP o con
       prefers-reduced-motion— el CSS apila las tarjetas en vertical y las
       cuatro se leen con el scroll normal (antes solo se veía la primera). */
    var section = sticky.closest('.section-services');
    ctx.cleanup.push(function () {
      sticky.style.position  = '';
      sticky.style.minHeight = '';
      clearTransform(track);
      if (section) section.classList.remove('is-pinned', 'is-carousel');
      var dots = document.querySelector('.services-dots');
      if (dots && dots.parentNode) dots.parentNode.removeChild(dots);
    });

    /* Snap = móvil (≤768) o tablet táctil (≤1024). En táctil el pin+scrub
       del scroll vertical para avanzar tarjetas es confuso, así que usamos
       el carrusel nativo con snap horizontal (coherente con la bobina). */
    var mobile = window.matchMedia('(max-width: 768px)').matches ||
                 (isTouch() && window.matchMedia('(max-width: 1024px)').matches);

    if (mobile) {
      if (section) section.classList.add('is-carousel');
      /* Crear dots de navegación */
      var dotsWrap = document.createElement('div');
      dotsWrap.className = 'services-dots';
      dotsWrap.setAttribute('aria-hidden', 'true');
      var dotEls = cards.map(function (_, i) {
        var d = document.createElement('span');
        d.className = 'services-dot' + (i === 0 ? ' is-active' : '');
        dotsWrap.appendChild(d);
        return d;
      });
      if (sticky.parentNode) sticky.parentNode.insertBefore(dotsWrap, sticky.nextSibling);

      /* Primer icono visible desde el inicio */
      if (cards[0]) cards[0].classList.add('icon-drawn');

      track.addEventListener('scroll', function () {
        var idx = Math.round(track.scrollLeft / track.clientWidth);
        cards.forEach(function (card, i) {
          if (i <= idx + 1 && !card.classList.contains('icon-drawn')) {
            card.classList.add('icon-drawn');
          }
        });
        dotEls.forEach(function (d, i) {
          d.classList.toggle('is-active', i === idx);
        });
      }, ctx.opts);
      return;
    }

    /* Desktop: GSAP horizontal scrub.
       prefers-reduced-motion se trata EXACTAMENTE igual que la ausencia de
       GSAP: el pin + scrub horizontal es movimiento disparado por scroll y
       no debe ejecutarse (antes se ignoraba la preferencia). */
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion()) {
      /* Fallback: tarjetas apiladas (CSS por defecto, sin clase de modo) */
      cards.forEach(function (c) { c.classList.add('icon-drawn'); });
      return;
    }

    if (section) section.classList.add('is-pinned');
    gsap.registerPlugin(ScrollTrigger);

    /* GSAP necesita position static aquí — él gestiona el fixed */
    sticky.style.position = 'static';

    /* Ancho REAL de la tarjeta (= 100vw, incluye la barra de scroll vertical).
       Medirlo evita la deriva acumulada frente a window.innerWidth, que la
       excluye y descuadraba las tarjetas en navegadores con scrollbar clásica. */
    var getTotalW = function () {
      var cardW = cards[0] ? cards[0].getBoundingClientRect().width : window.innerWidth;
      return (cards.length - 1) * cardW;
    };

    ctx.tweens.push(gsap.to(track, {
      x: function () { return -getTotalW(); },
      ease: 'none',
      scrollTrigger: {
        trigger: sticky,
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: function () { return '+=' + getTotalW(); },
        scrub: 1.2,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var prog = self.progress * (cards.length - 1);
          cards.forEach(function (card, i) {
            if (prog >= i - 0.35 && !card.classList.contains('icon-drawn')) {
              card.classList.add('icon-drawn');
            }
          });
        }
      }
    }));

  }

  /* ────────────────────────────────────────────────────────────────
     REVEALS — IntersectionObserver en todos los [data-reveal]
               + timeout 10s de seguridad
  ──────────────────────────────────────────────────────────────── */
  function initReveals() {
    /* .academy-card se excluye: las controla initGSAPExtras (GSAP) para una
       entrada más expresiva, evitando que ambas lógicas las animen. */
    var els = $$('[data-reveal]:not(.academy-card)');
    if (!els.length) return;

    /* 0. prefers-reduced-motion: mismo camino que "sin IntersectionObserver".
          Nada se oculta ni se desplaza 32px — el contenido aparece ya visible
          (antes la preferencia se ignoraba por completo). */
    if (prefersReducedMotion()) {
      els.forEach(function (el) {
        el.style.opacity   = '';
        el.style.transform = '';
        el.style.transition = '';
      });
      return;
    }

    /* 1. Ocultar inicialmente vía JS (no CSS) para no romper sin JS */
    els.forEach(function (el) {
      var delay = parseInt(el.dataset.revealDelay || '0', 10);
      el.style.opacity   = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition =
        'opacity 0.75s cubic-bezier(0.16,1,0.3,1) ' + delay + 'ms, ' +
        'transform 0.75s cubic-bezier(0.16,1,0.3,1) ' + delay + 'ms';
    });

    /* 2. Safety timeout 10s — revela todo lo pendiente (cubre conexiones 3G lentas) */
    var safetyTimer = setTimeout(function () {
      els.forEach(function (el) {
        if (el.dataset.revealPending) reveal(el);
      });
    }, 10000);

    function reveal(el) {
      if (!el.dataset.revealPending) return;
      el.style.opacity   = '1';
      el.style.transform = 'none';
      delete el.dataset.revealPending;
    }

    /* 3. IntersectionObserver */
    if (!('IntersectionObserver' in window)) {
      clearTimeout(safetyTimer);
      els.forEach(reveal);
      return;
    }

    els.forEach(function (el) { el.dataset.revealPending = '1'; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ════════════════════════════════════════════════════════════════
     RENDER DESDE EL MANIFEST — data-driven (pools, equipo, sponsors,
     precios y enlaces). Todo lee de window.__ELEVA__. Si el manifest
     (o su sección) no está, cada función sale sin tocar el DOM (fallback).
     Se ejecutan ANTES de initServices/initPools (GSAP necesita el DOM ya
     construido) y ANTES de initI18n (para traducir los [data-i18n] nuevos).
  ════════════════════════════════════════════════════════════════ */

  var POOLS_ASSET_BASE = '../assets/pools/opt/';   /* relativo al documento del club */

  /* Escapado HTML completo (los cinco caracteres sensibles) para atributos y
     para texto. Antes attr() sólo escapaba " y text() sólo < >. */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  var attr = esc;
  var text = esc;

  /* Escapado para url("…") en CSS: comillas y barras invertidas */
  function cssUrl(v) {
    return String(v == null ? '' : v).replace(/[\\"]/g, '\\$&').replace(/[\r\n]/g, '');
  }

  /* POOLS — reconstruye #pools-track (medallones + picture avif/jpg) */
  function renderPools() {
    var data  = window.__ELEVA__;
    var track = document.getElementById('pools-track');
    if (!track) return;
    if (!data) return;                                     /* avisa checkManifest() */
    if (!Array.isArray(data.pools) || !data.pools.length) {
      warnOnce('renderPools: el manifest no define pools[] — la bobina queda vacía.');
      return;
    }

    var href = (data.brand && data.brand.whatsappCommunity) || '#';
    track.innerHTML = data.pools.map(function (p) {
      var img = p.img, cat = p.cat || 'masculina';
      var s = POOLS_ASSET_BASE + img;
      /* role="listitem" va en un envoltorio, NO en el <a>: así el lector de
         pantalla anuncia "enlace" (y la lista sigue teniendo ítems).
         El envoltorio no necesita CSS nuevo: display:flex + flex:0 0 auto le
         da exactamente el ancho que el flex-basis de .pool-card calcula. */
      return '' +
        '<div class="pool-item" role="listitem" style="display:flex;flex:0 0 auto;min-width:0">' +
        '<a class="pool-card" data-cat="' + attr(cat) + '" data-cursor="Apuntarme" ' +
          'href="' + attr(href) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="pool-medallion">' +
            '<span class="pool-medallion-aura" aria-hidden="true"></span>' +
            '<picture>' +
              '<source type="image/avif" srcset="' +
                s + '-240.avif 240w, ' + s + '-480.avif 480w, ' + s + '-720.avif 720w" ' +
                'sizes="(max-width:768px) 70vw, 340px">' +
              '<img class="pool-medallion-img" src="' + s + '-480.jpg" width="480" height="480" ' +
                'loading="lazy" decoding="async" alt="' + attr(p.alt) + '">' +
            '</picture>' +
          '</span>' +
          '<span class="pool-cta-line"><span data-i18n="pools.join">Apuntarme</span></span>' +
        '</a>' +
        '</div>';
    }).join('');
  }

  /* EQUIPO — reconstruye .team-grid. role/bio vía *Key (i18n) o texto plano */
  function renderTeam() {
    var data = window.__ELEVA__;
    var grid = document.querySelector('.team-grid');
    if (!grid) return;
    if (!data) return;                                     /* avisa checkManifest() */
    if (!Array.isArray(data.team) || !data.team.length) {
      warnOnce('renderTeam: el manifest no define team[] — la rejilla de equipo queda vacía.');
      return;
    }

    grid.innerHTML = data.team.map(function (m, i) {
      var delay     = i > 0 ? ' data-reveal-delay="' + (i * 120) + '"' : '';
      /* Con foto: fondo perezoso (data-bg, ver initLazyBackgrounds).
         Sin foto: monograma con la inicial — el rectángulo vacío de antes
         parecía una imagen que no había cargado. */
      var initial = String(m.name || '').trim().charAt(0).toUpperCase();
      var photo = m.photo
        ? '<div class="team-photo" aria-hidden="true" data-bg="' + attr(m.photo) + '"></div>'
        : '<div class="team-photo team-photo--empty" aria-hidden="true">' +
            '<span class="team-photo-initial">' + text(initial) + '</span></div>';
      var roleAttr = m.roleKey ? ' data-i18n="' + attr(m.roleKey) + '"' : '';
      var bioAttr  = m.bioKey  ? ' data-i18n="' + attr(m.bioKey)  + '"' : '';
      return '' +
        '<div class="team-card" data-reveal' + delay + '>' +
          '<div class="team-photo-wrap">' + photo + '</div>' +
          '<div class="team-info">' +
            '<h3 class="team-name">' + text(m.name) + '</h3>' +
            '<span class="team-role"' + roleAttr + '>' + text(m.role) + '</span>' +
            '<p class="team-bio"' + bioAttr + '>' + text(m.bio) + '</p>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  /* PATROCINADORES — reconstruye .sponsors-list (una fila por pista + "soon") */
  function renderSponsors() {
    var data = window.__ELEVA__;
    var list = document.querySelector('.sponsors-list');
    if (!list) return;
    if (!data) return;                                     /* avisa checkManifest() */
    if (!Array.isArray(data.sponsors) || !data.sponsors.length) {
      warnOnce('renderSponsors: el manifest no define sponsors[] — la lista queda vacía.');
      return;
    }

    list.innerHTML = data.sponsors.map(function (s, i) {
      var d = ' data-reveal-delay="' + (80 + i * 60) + '"';
      if (s.soon) {
        return '' +
          '<div class="sponsor-row sponsor-row--soon" role="listitem" data-reveal' + d + '>' +
            '<span class="sponsor-row-court" aria-hidden="true">· · ·</span>' +
            '<span class="sponsor-row-name" data-i18n="sponsors.soon">Próximamente</span>' +
            '<span class="sponsor-row-badge sponsor-row-badge--soon" data-i18n="sponsors.soonBadge">¿Tu empresa aquí?</span>' +
          '</div>';
      }
      var badgeAttr = s.badgeKey ? ' data-i18n="' + attr(s.badgeKey) + '"' : '';
      /* courtLabel: colaborador sin pista asignada (no se pinta "Pista …").
         Con pista: data-court permite retraducir la palabra "Pista"
         (label.court → Pista / Court / Baan) en cada cambio de idioma. */
      var courtCell = s.courtLabel
        ? '<span class="sponsor-row-court" aria-hidden="true">' + text(s.courtLabel) + '</span>'
        : '<span class="sponsor-row-court" data-court="' + attr(s.court) + '"></span>';
      return '' +
        '<div class="sponsor-row" role="listitem" data-reveal' + d + '>' +
          courtCell +
          '<span class="sponsor-row-name">' + text(s.name) + '</span>' +
          '<span class="sponsor-row-badge"' + badgeAttr + '>' + text(s.badge) + '</span>' +
        '</div>';
    }).join('');
  }

  /* PRECIOS — inyecta tarifas de pista (.service-rates) y academia
     (.academy-rates-grid). Los labels llevan data-i18n; los valores € son
     estáticos (números). applyLang() rellenará los labels tras el render. */
  function renderPricing() {
    var data = window.__ELEVA__;
    if (!data) return;                                     /* avisa checkManifest() */
    if (!data.pricing) {
      if ($('.service-rates') || $('.academy-rates-grid')) {
        warnOnce('renderPricing: el manifest no define pricing{} — las tarifas quedan como estén en el HTML.');
      }
      return;
    }
    var pr = data.pricing;

    var courtsEl = document.querySelector('.service-rates');
    if (courtsEl && Array.isArray(pr.courts) && pr.courts.length) {
      courtsEl.innerHTML = pr.courts.map(function (c) {
        var labelAttr = c.labelKey ? ' data-i18n="' + attr(c.labelKey) + '"' : '';
        return '<div><dt' + labelAttr + '>' + text(c.label) + '</dt><dd>' + text(c.price) + '</dd></div>';
      }).join('');
    }

    var gridEl = document.querySelector('.academy-rates-grid');
    if (gridEl && Array.isArray(pr.academy) && pr.academy.length) {
      gridEl.innerHTML = pr.academy.map(function (block) {
        var titleAttr = block.titleKey ? ' data-i18n="' + attr(block.titleKey) + '"' : '';
        var rows = (block.rows || []).map(function (r) {
          var labelAttr = r.labelKey ? ' data-i18n="' + attr(r.labelKey) + '"' : '';
          return '' +
            '<div class="academy-rate-row">' +
              '<span class="academy-rate-desc"' + labelAttr + '>' + text(r.label) + '</span>' +
              '<span class="academy-rate-price">' + text(r.value) +
                '<span class="academy-rate-unit"' + (r.unitKey ? ' data-i18n="' + attr(r.unitKey) + '"' : '') + '>' +
                  text(r.unitKey ? tr(r.unitKey, null, r.unit) : r.unit) +
                '</span>' +
              '</span>' +
            '</div>';
        }).join('');
        return '' +
          '<div class="academy-rate-block">' +
            '<h4 class="academy-rate-cat"' + titleAttr + '>' + text(block.title) + '</h4>' +
            rows +
          '</div>';
      }).join('');
    }
  }

  /* ENLACES — sustituye Vola / WhatsApp / Instagram / Maps por los del
     manifest (selección por dominio, robusta ante URLs placeholder en la
     plantilla). El tel se gestiona en initManifest. */
  function renderLinks() {
    var data = window.__ELEVA__;
    if (!data) return;                                     /* avisa checkManifest() */
    if (!data.brand) {
      warnOnce('renderLinks: el manifest no define brand{} — enlaces (Vola, WhatsApp, Maps, Instagram) sin sustituir.');
      return;
    }
    var b = data.brand;

    function setAll(selector, url) {
      if (!url) return;
      $$(selector).forEach(function (a) { a.setAttribute('href', url); });
    }
    setAll('a[href*="vola.plus"]', b.volaReservas);
    /* Enlaces cuyo TEXTO es la propia URL de reservas (ficha del club): el
       href cambiaba por sede pero el texto seguía mostrando la de Pizarra */
    if (b.volaReservas) {
      $$('a[href]').forEach(function (a) {
        if (a.children.length || a.getAttribute('href') !== b.volaReservas) return;
        if (/^\s*vola\.plus\//.test(a.textContent)) a.textContent = b.volaReservas.replace(/^https?:\/\//, '');
      });
    }
    setAll('a[href*="chat.whatsapp.com"]', b.whatsappCommunity);
    setAll('a[href*="maps.app.goo.gl"], a[href*="google.com/maps"], a[href*="maps.google"]', b.mapsUrl);

    if (b.instagram && b.instagram.url) {
      $$('a[href*="instagram.com"]').forEach(function (a) {
        a.setAttribute('href', b.instagram.url);
        /* Actualiza el @handle visible sólo si el enlace es texto puro */
        if (b.instagram.handle && !a.children.length) a.textContent = b.instagram.handle;
      });
    }
  }

  /* ────────────────────────────────────────────────────────────────
     MANIFEST — actualiza teléfono, dirección, mapa y galería
  ──────────────────────────────────────────────────────────────── */
  function initManifest() {
    var data = window.__ELEVA__;
    if (!data) { renderSchedule(); return; }               /* avisa checkManifest() */
    if (!data.brand) {
      warnOnce('initManifest: el manifest no define brand{} — teléfono, dirección, horario y mapa sin actualizar.');
      renderSchedule();
      return;
    }

    var brand = data.brand;
    var phone = (brand.phone || '').toString().replace(/\D/g, '');

    /* Teléfono (formato/validación parametrizados desde el manifest) */
    var telHref = phone ? 'tel:+' + phone : '#';
    var displayPhone = formatDisplayPhone(brand, phone);
    $$('[id^="link-phone"], [id^="footer-link-phone"]').forEach(function (el) {
      el.href        = telHref;
      el.textContent = displayPhone;
    });

    /* Dirección */
    var infoAddr = document.getElementById('info-address');
    if (infoAddr && brand.address) {
      infoAddr.textContent = brand.address;
    }

    /* Horario del club (brand.schedule) — antes se ignoraba y el horario
       salía de una traducción global, así que TODO club mostraría el de
       Pizarra. Se re-aplica también al final de applyLang(). */
    renderSchedule();

    initMap(brand);
    initGalleryLazy(data);
  }

  /* ── MAPA (footer) ───────────────────────────────────────────────
     Plano ESTÁTICO autoalojado (brand.mapImage, un SVG generado una vez con
     clubs/_plantilla/generar-mapa.js a partir de datos de OpenStreetMap).
     Sustituye a Leaflet + teselas de CARTO: CARTO empezó a exigir clave y
     cada tesela salía como "API KEY REQUIRED". Ahora no hay terceros en
     ejecución, ni librería de 160 KB, ni teselas que puedan caerse.
     El plano entero es un enlace a Google Maps (brand.mapsUrl).
     Atribución obligatoria por la licencia ODbL de OpenStreetMap. */
  function initMap(brand) {
    var mapEl = document.getElementById('footer-map');
    if (!mapEl || mapEl.getAttribute('data-map') === 'ready') return;
    if (!brand.mapImage) {
      warnOnce('initMap: el manifest no define brand.mapImage — se mantiene el enlace de "cómo llegar".');
      return;
    }
    var href = brand.mapsUrl || (mapEl.querySelector('a') || {}).href || '#';
    mapEl.innerHTML =
      '<a class="footer-map-link" href="' + attr(href) + '" target="_blank" rel="noopener noreferrer" ' +
         'data-cursor="ver" data-i18n-arialabel="footer.mapAria" aria-label="' +
         attr(tr('footer.mapAria', null, 'Ver la ubicación del club en Google Maps')) + '">' +
        '<img class="footer-map-img" src="' + attr(brand.mapImage) + '" alt="" ' +
             'width="1200" height="480" loading="lazy" decoding="async">' +
      '</a>' +
      '<span class="footer-map-attrib">© <a href="https://www.openstreetmap.org/copyright" ' +
        'target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors</span>';
    mapEl.setAttribute('data-map', 'ready');
  }

  /* ── FONDOS PEREZOSOS — [data-bg] (fotos del equipo, collage del club)
     Un background CSS no admite loading="lazy": se asigna cuando el
     elemento se acerca a la pantalla (antes se descargaban ~270 KB de
     fotos fuera de pantalla en la carga inicial). */
  var bgIO = null;
  function applyBg(el) {
    var src = el.getAttribute('data-bg');
    if (!src) return;
    el.removeAttribute('data-bg');
    el.style.backgroundImage = 'url("' + cssUrl(src) + '")';
  }
  function initLazyBackgrounds() {
    var els = $$('[data-bg]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(applyBg); return; }
    if (!bgIO) {
      bgIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          bgIO.unobserve(en.target);
          applyBg(en.target);
        });
      }, { rootMargin: '600px 0px' });
    }
    els.forEach(function (el) { bgIO.observe(el); });
  }

  /* ── GALERÍA — carga PEREZOSA (antes: todas las fotos con
        new Image() en la carga, antes de que nada fuera visible) ─── */
  function initGalleryLazy(data) {
    if (!data || !Array.isArray(data.gallery) || !data.gallery.length) return;
    var els = $$('.gallery-img');
    if (!els.length) return;

    var loading = {};
    function load(idx) {                 /* idx 1-based (clase .gi-N) */
      if (loading[idx]) return;
      loading[idx] = true;
      var src = data.gallery[idx - 1];
      if (!src) return;
      var img = new Image();
      img.onload = function () {
        $$('.gi-' + idx).forEach(function (div) {
          /* background shorthand sobreescribe los gradientes CSS */
          div.style.background = 'url("' + cssUrl(src) + '") center/cover no-repeat';
        });
      };
      img.src = src;
    }
    function indexOf(el) {
      var m = el.className.match(/gi-(\d+)/);
      return m ? parseInt(m[1], 10) : null;
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { var i = indexOf(el); if (i) load(i); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var i = indexOf(en.target);
        if (i) load(i);
      });
    }, { rootMargin: '400px 0px' });     /* margen amplio: llega cargada al viewport */

    els.forEach(function (el) { io.observe(el); });
  }

  /* ── GALERÍA — botón pausar/reanudar (WCAG 2.2.2: contenido que se
        mueve solo durante más de 5 s necesita un control para pararlo) ── */
  function initGalleryToggle() {
    var btn   = $('.gallery-toggle');
    var lanes = $('.gallery-lanes');
    if (!btn || !lanes) return;
    function sync() {
      var paused = lanes.classList.contains('is-paused');
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('data-i18n', paused ? 'gallery.play' : 'gallery.pause');
      btn.textContent = tr(paused ? 'gallery.play' : 'gallery.pause', null, paused ? 'Reanudar' : 'Pausar');
    }
    btn.addEventListener('click', function () {
      lanes.classList.toggle('is-paused');
      sync();
    });
    sync();
  }

  /* ── HORARIO — orden: i18n del club (club.scheduleValue en el idioma
        activo) → brand.schedule (sin traducir) → traducción global ── */
  function renderSchedule() {
    var el = document.getElementById('info-schedule');
    if (!el) return;
    var d = window.__ELEVA__;

    /* 1) Override i18n del club para el idioma activo: es lo único que da el
          horario de ESTE club Y traducido (lo añade su manifest). */
    var c = clubI18n();
    var over;
    if (c && c[currentLang]) over = resolveKey(c[currentLang], 'club.scheduleValue');
    if (over !== undefined) { el.textContent = over; return; }

    /* 2) brand.schedule del manifest (cadena única, sin traducir) */
    var s = d && d.brand && d.brand.schedule;
    if (s) { el.textContent = s; return; }

    /* 3) Traducción global (valor neutro tipo "Consultar horario") */
    var v = tr('club.scheduleValue');
    if (v !== undefined) el.textContent = v;
  }

  /* ────────────────────────────────────────────────────────────────
     FORMULARIO DE CONTACTO — abre WhatsApp con los datos
  ──────────────────────────────────────────────────────────────── */
  function initContact() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    /* El botón llega disabled en el HTML (sin JS no debe enviarse nada) */
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = false;

    /* Validación con mensajes en el IDIOMA DE LA PÁGINA (las burbujas
       nativas salen en el idioma del navegador) y sin aceptar campos con
       solo espacios, que antes pasaban el `required` sin ningún aviso. */
    var PHONE_OK = /^[0-9 +()\-]{6,20}$/;
    function fieldError(el) {
      var v = (el.value || '').trim();
      if (el.required && !v) return tr(el.tagName === 'SELECT' ? 'contact.errLevel' : 'contact.errRequired', null, 'Rellena este campo.');
      if (el.name === 'telefono' && v && (!PHONE_OK.test(v) || v.replace(/\D/g, '').length < 6)) {
        return tr('contact.errPhone', null, 'Escribe un teléfono válido.');
      }
      return '';
    }
    $$('input, select, textarea', form).forEach(function (el) {
      el.addEventListener('input',  function () { el.setCustomValidity(''); });
      el.addEventListener('change', function () { el.setCustomValidity(''); });
      el.addEventListener('invalid', function () {
        var msg = fieldError(el);
        if (msg) el.setCustomValidity(msg);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Primer campo con error: mensaje traducido + foco */
      var fields = $$('#f-nombre, #f-telefono, #f-nivel', form);
      for (var f = 0; f < fields.length; f++) {
        var err = fieldError(fields[f]);
        if (err) {
          fields[f].setCustomValidity(err);
          if (fields[f].reportValidity) fields[f].reportValidity(); else fields[f].focus();
          return;
        }
      }

      var data  = window.__ELEVA__;
      var phone = ((data && data.brand && data.brand.phone) || '').toString().replace(/\D/g, '');

      var nombre   = (form.querySelector('[name="nombre"]').value   || '').trim();
      var telefono = (form.querySelector('[name="telefono"]').value  || '').trim();
      var nivelEl  = form.querySelector('[name="nivel"]');
      var nivel    = ((nivelEl && nivelEl.value) || '').trim();
      var mensaje  = (form.querySelector('[name="mensaje"]').value   || '').trim();

      /* El <option> tiene value en español ("Intermedio") y un token neutro
         en data-level. El mensaje se envía en el IDIOMA ACTIVO: primero por
         la clave i18n del token, y si no, por el texto visible del <option>
         (que applyLang ya ha traducido). */
      var LEVEL_KEYS = {
        beginner:     'contact.levelBeginner',
        intermediate: 'contact.levelIntermediate',
        advanced:     'contact.levelAdvanced',
        competition:  'contact.levelCompetition'
      };
      var opt = null;
      if (nivelEl) {
        opt = (nivelEl.selectedOptions && nivelEl.selectedOptions[0]) ||
              (nivelEl.options && nivelEl.selectedIndex >= 0 ? nivelEl.options[nivelEl.selectedIndex] : null);
      }
      var token    = opt ? opt.getAttribute('data-level') : null;
      var byKey    = (token && LEVEL_KEYS[token]) ? tr(LEVEL_KEYS[token]) : undefined;
      var nivelTxt = (byKey !== undefined ? byKey : (opt && opt.textContent) || nivel).toString().trim();

      /* Validar que el teléfono del club esté configurado antes de abrir WhatsApp.
         La regex se parametriza desde el manifest (brand.phoneRegex) para
         soportar clubes internacionales; fallback genérico E.164 si falta. */
      var phoneRegex = phoneRegexOf((data && data.brand)) || /^\d{6,15}$/;
      if (!phone || !phoneRegex.test(phone)) {
        console.error('[Eleva] Teléfono no configurado/ inválido en manifest.js');
        /* El visitante también lo ve: antes el botón no hacía nada */
        var notice = document.getElementById('club-data-notice');
        if (notice) { notice.hidden = false; notice.scrollIntoView({ block: 'center' }); }
        return;
      }

      /* Etiquetas del mensaje: las del formulario (contact.labelMessage es
         "Mensaje"; el "(opcional)" vive en su propia clave) */
      var msg =
        tr('wa.contact', null, 'Hola, me interesa información sobre la academia de Eleva Padel Club.') + '\n\n' +
        tr('contact.labelName',  null, 'Nombre')   + ': ' + nombre   + '\n' +
        tr('contact.labelPhone', null, 'Teléfono') + ': ' + telefono + '\n' +
        tr('contact.labelLevel', null, 'Nivel')    + ': ' + nivelTxt;
      if (mensaje) {
        msg += '\n' + tr('contact.labelMessage', null, 'Mensaje') + ': ' + mensaje;
      }

      /* window.open con 'noopener' devuelve SIEMPRE null (no sirve para
         detectar un bloqueo) y no lanza: se abre la pestaña con un enlace
         temporal con rel=noopener, que los navegadores no bloquean al venir
         de un clic del usuario. */
      var url = waURL(phone, msg);
      var link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  /* ────────────────────────────────────────────────────────────────
     SMOOTH SCROLL — anclas internas (refuerzo cross-browser)
  ──────────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var navEl = document.getElementById('main-nav');
      var navH  = (navEl && navEl.offsetHeight) || 80;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });

      /* Mover el FOCO al destino: sin esto el "saltar al contenido" y las
         anclas del menú sólo desplazaban la vista, y el teclado seguía en
         la cabecera (el lector de pantalla no se enteraba del salto). */
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      try { target.focus({ preventScroll: true }); }
      catch (err) { target.focus(); }
    });
  }

  /* ────────────────────────────────────────────────────────────────
     GSAP EXTRAS — efectos adicionales que no interfieren con initReveals
  ──────────────────────────────────────────────────────────────── */
  function initGSAPExtras() {
    if (!window.gsap || !window.ScrollTrigger) return;
    /* prefers-reduced-motion: no se oculta ni se desplaza nada. Antes las
       .academy-card se quedaban en opacity:0 + translateY(40px) esperando a
       un ScrollTrigger que la preferencia del usuario pide no ejecutar. */
    if (prefersReducedMotion()) return;

    /* Academy cards: entrada más expresiva con GSAP. Se excluyen de
       initReveals (selector :not(.academy-card)) para evitar doble animación. */
    var acCards = $$('.academy-card');
    if (acCards.length) {
      acCards.forEach(function (card) {
        card.style.transition = 'none';
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
      });
      gsap.to(acCards, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.academy-grid', start: 'top 80%' }
      });
    }
  }

  /* ────────────────────────────────────────────────────────────────
     CLUB COLLAGE — rotación sutil al entrar en viewport
  ──────────────────────────────────────────────────────────────── */
  function initCollage() {
    if (!('IntersectionObserver' in window)) return;

    var collage = $('.club-collage');
    if (!collage) return;

    var photos = $$('.club-photo', collage);
    var rots   = ['-2.5deg', '1.8deg', '-0.8deg'];

    photos.forEach(function (p, i) {
      p.style.transform = 'rotate(' + rots[i] + ') translateY(30px)';
      p.style.opacity   = '0';
      p.style.transition = 'opacity 0.8s ease ' + (i * 130) + 'ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ' + (i * 130) + 'ms';
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        photos.forEach(function (p, i) {
          p.style.transform = 'rotate(' + rots[i] + ') translateY(0)';
          p.style.opacity   = '1';
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    obs.observe(collage);
  }

  /* ────────────────────────────────────────────────────────────────
     AURORA BACKGROUND — reacciona suavemente al mouse
  ──────────────────────────────────────────────────────────────── */
  function initAurora() {
    if (isTouch()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var orb = document.createElement('div');
    orb.className = 'aurora-orb';
    orb.style.cssText = 'width:600px;height:400px;background:radial-gradient(ellipse,rgba(196,168,130,0.07) 0%,transparent 70%);';
    document.body.appendChild(orb);

    setTimeout(function () { orb.style.opacity = '1'; }, 300);

    document.addEventListener('mousemove', function (e) {
      /* translate en lugar de left/top: corre en el compositor, sin layout */
      orb.style.transform = 'translate(' + (e.clientX - 300) + 'px,' + (e.clientY - 200) + 'px)';
    }, { passive: true });
  }

  /* ────────────────────────────────────────────────────────────────
     I18N — motor de traducción ES / EN / NL
  ──────────────────────────────────────────────────────────────── */
  /* Resuelve "a.b.c" tanto en objetos anidados ({a:{b:{c:…}}}) como en
     objetos planos ({'a.b.c': …}), para que un manifest pueda declarar sus
     overrides de la forma que le resulte más cómoda. */
  function resolveKey(obj, path) {
    if (obj == null) return undefined;
    if (Object.prototype.hasOwnProperty.call(obj, path)) return obj[path];
    return path.split('.').reduce(function (o, k) {
      return (o != null && o[k] !== undefined) ? o[k] : undefined;
    }, obj);
  }

  /* Etiquetas del cursor contextual: la palabra en español del HTML actúa
     como identificador Y como fallback si la clave no existe todavía. */
  var CURSOR_KEY_BY_DEFAULT = {
    'reservar':      'cursor.book',
    'ver':           'cursor.view',
    'apuntarme':     'cursor.signup',
    'próximamente':  'cursor.soon',
    /* Extras: si el agente de contenido no crea la clave, se queda la
       palabra original (degradación limpia, sin claves crudas). */
    'llamar':        'cursor.call',
    'mirar':         'cursor.look',
    'enviar':        'cursor.send',
    'leer':          'cursor.read',
    'unirse':        'cursor.join',
    'volver':        'cursor.back'
  };

  function applyCursorLabels() {
    $$('[data-cursor]').forEach(function (el) {
      /* Primera pasada: memoriza la palabra original del HTML/render */
      if (!el.dataset.cursorDefault) el.dataset.cursorDefault = el.dataset.cursor || '';
      var def = el.dataset.cursorDefault;
      var key = CURSOR_KEY_BY_DEFAULT[def.toLowerCase()];
      if (!key) return;                        /* sin clave: se deja tal cual */
      el.dataset.cursor = tr(key, null, def);
    });
    /* Refresca la etiqueta que ya está a la vista (el mouseover no se vuelve
       a disparar si el puntero no sale y entra otra vez). */
    if (cursorLabelEl && cursorHoverEl && cursorHoverEl.isConnected) {
      cursorLabelEl.textContent = cursorHoverEl.dataset.cursor || '';
    }
  }

  /* Pista de swipe de la bobina: {n} ← número REAL de pools (antes 9 fijo) */
  function applySwipeHint() {
    var el = $('.pools-swipe-label');
    if (!el) return;
    var raw = tr('pools.swipe');
    if (raw === undefined) return;
    var n = $$('.pool-card').length;
    if (!n) {
      var d = window.__ELEVA__;
      n = (d && Array.isArray(d.pools)) ? d.pools.length : 0;
    }
    el.textContent = String(raw).replace(/\{n\}/g, String(n));
  }

  /* Celdas "Pista N" de patrocinadores: palabra traducible + aria-label */
  function applyCourtLabels() {
    var cells = $$('.sponsor-row-court[data-court]');
    if (!cells.length) return;
    var word = tr('label.court', null, 'Pista');
    cells.forEach(function (el) {
      var n = el.getAttribute('data-court') || '';
      /* Sin aria-label: no está permitido en un <span> genérico y el
         texto visible ("Pista 01") ya es lo que lee el lector de pantalla. */
      el.innerHTML = text(word) + ' <em>' + text(n) + '</em>';
    });
  }

  function applyLang(lang) {
    if (!hasLang(lang)) lang = DEFAULT_LANG;
    if (!hasLang(lang)) {
      warnOnce('applyLang: no hay traducciones cargadas (window.__ELEVA_I18N__). ¿Falla js/translations.js?');
      return;
    }
    currentLang = lang;

    /* El idioma NO se guarda aquí: solo cuando el usuario lo elige con un
       .lang-btn (initI18n). Así localStorage solo contiene una preferencia
       expresada por el usuario, como describe privacidad.html. */
    document.documentElement.setAttribute('lang', lang);

    /* Texto plano */
    $$('[data-i18n]').forEach(function (el) {
      var val = tr(el.getAttribute('data-i18n'), lang);
      if (val !== undefined) el.textContent = val;
    });

    /* Contenido HTML (headings con <br>/<em>, CTA notes).
       innerHTML DELIBERADO: las cadenas son propias del sitio. */
    $$('[data-i18n-html]').forEach(function (el) {
      var val = tr(el.getAttribute('data-i18n-html'), lang);
      if (val !== undefined) el.innerHTML = val;
    });

    /* Placeholders de inputs y textareas */
    $$('[data-i18n-ph]').forEach(function (el) {
      var val = tr(el.getAttribute('data-i18n-ph'), lang);
      if (val !== undefined) el.setAttribute('placeholder', val);
    });

    /* aria-label */
    $$('[data-i18n-arialabel]').forEach(function (el) {
      var val = tr(el.getAttribute('data-i18n-arialabel'), lang);
      if (val !== undefined) el.setAttribute('aria-label', val);
    });

    /* Burger: actualiza su aria-label según estado actual del menú */
    var burger = document.querySelector('.nav-burger');
    if (burger) {
      var isOpen = burger.classList.contains('is-open');
      var burgerVal = tr(isOpen ? 'nav.menuClose' : 'nav.menuOpen', lang);
      if (burgerVal !== undefined) burger.setAttribute('aria-label', burgerVal);
    }

    /* Estado activo del switcher */
    $$('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    /* WA hrefs — actualiza según idioma */
    var eleva = window.__ELEVA__;
    if (eleva && eleva.brand && eleva.brand.phone) {
      var phone = eleva.brand.phone.toString().replace(/\D/g, '');
      var btnAcad   = document.getElementById('btn-academia-card');
      var btnPrueba = document.getElementById('btn-prueba');
      var btnPool   = document.getElementById('btn-pool');
      var btnEvent  = document.getElementById('btn-event');
      if (btnAcad)   btnAcad.href   = waURL(phone, tr('wa.academia', lang, 'Hola, me interesa consultar plazas de la academia de Eleva Padel Club.'));
      if (btnPrueba) btnPrueba.href = waURL(phone, tr('wa.prueba',   lang, 'Hola, me gustaría información sobre las clases de la academia de Eleva Padel Club.'));
      if (btnPool)   btnPool.href   = waURL(phone, tr('wa.pool',     lang, '¡Hola! Me gustaría apuntarme al próximo pool de Eleva Padel Club 🎾'));
      if (btnEvent)  btnEvent.href  = waURL(phone, tr('wa.event',    lang, 'Hola, me gustaría información para reservar Eleva Padel Club para un evento privado.'));
    }

    /* LANDING B2B — todos los CTA .js-wa-b2b apuntan al WhatsApp de marca
       con mensaje de dueño de club, traducido (teléfono: B2B_PHONE). */
    var b2b = $$('.js-wa-b2b');
    if (b2b.length) {
      var b2bUrl = waURL(B2B_PHONE, tr('home.waB2B', lang,
        'Hola, tengo un club/academia de pádel y me gustaría saber más sobre unirme a Eleva Pádel.'));
      b2b.forEach(function (a) { a.setAttribute('href', b2bUrl); });
    }

    /* Etiquetas del cursor contextual + pista de swipe con el nº real
       + palabra "Pista" de los patrocinadores */
    applyCursorLabels();
    applySwipeHint();
    applyCourtLabels();

    /* AL FINAL: el horario del manifest gana sobre cualquier data-i18n,
       independientemente del orden de los atributos en el HTML. */
    renderSchedule();
  }

  function initI18n() {
    applyLang(getStoredLang());                /* nunca lanza (ventana privada) */

    $$('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var l = btn.getAttribute('data-lang');
        if (!hasLang(l)) return;
        applyLang(l);
        setStoredLang(l);                      /* nunca lanza (ventana privada) */
      });
    });
  }

  /* ────────────────────────────────────────────────────────────────
     TEAM CARDS — tilt 3D con cursor tracking + spring-back
  ──────────────────────────────────────────────────────────────── */
  function initTeamCards() {
    if (isTouch()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    $$('.team-card').forEach(function (card) {
      var live = false;

      card.addEventListener('mouseenter', function () {
        live = true;
        card.style.willChange  = 'transform';
        card.style.transition  = '';
      });

      card.addEventListener('mousemove', function (e) {
        if (!live) return;
        var r  = card.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
        var dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
        card.style.transform =
          'perspective(700px) rotateX(' + (-dy * 7) + 'deg) rotateY(' + (dx * 10) + 'deg) translateZ(14px)';
      });

      card.addEventListener('mouseleave', function () {
        live = false;
        card.style.transition  = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform   = '';
        card.style.willChange  = 'auto';
      });
    });
  }

  /* ────────────────────────────────────────────────────────────────
     POOLS — "La Bobina": carrusel cinematográfico de medallones.
     Desktop: pin + scrub horizontal (GSAP) con profundidad de campo.
     Móvil: scroll-snap nativo. Sin GSAP / reduced-motion: rejilla estática.
     Cursor: tilt 3D + magnético por medallón. Aura de fondo por género.
  ──────────────────────────────────────────────────────────────── */
  var poolsCtx = null;

  function initPools() {
    var reel  = document.getElementById('pools-reel');
    var track = document.getElementById('pools-track');
    if (!reel || !track) return;

    var cards = $$('.pool-card', track);
    if (!cards.length) return;

    killCtx(poolsCtx);
    var ctx = poolsCtx = newCtx();
    ctx.cleanup.push(function () {
      ['height', 'overflowX', 'overflowY', 'scrollSnapType'].forEach(function (p) { reel.style[p] = ''; });
      reel.style.removeProperty('--reel-accent');
      clearTransform(track);
      cards.forEach(function (c) {
        ['transform', 'opacity', 'filter', 'zIndex', 'transition', 'scrollSnapAlign'].forEach(function (p) {
          c.style[p] = '';
        });
        var med = c.querySelector('.pool-medallion');
        if (med) { med.style.transform = ''; med.style.transition = ''; }
      });
    });

    if (prefersReducedMotion()) return;

    /* "snap" = móvil (≤768) y también tablet táctil (≤1024): el pin+scrub
       con el dedo es incómodo, así que en cualquier táctil hasta 1024 usamos
       el carrusel con scroll-snap nativo. El pin+scrub queda sólo para
       puntero fino en pantallas grandes (desktop). */
    var snap = window.matchMedia('(max-width: 768px)').matches ||
               (isTouch() && window.matchMedia('(max-width: 1024px)').matches);

    /* El color de acento de cada categoría vive en UNA sola fuente de verdad:
       css/main.css → .pool-card[data-cat=…]{ --pool-accent } . Aquí lo leemos
       de la tarjeta central en vez de duplicar el mapa de colores en JS. */
    function accentOf(card) {
      var c = getComputedStyle(card).getPropertyValue('--pool-accent').trim();
      return c || '#C4A882';
    }

    /* Foco: escala / opacidad / desenfoque según distancia al centro del viewport.
       Lee todos los rects primero y escribe después (un solo reflow por frame). */
    function applyFocus() {
      var vw = window.innerWidth;
      var cx = vw / 2;
      var rects = cards.map(function (c) { return c.getBoundingClientRect(); });
      var bestDist = Infinity, bestCard = cards[0];
      for (var i = 0; i < cards.length; i++) {
        var r = rects[i];
        var dist = Math.abs((r.left + r.width / 2) - cx);
        var t = Math.min(dist / (vw * 0.5), 1);          /* 0 = centro, 1 = borde */
        var scale = lerp(1, 0.78, t);
        var op    = lerp(1, 0.40, t);
        var blur  = (t * t * 3).toFixed(2);
        var sat   = lerp(1, 0.65, t).toFixed(2);
        cards[i].style.transform = 'scale(' + scale.toFixed(3) + ')';
        cards[i].style.opacity   = op.toFixed(3);
        cards[i].style.filter    = 'blur(' + blur + 'px) saturate(' + sat + ')';
        cards[i].style.zIndex    = String(Math.round((1 - t) * 100));
        if (dist < bestDist) { bestDist = dist; bestCard = cards[i]; }
      }
      reel.style.setProperty('--reel-accent', accentOf(bestCard));
    }

    /* Cursor: tilt 3D + arrastre magnético del medallón (solo puntero fino) */
    if (!isTouch()) {
      cards.forEach(function (card) {
        var med = card.querySelector('.pool-medallion');
        if (!med) return;
        var live = false;
        card.addEventListener('mouseenter', function () {
          live = true;
          med.style.transition = 'transform .15s var(--ease-out)';
        }, ctx.opts);
        card.addEventListener('mousemove', function (e) {
          if (!live) return;
          var r  = med.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
          var dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
          med.style.transform =
            'perspective(800px) rotateX(' + (-dy * 9) + 'deg) rotateY(' + (dx * 12) + 'deg) ' +
            'translate(' + (dx * 10) + 'px,' + (dy * 10) + 'px) translateZ(24px)';
        }, ctx.opts);
        card.addEventListener('mouseleave', function () {
          live = false;
          med.style.transition = 'transform .7s var(--ease-out)';
          med.style.transform  = '';
        }, ctx.opts);
      });
    }

    /* Móvil / tablet táctil: scroll-snap nativo + foco al hacer scroll.
       Forzamos el modo snap por JS además del CSS porque en tablet táctil
       (769–1024) el CSS de @media(max-width:768px) no aplica. */
    if (snap) {
      reel.style.height = 'auto';
      reel.style.overflowX = 'auto';
      reel.style.overflowY = 'hidden';
      reel.style.scrollSnapType = 'x mandatory';
      cards.forEach(function (c) { c.style.scrollSnapAlign = 'center'; });
      var ticking = false;
      var swipeHint = document.getElementById('pools-swipe');
      applyFocus();
      reel.addEventListener('scroll', function () {
        /* Tras el primer deslizamiento real, retiramos la pista de swipe:
           ya ha cumplido su función de incitar al gesto. */
        if (swipeHint && reel.scrollLeft > 8) {
          swipeHint.classList.add('is-hidden');
        }
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { applyFocus(); ticking = false; });
      }, ctx.opts);
      window.addEventListener('resize', applyFocus, ctx.opts);
      return;
    }

    /* Desktop sin GSAP: fallback scroll-snap horizontal */
    if (!window.gsap || !window.ScrollTrigger) {
      reel.style.overflowX = 'auto';
      reel.style.scrollSnapType = 'x mandatory';
      cards.forEach(function (c) {
        c.style.scrollSnapAlign = 'center';
        c.style.transition = 'transform .45s var(--ease-out), opacity .45s, filter .45s';
      });
      applyFocus();
      reel.addEventListener('scroll', function () { requestAnimationFrame(applyFocus); }, ctx.opts);
      return;
    }

    /* Desktop: pin + scrub horizontal */
    gsap.registerPlugin(ScrollTrigger);
    cards.forEach(function (c) { c.style.transition = 'none'; });  /* scrub: sin transición */

    /* Distancia = lo justo para CENTRAR la última insignia en el viewport.
       Se calcula con offsetLeft/offsetWidth (fiables) en vez de track.scrollWidth,
       que en contenedores flex con scroll NO cuenta el padding derecho y dejaba
       el recorrido corto (la última pool no llegaba al centro). */
    var getDistance = function () {
      var last = cards[cards.length - 1];
      /* clientWidth (no innerWidth): excluye la barra de scroll, igual que
         offsetLeft/offsetWidth y que el padding CSS calc(50vw - …), para que
         el último medallón quede centrado con exactitud. */
      var vw = document.documentElement.clientWidth;
      return Math.max(0, last.offsetLeft + last.offsetWidth / 2 - vw / 2);
    };

    /* Un único tramo 1:1 (sin "hold" final): el recorrido es igual de suave
       al principio (primera insignia) que al final (Rocha), sin zona muerta. */
    var reelTween = gsap.to(track, {
      x: function () { return -getDistance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: reel,
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: function () { return '+=' + getDistance(); },
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: applyFocus
      }
    });
    ctx.tweens.push(reelTween);
    applyFocus();

    /* Teclado: al tabular a una insignia, desplazar el scroll hasta el punto
       del pin en que queda CENTRADA. Antes el foco caía en medallones casi
       fuera de pantalla (10–14 % visibles), además desenfocados. */
    cards.forEach(function (card) {
      card.addEventListener('focusin', function () {
        var st = reelTween.scrollTrigger;
        if (!st) return;
        var vw = document.documentElement.clientWidth;
        var target = Math.min(getDistance(), Math.max(0, card.offsetLeft + card.offsetWidth / 2 - vw / 2));
        var dist = getDistance() || 1;
        var y = st.start + (st.end - st.start) * (target / dist);
        window.scrollTo(0, Math.round(y));
      }, ctx.opts);
    });
  }

  /* ────────────────────────────────────────────────────────────────
     SERVICIOS HERO SECTION — height nativa vs GSAP
  ──────────────────────────────────────────────────────────────── */
  function fixServicesHeight() {
    /* En desktop sin GSAP: altura mínima visible */
    var mobile = window.matchMedia('(max-width: 768px)').matches;
    if (mobile) return;
    if (!window.gsap) {
      var sticky = document.getElementById('services-sticky');
      if (sticky) sticky.style.minHeight = '100dvh';
    }
  }

  /* ────────────────────────────────────────────────────────────────
     LANDING B2B (raíz /)  ·  solo si body.home-landing
     - Render data-driven de la red de sedes (array escalable).
     - Botones magnéticos (puntero fino).
     - Contadores animados de cifras.
     Guardado por la clase del body; en /pizarra y /clubs no hace nada.
  ──────────────────────────────────────────────────────────────── */

  /* Fuente de verdad de las sedes. Añadir aquí para escalar la red. */
  var HOME_CLUBS = [
    {
      name: 'Eleva Padel Club',
      city: 'Pizarra · Málaga',
      url: 'pizarra/index.html',
      img: 'assets/img/club-01.jpg',
      status: 'live'          /* i18n: home.network.statusLive */
    }
    /* Próximas sedes: { name, city, url, img, status:'soon' } */
  ];

  function renderNetwork() {
    var grid = document.getElementById('network-grid');
    if (!grid) return;

    var cards = HOME_CLUBS.map(function (c) {
      var isLive   = c.status === 'live';
      var statusEl = isLive
        ? '<span class="home-club-status" data-i18n="home.network.statusLive">Primera sede</span>'
        : '<span class="home-club-status home-club-status--soon" data-i18n="home.network.statusSoon">Próximamente</span>';
      var media = c.img ? ' data-bg="' + attr(c.img) + '"' : '';   /* perezoso: initLazyBackgrounds */
      var linkTxt = isLive
        ? '<span class="home-club-link"><span data-i18n="home.network.visit">Ver sede</span> →</span>'
        : '';
      var tag = (isLive && c.url) ? 'a' : 'div';
      var href = (isLive && c.url) ? ' href="' + attr(c.url) + '" data-cursor="ver"' : '';
      /* role="listitem" en el envoltorio; el <a> conserva su rol de enlace.
         display:grid en el envoltorio = la tarjeta sigue estirándose a la
         altura de la fila igual que cuando era el hijo directo del grid. */
      return '' +
        '<div class="home-club-item" role="listitem" style="display:grid">' +
        '<' + tag + ' class="home-club"' + href + '>' +
          '<span class="home-club-media" aria-hidden="true"' + media + '>' + statusEl + '</span>' +
          '<span class="home-club-body">' +
            '<span class="home-club-name">' + text(c.name) + '</span>' +
            '<span class="home-club-city">' + text(c.city) + '</span>' +
            linkTxt +
          '</span>' +
        '</' + tag + '>' +
        '</div>';
    }).join('');

    /* Tarjeta invitación "tu club aquí" — siempre al final, escala visualmente */
    cards += '' +
      '<div class="home-club-item" role="listitem" style="display:grid">' +
      '<a class="home-club home-club--cta js-wa-b2b" ' +
         'href="' + attr('https://wa.me/' + B2B_PHONE) + '" target="_blank" rel="noopener noreferrer" data-cursor="WhatsApp">' +
        '<svg class="home-club-tri" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<path d="M50 10 L14 74 L21 74 L50 23 L79 74 L86 74 Z M14 86 H86 V92 H14 Z"/>' +
        '</svg>' +
        '<span class="home-club-name" data-i18n="home.network.ctaTitle">Tu club aquí</span>' +
        '<span class="home-club-link"><span data-i18n="home.network.ctaLink">Hablar con nosotros</span> →</span>' +
      '</a>' +
      '</div>';

    grid.innerHTML = cards;
  }

  /* HERO landing · rotador cinético de palabras + parallax de constelación.
     Guardado por body.home-landing (no-op en /pizarra y /clubs). */
  function initLandingHero() {
    if (!document.body.classList.contains('home-landing')) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Rotador "Eleva tu ___": cicla la palabra activa. La versión accesible
       vive en el aria-label del <h1>; estos spans son aria-hidden. En
       reduced-motion se queda fijo en la primera palabra. */
    var rots = $$('.home-hero2-rotator .home-rot');
    if (rots.length > 1 && !reduce) {
      var idx = 0;
      setInterval(function () {
        rots[idx].classList.remove('is-active');
        idx = (idx + 1) % rots.length;
        rots[idx].classList.add('is-active');
      }, 2600);
    }

    /* Parallax sutil de la constelación siguiendo el puntero (solo desktop) */
    var net  = $('.home-net');
    var hero = document.getElementById('hero');
    if (net && hero && !isTouch() && !reduce) {
      hero.addEventListener('mousemove', function (e) {
        var r  = hero.getBoundingClientRect();
        var dx = (e.clientX - r.width  / 2) / r.width;
        var dy = (e.clientY - r.height / 2) / r.height;
        net.style.transform = 'translate(' + (dx * 26) + 'px,' + (dy * 26) + 'px)';
      }, { passive: true });
    }
  }

  function initLanding() {
    if (!document.body.classList.contains('home-landing')) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Botones magnéticos (solo puntero fino, sin reduced-motion) */
    if (!isTouch() && !reduce) {
      $$('.home-landing .btn').forEach(function (btn) {
        var strength = 18;
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
          var dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
          btn.style.transform = 'translate(' + (dx * strength) + 'px,' + (dy * strength) + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
          btn.style.transition = 'transform .5s var(--ease-out)';
          btn.style.transform  = '';
          setTimeout(function () { btn.style.transition = ''; }, 500);
        });
        btn.addEventListener('mouseenter', function () { btn.style.transition = ''; });
      });
    }

    /* Contadores animados de cifras (una vez, al entrar en viewport) */
    var nums = $$('.home-stat-num[data-count]');
    if (nums.length) {
      var animateCount = function (el) {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var raw    = el.getAttribute('data-raw') === '1';   /* años: sin separador */
        /* Los años (data-raw) no se animan: contar de 0 a 2026 quedaba raro */
        if (reduce || raw) { el.textContent = raw ? String(target) : target.toLocaleString('es-ES'); return; }
        var dur = 1200, start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.round(eased * target);
          el.textContent = raw ? String(val) : val.toLocaleString('es-ES');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      nums.forEach(function (el) { obs.observe(el); });
    }
  }

  /* ────────────────────────────────────────────────────────────────
     DIAGNÓSTICO — manifest ausente
     Antes, sin manifest, TODOS los renderers salían en silencio: la página
     de un club quedaba vacía con la consola limpia. Un único aviso claro.
  ──────────────────────────────────────────────────────────────── */
  function checkManifest() {
    if (window.__ELEVA__) { checkManifestSlug(); return; }
    var needed = ['#pools-track', '.team-grid', '.sponsors-list', '.academy-rates-grid', '#footer-map'];
    var found  = needed.filter(function (sel) { return !!$(sel); });
    if (!found.length) return;          /* la landing no espera manifest */
    console.warn('[Eleva] manifest ausente: window.__ELEVA__ no está definido, pero esta página tiene contenedores de club (' +
      found.join(', ') + '). Pools, equipo, patrocinadores, tarifas y mapa quedarán vacíos. ' +
      'Comprueba que el <script src="…/manifest.js"> carga (ruta correcta y sin 404) antes de js/main.js.');
    /* Aviso VISIBLE para el visitante (el mismo que ve quien navega sin JS):
       sin él, la página salía sin tarifas ni pools y sin ninguna explicación. */
    var notice = document.getElementById('club-data-notice');
    if (notice) notice.hidden = false;
  }

  /* Manifest de OTRA sede: al copiar /pizarra para crear /marbella es fácil
     dejar <script src="../pizarra/manifest.js">. La página se pinta entera
     con los datos de Pizarra y sin ningún error: se avisa en consola. */
  function checkManifestSlug() {
    var tag = $('script[src*="manifest.js"]');
    if (!tag) return;
    var m = (tag.getAttribute('src') || '').match(/([^\/.]+)\/manifest\.js/);
    var parts = location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '').split('/');
    var pageSlug = parts[parts.length - 1];
    if (m && pageSlug && m[1] !== pageSlug) {
      console.warn('[Eleva] Esta página es /' + pageSlug + ' pero carga el manifest de "' + m[1] +
        '" (' + tag.getAttribute('src') + '). Cambia el <script> a ../' + pageSlug + '/manifest.js.');
    }
  }

  /* ────────────────────────────────────────────────────────────────
     WATCHER DE MODO — reacciona a cruzar 768/1024 o girar la tablet
  ──────────────────────────────────────────────────────────────── */
  function modeSignature() {
    var m768  = window.matchMedia('(max-width: 768px)').matches;
    var m1024 = window.matchMedia('(max-width: 1024px)').matches;
    var snap  = m768 || (isTouch() && m1024);
    return (m768 ? 'm' : 'd') + (snap ? 's' : 'p') + (prefersReducedMotion() ? 'r' : '-');
  }

  function initModeWatcher() {
    var mqs = [
      window.matchMedia('(max-width: 768px)'),
      window.matchMedia('(max-width: 1024px)'),
      window.matchMedia('(prefers-reduced-motion: reduce)')
    ];
    var last  = modeSignature();
    var timer = null;

    function onChange() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        var sig = modeSignature();
        if (sig !== last && CAN_REINIT) {
          last = sig;
          /* Re-montaje controlado: killCtx() aborta los listeners del modo
             anterior, mata sus ScrollTriggers (revirtiendo el pin) y limpia
             los estilos en línea. Sin fugas y sin doble inicialización. */
          safe(initServices, 'services (re-init)');
          safe(initPools,    'pools (re-init)');
          safe(fixServicesHeight, 'servicesHeight (re-init)');
        }
        if (window.ScrollTrigger && window.ScrollTrigger.refresh) {
          try { window.ScrollTrigger.refresh(); } catch (e) { /* no-op */ }
        }
      }, 200);
    }

    /* Listeners añadidos UNA sola vez (no se acumulan) */
    mqs.forEach(function (mq) {
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener)  mq.addListener(onChange);     /* Safari < 14 */
    });
  }

  /* ────────────────────────────────────────────────────────────────
     INIT — llama todo en orden seguro
  ──────────────────────────────────────────────────────────────── */
  function init() {
    safe(checkManifest,     'checkManifest');
    safe(initSplash,        'splash');
    safe(initCursor,        'cursor');
    safe(initNav,           'nav');
    safe(initFab,           'fab');
    safe(initHero,          'hero');
    safe(initAurora,        'aurora');
    safe(initCollage,       'collage');
    /* 1) Render data-driven desde el manifest (construye el DOM de las listas) */
    safe(renderPricing,     'renderPricing');
    safe(renderTeam,        'renderTeam');
    safe(renderSponsors,    'renderSponsors');
    safe(renderPools,       'renderPools');
    safe(renderLinks,       'renderLinks');
    safe(renderNetwork,     'renderNetwork'); /* landing: red de sedes (no-op fuera de la landing) */
    /* 2) Módulos que dependen del DOM ya renderizado */
    safe(initReveals,       'reveals');       /* observa los [data-reveal] nuevos */
    safe(initServices,      'services');
    safe(initManifest,      'manifest');
    safe(initLazyBackgrounds, 'lazyBackgrounds'); /* equipo + collage: tras renderTeam */
    safe(initContact,       'contact');
    safe(initGalleryToggle, 'galleryToggle');
    safe(initTeamCards,     'teamCards');
    safe(initPools,         'pools');
    safe(initLandingHero,   'landingHero');    /* landing: rotador hero + parallax constelación */
    safe(initLanding,       'landing');        /* landing: magnético + contadores (no-op fuera) */
    safe(initI18n,          'i18n');           /* traduce los [data-i18n] nuevos */
    safe(initSmoothScroll,  'smoothScroll');
    safe(fixServicesHeight, 'servicesHeight');
    /* GSAP extras al final, no bloquea nada */
    safe(initGSAPExtras,    'gsapExtras');
    /* Re-inicializa services/pools al cambiar de modo (768/1024, rotación) */
    safe(initModeWatcher,   'modeWatcher');
  }

  /* Lanzar cuando el DOM está listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
