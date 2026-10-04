/* ================================================================
   Eleva Pádel — movimiento/nucleo.js
   Núcleo del sistema de movimiento (uno solo para / y /pizarra):
   · Espejo en JS de los tokens de css/main.css: se leen de :root, así hay
     una sola fuente de verdad (en movimiento reducido el CSS los acorta y
     este espejo lo refleja solo).
   · Registro de módulos con una única API:
       ElevaMov.registrar(nombre, { activar, pausar, reanudar, desactivar, reenganchar }, opciones)
     opciones: { raiz: selector (se pausa fuera de pantalla),
                 soloRaton: bool (solo con (hover: hover) and (pointer: fine)),
                 conReducido: bool (sigue activo con movimiento reducido) }
     El núcleo decide cuándo llamar a cada función:
       - prefers-reduced-motion → desactivar (y se quita html.mov)
       - pestaña oculta o salida de la página (bfcache) → pausar / reanudar
       - raíz del módulo fuera de pantalla (IntersectionObserver) → pausar
       - HTML nuevo de render.js (cambio de idioma: evento
         eleva:repintado), resize y vuelta desde bfcache → reenganchar
   · Canal entre módulos: emitir(canal, dato) / escuchar(canal, fn), p. ej.
     el progreso del hero que publica scroll.js y usa la cámara 3D.
   · Motor del scroll: JS (scroll.js mueve el currentTime de las
     animaciones CSS). Medido en Chromium con CPU ×4 y arrastres táctiles:
     motor JS p95 16,7 ms entre fotogramas; scroll-driven animations
     nativas 33,4 ms. Por eso no se usan las nativas.
   ================================================================ */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var mqReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqRaton = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ── Tokens ─────────────────────────────────────────────────── */
  var tokens = {};
  function leerTokens() {
    var cs = getComputedStyle(raiz);
    var v = function (n) { return cs.getPropertyValue(n).trim(); };
    var ms = function (n) { var x = v(n); return /ms$/.test(x) ? parseFloat(x) : (parseFloat(x) || 0) * 1000; };
    var num = function (n) { return parseFloat(v(n)) || 0; };
    tokens = {
      durInstante: ms('--dur-instante'), durCorta: ms('--dur-corta'), durMedia: ms('--dur-media'),
      durLarga: ms('--dur-larga'), durGiro: ms('--dur-giro'), durEncendido: ms('--dur-encendido'), durVt: ms('--dur-vt'),
      curvaSalida: v('--curva-salida'), curvaEntrada: v('--curva-entrada'),
      curvaTension: v('--curva-tension'), curvaMuelle: v('--curva-muelle'),
      retardoEscalon: ms('--retardo-escalon'), retardoEncendido: ms('--retardo-encendido'),
      distIman: num('--dist-iman'), distRadioIman: num('--dist-radio-iman'),
      distParalaje: num('--dist-paralaje'), distTitulo: num('--dist-titulo'),
      distPulso: num('--dist-pulso'), distEscena: num('--dist-escena'),
      profPerspectiva: num('--prof-perspectiva'), profInclinacion: num('--prof-inclinacion'),
      profAbanico: num('--prof-abanico'),
      profEscalaHero: num('--prof-escala-hero'), profEscalaCorte: num('--prof-escala-corte'),
      profGiroPista: num('--prof-giro-pista'), profParalajePista: num('--prof-paralaje-pista'),
      fisicaSuavizado: num('--fisica-suavizado'), fisicaRigidez: num('--fisica-rigidez'),
      fisicaAmortiguacion: num('--fisica-amortiguacion'),
      penumbraInicial: num('--penumbra-inicial')
    };
    return tokens;
  }

  /* ── Canal entre módulos ────────────────────────────────────── */
  var canales = {};
  function escuchar(canal, fn) { (canales[canal] = canales[canal] || []).push(fn); }
  function emitir(canal, dato) { (canales[canal] || []).forEach(function (fn) { fn(dato); }); }

  /* ── Registro de módulos ────────────────────────────────────── */
  var modulos = [];
  var estado = { reducido: mqReducido.matches, oculto: document.hidden };

  function llamar(m, fn, arg) {
    if (typeof m.api[fn] !== 'function') return;
    try { m.api[fn](arg); } catch (e) { console.error('[Eleva mov] ' + m.nombre + '.' + fn + ':', e); }
  }
  function permitido(m) {
    if (m.opciones.soloRaton && !mqRaton.matches) return false;
    if (estado.reducido && !m.opciones.conReducido) return false;
    return true;
  }
  function evaluar(m) {
    if (!permitido(m)) {
      if (m.activo) { m.activo = false; m.pausado = false; llamar(m, 'desactivar'); }
      return;
    }
    if (!m.activo) { m.activo = true; m.pausado = false; llamar(m, 'activar'); }
    var debePausar = estado.oculto || m.enPantalla === false;
    if (debePausar && !m.pausado) { m.pausado = true; llamar(m, 'pausar'); }
    else if (!debePausar && m.pausado) { m.pausado = false; llamar(m, 'reanudar'); }
  }
  function evaluarTodos() { modulos.forEach(evaluar); }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      modulos.forEach(function (m) {
        var i = m.raices.indexOf(e.target);
        if (i === -1) return;
        m.visibles[i] = e.isIntersecting;
        m.enPantalla = m.visibles.some(Boolean);
        evaluar(m);
      });
    });
  }, { rootMargin: '10% 0px' }) : null;

  function observar(m) {
    if (!m.opciones.raiz) return;
    m.raices.forEach(function (r) { if (io) io.unobserve(r); });
    m.raices = Array.prototype.slice.call(document.querySelectorAll(m.opciones.raiz));
    m.visibles = m.raices.map(function () { return false; });
    if (io && m.raices.length) m.raices.forEach(function (r) { io.observe(r); });
    else m.enPantalla = undefined;
  }

  function registrar(nombre, api, opciones) {
    var m = { nombre: nombre, api: api || {}, opciones: opciones || {}, activo: false, pausado: false,
              raices: [], visibles: [], enPantalla: undefined };
    modulos.push(m);
    observar(m);
    if (arrancado) evaluar(m);
    return m;
  }

  function reenganchar(motivo) {
    leerTokens();
    modulos.forEach(function (m) {
      observar(m);
      if (m.activo) llamar(m, 'reenganchar', motivo);
      evaluar(m);
    });
  }

  /* ── Estado global ──────────────────────────────────────────── */
  function aplicarClases() { raiz.classList.toggle('mov', !estado.reducido); }
  function onCambio(mq, fn) { if (mq.addEventListener) mq.addEventListener('change', fn); else mq.addListener(fn); }

  onCambio(mqReducido, function () { estado.reducido = mqReducido.matches; leerTokens(); aplicarClases(); evaluarTodos(); });
  onCambio(mqRaton, evaluarTodos);
  document.addEventListener('visibilitychange', function () { estado.oculto = document.hidden; evaluarTodos(); });
  document.addEventListener('eleva:repintado', function () { reenganchar('repintado'); });
  /* bfcache: al salir se pausa todo; al volver se reengancha y reanuda */
  window.addEventListener('pagehide', function () { estado.oculto = true; evaluarTodos(); });
  window.addEventListener('pageshow', function (e) {
    estado.oculto = document.hidden;
    if (e.persisted) reenganchar('bfcache'); else evaluarTodos();
  });
  var tResize = 0;
  window.addEventListener('resize', function () {
    clearTimeout(tResize);
    tResize = setTimeout(function () { reenganchar('resize'); }, 150);
  });

  leerTokens();
  aplicarClases();

  /* Los módulos se registran al cargar (scripts defer, en orden) y se
     activan juntos al terminar de leer el documento. */
  var arrancado = false;
  function arrancar() { arrancado = true; evaluarTodos(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else setTimeout(arrancar, 0);

  window.ElevaMov = {
    tokens: function () { return tokens; },
    registrar: registrar,
    emitir: emitir,
    escuchar: escuchar,
    reducido: function () { return estado.reducido; },
    raton: function () { return mqRaton.matches; },
    /* utilidades comunes */
    limitar: function (v, a, b) { return Math.min(b, Math.max(a, v)); },
    /* suavizado exponencial independiente de los fps */
    acercar: function (actual, objetivo, k, dt) { return actual + (objetivo - actual) * (1 - Math.exp(-k * dt)); }
  };
})();
