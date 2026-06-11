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
     SPLASH  — CSS es la red de seguridad primaria (4.5s).
              JS la esconde a los 4s por si acaso.
  ──────────────────────────────────────────────────────────────── */
  function initSplash() {
    var splash = document.getElementById('splash');
    if (!splash) return;

    /* Calcula la longitud real del triángulo SVG */
    var path = splash.querySelector('.triangle-path');
    if (path && path.getTotalLength) {
      var len = path.getTotalLength();
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
    }

    /* Backup JS: esconde a los 4s */
    setTimeout(function () {
      splash.classList.add('hidden');
    }, 4000);
  }

  /* ────────────────────────────────────────────────────────────────
     CURSOR PERSONALIZADO
  ──────────────────────────────────────────────────────────────── */
  function initCursor() {
    if (isTouch()) {
      document.body.classList.add('touch-device');
      return;
    }

    var cursor = document.getElementById('cursor');
    if (!cursor) return;

    var dot   = cursor.querySelector('.cursor-dot');
    var ring  = cursor.querySelector('.cursor-ring');
    var label = cursor.querySelector('.cursor-label');

    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var rafId;

    document.addEventListener('mousemove', function (e) {
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
      /* Label sigue al anillo: 22px a la derecha del centro del ring */
      label.style.left = (rx + 22) + 'px';
      label.style.top  = (ry - 6)  + 'px';
      rafId = requestAnimationFrame(tick);
    }
    tick();

    /* Cambio de label contextual */
    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest('[data-cursor]');
      if (el) {
        label.textContent = el.dataset.cursor;
        cursor.classList.add('has-label');
      }
      if (e.target.closest('a, button')) {
        cursor.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (!e.target.closest('[data-cursor]') || !e.relatedTarget || !e.relatedTarget.closest('[data-cursor]')) {
        cursor.classList.remove('has-label');
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

    /* Scroll state */
    var scrolled = false;
    window.addEventListener('scroll', function () {
      var now = window.scrollY > 60;
      if (now !== scrolled) {
        scrolled = now;
        nav.classList.toggle('nav-scrolled', now);
      }
    }, { passive: true });

    /* Burger menu */
    if (burger && overlay) {
      function burgerLabel(key, fallback) {
        var lang = localStorage.getItem('eleva-lang') || 'es';
        var i18n = window.__ELEVA_I18N__;
        return (i18n && i18n[lang] && resolveKey(i18n[lang], key)) || fallback;
      }

      function closeOverlay() {
        overlay.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', burgerLabel('nav.menuOpen', 'Abrir menú'));
        document.body.style.overflow = '';
        burger.focus();
        setTimeout(function () {
          /* Siempre ocultar: evita que el overlay quede display:flex con opacity:0
             bloqueando invisiblemente todos los clicks de la página */
          overlay.style.display = 'none';
          overlay.setAttribute('aria-hidden', 'true');
        }, 320);
      }

      function openOverlay() {
        overlay.style.display = 'flex';
        overlay.removeAttribute('aria-hidden');
        requestAnimationFrame(function () {
          overlay.classList.add('is-open');
          var firstFocusable = overlay.querySelector('a, button');
          if (firstFocusable) firstFocusable.focus();
        });
        burger.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', burgerLabel('nav.menuClose', 'Cerrar menú'));
        document.body.style.overflow = 'hidden';
      }

      /* Focus trap inside overlay */
      overlay.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !overlay.classList.contains('is-open')) return;
        var focusable = overlay.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
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
    }
  }

  /* ────────────────────────────────────────────────────────────────
     HERO — parallax muy sutil en el background
  ──────────────────────────────────────────────────────────────── */
  function initHero() {
    var heroBg = $('.hero-bg');
    if (!heroBg || isTouch()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      var heroH   = document.getElementById('hero').offsetHeight;
      if (scrollY > heroH) return;
      var pct = scrollY / heroH;
      heroBg.style.transform = 'scale(1.04) translateY(' + (pct * 30) + 'px)';
    }, { passive: true });
  }

  /* ────────────────────────────────────────────────────────────────
     SERVICIOS — scroll horizontal con GSAP en desktop
  ──────────────────────────────────────────────────────────────── */
  function initServices() {
    var sticky = document.getElementById('services-sticky');
    var track  = document.getElementById('services-track');
    var cards  = $$('.service-card');

    if (!sticky || !track || !cards.length) return;

    var mobile = window.matchMedia('(max-width: 768px)').matches;

    if (mobile) {
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
        var idx = Math.round(track.scrollLeft / window.innerWidth);
        cards.forEach(function (card, i) {
          if (i <= idx + 1 && !card.classList.contains('icon-drawn')) {
            card.classList.add('icon-drawn');
          }
        });
        dotEls.forEach(function (d, i) {
          d.classList.toggle('is-active', i === idx);
        });
      }, { passive: true });
      return;
    }

    /* Desktop: GSAP horizontal scrub */
    if (!window.gsap || !window.ScrollTrigger) {
      /* Fallback sin GSAP: CSS snap horizontal */
      track.style.overflowX = 'scroll';
      track.style.scrollSnapType = 'x mandatory';
      cards.forEach(function (c) { c.style.scrollSnapAlign = 'start'; });
      if (cards[0]) cards[0].classList.add('icon-drawn');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* GSAP necesita position static aquí — él gestiona el fixed */
    sticky.style.position = 'static';

    var totalW = (cards.length - 1) * window.innerWidth;

    gsap.to(track, {
      x: -totalW,
      ease: 'none',
      scrollTrigger: {
        trigger: sticky,
        pin: true,
        pinSpacing: true,
        start: 'top top',
        end: '+=' + totalW,
        scrub: 1.2,
        onUpdate: function (self) {
          var prog = self.progress * (cards.length - 1);
          cards.forEach(function (card, i) {
            if (prog >= i - 0.35 && !card.classList.contains('icon-drawn')) {
              card.classList.add('icon-drawn');
            }
          });
        }
      }
    });

    /* Limpiar triggers al salir para evitar memory leaks */
    window.addEventListener('beforeunload', function () {
      if (window.ScrollTrigger) {
        ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
      }
    });
  }

  /* ────────────────────────────────────────────────────────────────
     REVEALS — IntersectionObserver en todos los [data-reveal]
               + timeout 6s de seguridad
  ──────────────────────────────────────────────────────────────── */
  function initReveals() {
    var els = $$('[data-reveal]');
    if (!els.length) return;

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

  /* ────────────────────────────────────────────────────────────────
     MANIFEST — actualiza el DOM con datos de lib/manifest.js
  ──────────────────────────────────────────────────────────────── */
  function initManifest() {
    var data = window.__ELEVA__;
    if (!data || !data.brand) return;

    var brand = data.brand;
    var phone = (brand.phone || '').toString().replace(/\D/g, '');

    /* Teléfono */
    var telHref = phone ? 'tel:+' + phone : '#';
    var displayPhone = (function () {
      if (!phone) return brand.phone;
      if (/^34\d{9}$/.test(phone)) {
        var n = phone.slice(2);
        return '+34 ' + n.slice(0,3) + ' ' + n.slice(3,5) + ' ' + n.slice(5,7) + ' ' + n.slice(7);
      }
      return '+' + phone;
    }());
    $$('[id^="link-phone"], [id^="footer-link-phone"]').forEach(function (el) {
      el.href        = telHref;
      el.textContent = displayPhone;
    });

    /* WhatsApp con mensajes específicos */
    /* Academia card CTA */
    var btnAcad = document.getElementById('btn-academia-card');
    if (btnAcad) {
      btnAcad.href = waURL(phone,
        'Hola, me interesa consultar plazas de la academia de Eleva Padel Club.');
    }

    /* Sesión de prueba CTA */
    var btnPrueba = document.getElementById('btn-prueba');
    if (btnPrueba) {
      btnPrueba.href = waURL(phone,
        'Hola, me interesa reservar una sesión de prueba de academia en Eleva Padel Club. ' +
        '1h · Grupos 3–4 personas · 10€/persona.');
    }

    /* Eventos privados CTA */
    var btnEventos = document.getElementById('btn-eventos');
    if (btnEventos && phone) {
      btnEventos.href = waURL(phone,
        'Hola, me gustaría información sobre la reserva del club para un evento privado.');
    }

    /* Dirección */
    var infoAddr = document.getElementById('info-address');
    if (infoAddr && brand.address) {
      infoAddr.textContent = brand.address;
    }

    /* Google Maps embed en footer */
    var mapEl = document.getElementById('footer-map');
    if (mapEl && brand.mapEmbed && brand.mapEmbed.length > 10) {
      var iframe = document.createElement('iframe');
      iframe.src           = brand.mapEmbed;
      iframe.style.cssText = 'width:100%;height:100%;border:0';
      iframe.loading       = 'lazy';
      iframe.allowFullscreen = true;
      iframe.setAttribute('aria-hidden', 'true');
      mapEl.innerHTML = '';
      mapEl.appendChild(iframe);
    }

    /* Gallery con fotos reales si las rutas existen */
    if (data.gallery && Array.isArray(data.gallery)) {
      var imgs = $$('.gallery-img');
      var seen = {};
      imgs.forEach(function (el) {
        var gi = el.className.match(/gi-(\d+)/);
        if (!gi) return;
        var idx = parseInt(gi[1], 10) - 1;
        var src = data.gallery[idx];
        if (src) {
          var key = src;
          if (!seen[key]) {
            seen[key] = true;
            var img = new Image();
            img.onload = function () {
              $$('.gi-' + (idx + 1)).forEach(function (div) {
                /* background shorthand sobreescribe los gradientes CSS */
                div.style.background = 'url(' + src + ') center/cover no-repeat';
              });
            };
            img.src = src;
          }
        }
      });
    }
  }

  /* ────────────────────────────────────────────────────────────────
     FORMULARIO DE CONTACTO — abre WhatsApp con los datos
  ──────────────────────────────────────────────────────────────── */
  function initContact() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data  = window.__ELEVA__;
      var phone = ((data && data.brand && data.brand.phone) || '').toString().replace(/\D/g, '');

      var nombre   = (form.querySelector('[name="nombre"]').value   || '').trim();
      var telefono = (form.querySelector('[name="telefono"]').value  || '').trim();
      var nivel    = (form.querySelector('[name="nivel"]').value     || '').trim();
      var mensaje  = (form.querySelector('[name="mensaje"]').value   || '').trim();

      /* Foco al primer campo vacío obligatorio */
      if (!nombre || !telefono || !nivel) {
        var requiredIds = ['f-nombre', 'f-telefono', 'f-nivel'];
        for (var i = 0; i < requiredIds.length; i++) {
          var fld = document.getElementById(requiredIds[i]);
          if (fld && !fld.value.trim()) { fld.focus(); break; }
        }
        return;
      }

      /* Validar que el teléfono del club esté configurado antes de abrir WhatsApp */
      var phoneRegex = /^34\d{9}$/;
      if (!phone || !phoneRegex.test(phone)) {
        console.error('[Eleva] Teléfono no configurado en manifest.js');
        return;
      }

      var text =
        'Hola, me interesa información sobre la academia de Eleva Padel Club.\n\n' +
        'Nombre: '   + nombre   + '\n' +
        'Teléfono: ' + telefono + '\n' +
        'Nivel: '    + nivel;
      if (mensaje) text += '\nMensaje: ' + mensaje;

      var url = waURL(phone, text);
      try { window.open(url, '_blank', 'noopener'); }
      catch (ex) { window.location.href = url; }
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
      var navH = document.getElementById('main-nav').offsetHeight || 80;
      var top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ────────────────────────────────────────────────────────────────
     GSAP EXTRAS — efectos adicionales que no interfieren con initReveals
  ──────────────────────────────────────────────────────────────── */
  function initGSAPExtras() {
    if (!window.gsap || !window.ScrollTrigger) return;

    /* Footer marquee: pequeño efecto parallax sutil */
    var footerMarquee = $('.footer-marquee');
    if (footerMarquee) {
      gsap.to(footerMarquee, {
        x: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '#footer',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    }

    /* Academy cards: entrada más expresiva (reemplaza initReveals para estos) */
    var acCards = $$('.academy-card');
    if (acCards.length) {
      acCards.forEach(function (card) {
        /* Anula el data-reveal para que GSAP tome el control */
        card.removeAttribute('data-reveal');
        delete card.dataset.revealPending;
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

    var style = document.createElement('style');
    style.textContent = '.aurora-orb{position:fixed;top:0;left:0;pointer-events:none;z-index:0;border-radius:50%;filter:blur(80px);opacity:0;transition:opacity 1.5s,transform 0.5s;will-change:transform;}';
    document.head.appendChild(style);

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
     POOL — actualiza CTAs con mensajes formateados por categoría
  ──────────────────────────────────────────────────────────────── */
  function initPools() {
    var data = window.__ELEVA__;
    if (!data || !data.brand || !data.pools) return;

    var phone = (data.brand.phone || '').toString().replace(/\D/g, '');
    var btn   = document.getElementById('btn-pool');
    if (btn && phone) {
      btn.href = waURL(phone,
        '¡Hola! Me gustaría apuntarme al próximo pool de Eleva Padel Club 🎾');
    }
  }

  /* ────────────────────────────────────────────────────────────────
     I18N — motor de traducción ES / EN / NL
  ──────────────────────────────────────────────────────────────── */
  function resolveKey(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o != null && o[k] !== undefined) ? o[k] : undefined;
    }, obj);
  }

  function applyLang(lang) {
    var i18n = window.__ELEVA_I18N__;
    if (!i18n || !i18n[lang]) return;
    var t = i18n[lang];

    localStorage.setItem('eleva-lang', lang);
    document.documentElement.setAttribute('lang', lang);

    /* Texto plano */
    $$('[data-i18n]').forEach(function (el) {
      var val = resolveKey(t, el.getAttribute('data-i18n'));
      if (val !== undefined) el.textContent = val;
    });

    /* Contenido HTML (headings con <br>/<em>, CTA notes) */
    $$('[data-i18n-html]').forEach(function (el) {
      var val = resolveKey(t, el.getAttribute('data-i18n-html'));
      if (val !== undefined) el.innerHTML = val;
    });

    /* Placeholders de inputs y textareas */
    $$('[data-i18n-ph]').forEach(function (el) {
      var val = resolveKey(t, el.getAttribute('data-i18n-ph'));
      if (val !== undefined) el.setAttribute('placeholder', val);
    });

    /* aria-label */
    $$('[data-i18n-arialabel]').forEach(function (el) {
      var val = resolveKey(t, el.getAttribute('data-i18n-arialabel'));
      if (val !== undefined) el.setAttribute('aria-label', val);
    });

    /* Burger: actualiza su aria-label según estado actual del menú */
    var burger = document.querySelector('.nav-burger');
    if (burger) {
      var isOpen = burger.classList.contains('is-open');
      var burgerKey = isOpen ? 'nav.menuClose' : 'nav.menuOpen';
      var burgerVal = resolveKey(t, burgerKey);
      if (burgerVal !== undefined) burger.setAttribute('aria-label', burgerVal);
    }

    /* Estado activo del switcher */
    $$('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function initI18n() {
    var saved = localStorage.getItem('eleva-lang') || 'es';
    applyLang(saved);

    $$('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
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
     SERVICIOS HERO SECTION — height nativa vs GSAP
  ──────────────────────────────────────────────────────────────── */
  function fixServicesHeight() {
    /* En desktop sin GSAP: altura mínima visible */
    var mobile = window.matchMedia('(max-width: 768px)').matches;
    if (mobile) return;
    if (!window.gsap) {
      var sticky = document.getElementById('services-sticky');
      if (sticky) sticky.style.minHeight = '100vh';
    }
  }

  /* ────────────────────────────────────────────────────────────────
     INIT — llama todo en orden seguro
  ──────────────────────────────────────────────────────────────── */
  function init() {
    safe(initSplash,        'splash');
    safe(initCursor,        'cursor');
    safe(initNav,           'nav');
    safe(initHero,          'hero');
    safe(initAurora,        'aurora');
    safe(initCollage,       'collage');
    safe(initReveals,       'reveals');
    safe(initServices,      'services');
    safe(initManifest,      'manifest');
    safe(initPools,         'pools');
    safe(initContact,       'contact');
    safe(initTeamCards,     'teamCards');
    safe(initI18n,          'i18n');
    safe(initSmoothScroll,  'smoothScroll');
    safe(fixServicesHeight, 'servicesHeight');
    /* GSAP extras al final, no bloquea nada */
    safe(initGSAPExtras,    'gsapExtras');
  }

  /* Lanzar cuando el DOM está listo */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
