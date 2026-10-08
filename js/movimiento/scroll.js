/* ================================================================
   Eleva Pádel — movimiento/scroll.js
   Todo lo que se mueve con el scroll, sin secuestrarlo (ni pin, ni
   inercia cambiada, ni saltos). Las animaciones están declaradas en
   css/movimiento.css (keyframes sd-*); este módulo:
   · prepara el DOM que necesitan: cifras de los precios y títulos de fila
     en piezas (con una copia legible para lectores de pantalla) y la
     posición de partida de cada insignia en el abanico (--dx, --dy, --rot,
     --z);
   · mueve el currentTime de esas animaciones con el scroll (solo lectura
     de posiciones y escritura de tiempos);
   · publica el progreso del hero (canal «hero», 0 → 1) para la cámara 3D,
     escala el telón del logo (--prof-escala-hero ^ progreso, desde el
     vértice: transform-origin del CSS) y desplaza el fondo del hero con un
     paralaje suave (solo transform). El progreso sale solo de scrollY y del
     alto de la ventana: no se mide nada de la maquetación, así que no
     depende de fuentes ni imágenes y se recalcula igual tras un cambio de
     tamaño, de densidad o la vuelta desde el bfcache;
   · enciende la luz LED de las tarjetas de clases una vez, al entrar en
     pantalla (IntersectionObserver).
   ================================================================ */
(function () {
  'use strict';
  var M = window.ElevaMov;
  if (!M) return;

  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ── Cifras de los precios en piezas (por palabras: nunca se parte una) ── */
  function prepararPiezas() {
    $$('.precio-cifra:not([data-cin])').forEach(function (el) {
      var texto = el.textContent;
      var legible = document.createElement('span');
      legible.className = 'vh';
      legible.textContent = texto;
      var cin = document.createElement('span');
      cin.className = 'cin';
      cin.setAttribute('aria-hidden', 'true');
      var k = 0;
      texto.split(/(\s+)/).forEach(function (trozo) {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) { cin.appendChild(document.createTextNode(' ')); k++; return; }
        var palabra = document.createElement('span');
        palabra.style.whiteSpace = 'nowrap';
        Array.from(trozo).forEach(function (c) {
          var s = document.createElement('span');
          s.textContent = c;
          s.style.setProperty('--k', String(k++));
          palabra.appendChild(s);
        });
        cin.appendChild(palabra);
      });
      el.textContent = '';
      el.appendChild(legible);
      el.appendChild(cin);
      el.setAttribute('data-cin', '');
    });
  }

  /* ── Pools: posición de partida del abanico ────────────────────
     Con ratón, las insignias parten en abanico hacia el centro de la lista,
     pero el desplazamiento de cada una se limita (en distancia, no por eje)
     al 45 % de su celda: su centro nunca sale de la celda y siempre se ve
     sobre ella. En táctil (móviles y tabletas) solo giran y crecen en su
     propia celda: la lista es más alta que la pantalla y el dedo puede
     tocar una insignia en cualquier momento del recorrido. */
  var tactil = window.matchMedia('(pointer: coarse)');
  function medirAbanico() {
    var paso = M.tokens().profAbanico || 8;
    $$('.insignias').forEach(function (ul) {
      var items = $$('.insignia', ul);
      var n = items.length;
      if (!n) return;
      var W = ul.clientWidth, H = ul.clientHeight;
      var enCelda = tactil.matches;
      var mitad = (n - 1) / 2;
      var R = Math.min(H * 0.9, W * 0.8);
      items.forEach(function (li, i) {
        var a = (i - mitad) * paso * Math.PI / 180;
        var fx = W / 2 + Math.sin(a) * R * 0.9;
        var fy = H / 2 + (1 - Math.cos(a)) * R * 0.5;
        var cx = li.offsetLeft - ul.offsetLeft + li.offsetWidth / 2;
        var cy = li.offsetTop - ul.offsetTop + li.offsetHeight / 2;
        var dx = 0, dy = 0;
        if (!enCelda) {
          dx = fx - cx; dy = fy - cy;
          var d = Math.hypot(dx, dy), tope = li.offsetWidth * 0.45;
          if (d > tope) { dx *= tope / d; dy *= tope / d; }
        }
        li.style.setProperty('--dx', dx.toFixed(1) + 'px');
        li.style.setProperty('--dy', dy.toFixed(1) + 'px');
        li.style.setProperty('--rot', ((i - mitad) * paso * (enCelda ? 0.5 : 1)).toFixed(2) + 'deg');
        li.style.setProperty('--esc', enCelda ? '.86' : '.72');
        li.style.setProperty('--z', String(n - Math.round(Math.abs(i - mitad))));
      });
    });
  }

  /* ── Luz LED de las tarjetas de clases (una vez por tarjeta) ── */
  var vistas = {}, ioTarjetas = null;
  function tarjetas() {
    if (ioTarjetas) ioTarjetas.disconnect();
    var lista = $$('#clases .tarjeta');
    lista.forEach(function (t, i) {
      t.setAttribute('data-led', String(i));
      if (vistas[i]) t.classList.add('encendida', 'encendida-ya');
    });
    if (!('IntersectionObserver' in window)) { lista.forEach(function (t) { t.classList.add('encendida'); }); return; }
    ioTarjetas = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target, i = t.getAttribute('data-led');
        t.style.setProperty('--retardo-led', (Number(i) * M.tokens().retardoEscalon * 2) + 'ms');
        t.classList.add('encendida');
        vistas[i] = true;
        ioTarjetas.unobserve(t);
      });
    }, { threshold: 0.35 });
    lista.forEach(function (t) { if (!vistas[t.getAttribute('data-led')]) ioTarjetas.observe(t); });
  }

  /* ── Motor: currentTime de las animaciones sd-* ─────────────── */
  var pistas = [], pendiente = false, escuchando = false, fondo = null, telon = null, heroEl = null;
  function rem() { return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16; }
  /* Rangos (0 → 1) de cada tipo */
  var RANGOS = {
    hero:    function (r, vh) { return window.scrollY / (0.7 * vh); },               /* 0 → 70 % de pantalla de scroll */
    corte:   function (r, vh) { return (vh - r.top) / (vh - 6 * rem()); },          /* entra → llega a 6rem del borde */
    abanico: function (r, vh) { return (vh - r.top - 0.05 * vh) / (0.55 * vh); },    /* 5 % → 60 % de pantalla dentro */
    precio:  function (r, vh) { return (vh - r.top) / (0.5 * vh); }                  /* entra → media pantalla dentro */
  };

  function recolectar() {
    pistas = [];
    if (!document.getAnimations) return;
    document.getAnimations().forEach(function (a) {
      var nombre = a.animationName || '';
      if (nombre.indexOf('sd-') !== 0 || !a.effect || !a.effect.target) return;
      var t = a.effect.target, tipo, sujeto = null;
      if (nombre.indexOf('sd-hero') === 0) tipo = 'hero';
      else if (nombre.indexOf('sd-corte') === 0) { tipo = 'corte'; sujeto = t; }
      else if (nombre === 'sd-abanico') { tipo = 'abanico'; sujeto = t.closest('.insignias'); }
      else { tipo = 'precio'; sujeto = t.closest('.precio, .politica .bloque, .filas .fila'); }
      if (tipo !== 'hero' && !sujeto) return;
      a.pause();
      pistas.push({ a: a, tipo: tipo, sujeto: sujeto });
    });
  }

  function pintar() {
    pendiente = false;
    var vh = window.innerHeight;
    var cache = new Map();
    /* Primero todas las lecturas… */
    var p = pistas.map(function (x) {
      var r = null;
      if (x.sujeto) {
        if (!cache.has(x.sujeto)) cache.set(x.sujeto, x.sujeto.getBoundingClientRect());
        r = cache.get(x.sujeto);
      }
      return M.limitar(RANGOS[x.tipo](r, vh), 0, 1);
    });
    var progresoHero = M.limitar(RANGOS.hero(null, vh), 0, 1);
    var y = window.scrollY;
    /* …luego las escrituras */
    pistas.forEach(function (x, i) { x.a.currentTime = p[i] * 1000; });
    if (heroEl) {
      /* solo si cambia (por encima del hero el progreso ya vale 1): el hero
         se mueve y pide sus capas compuestas mientras dure (nucleo.js) */
      var ph = progresoHero.toFixed(4);
      if (heroEl.style.getPropertyValue('--p-hero') !== ph) { M.enMovimiento(heroEl); heroEl.style.setProperty('--p-hero', ph); }
    }
    if (telon) telon.style.scale = Math.pow(M.tokens().profEscalaHero || 1, progresoHero).toFixed(4);
    if (fondo && y < vh * 1.5) fondo.style.translate = '0 ' + (Math.max(0, y) * M.tokens().distEscena).toFixed(1) + 'px';
    M.emitir('hero', progresoHero);
  }
  function pedir() { if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); } }

  function escucharScroll(si) {
    if (si === escuchando) return;
    escuchando = si;
    if (si) { window.addEventListener('scroll', pedir, { passive: true }); pedir(); }
    else window.removeEventListener('scroll', pedir);
  }

  function preparar() {
    prepararPiezas();
    medirAbanico();
    tarjetas();
    fondo = document.querySelector('.hero-fondo');
    telon = document.querySelector('.hero-mascara');
    heroEl = document.querySelector('.hero, .marca-hero');
    /* Espera un fotograma: las animaciones CSS del HTML nuevo ya existen */
    requestAnimationFrame(function () { recolectar(); escucharScroll(true); pedir(); });
  }

  M.registrar('scroll', {
    activar: preparar,
    reenganchar: preparar,
    pausar: function () { escucharScroll(false); },
    reanudar: function () { escucharScroll(true); },
    desactivar: function () {
      escucharScroll(false); pistas = [];
      if (ioTarjetas) ioTarjetas.disconnect();
      if (fondo) fondo.style.translate = '';
      if (telon) telon.style.scale = '';
      if (heroEl) heroEl.style.removeProperty('--p-hero');
    }
  });
})();
