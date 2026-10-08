/* ================================================================
   Eleva Pádel — movimiento/tres-d.js
   Ciclo de vida de la pista 3D del hero (la escena está en pista.js):
   · solo se carga después del contenido (load + momento libre), cuando el
     hero se ve y si el dispositivo la aguanta: WebGL2, sin Save-Data ni
     red 2G, sin movimiento reducido, memoria y núcleos razonables;
   · mientras tanto (y si no se carga) se ve la imagen fija de la misma
     escena; el relevo es un fundido y el encendido de las LED continúa
     donde lo dejó la penumbra del CSS;
   · cámara: el progreso del hero (canal «hero» de scroll.js, el mismo que
     abre el logo) la baja de la vista alta a la altura del jugador; el
     ratón la mueve con un paralaje suave; en táctil, arrastrar en
     horizontal sobre el hero gira un poco la pista y vuelve con un muelle
     (touch-action: pan-y: el scroll vertical nunca se bloquea);
   · solo pinta cuando algo cambia; el núcleo la pausa fuera de pantalla,
     con la pestaña oculta y al salir de la página (bfcache);
   · DPR limitado (1,5 en táctil, 2 con ratón) y sin antialiasing en
     táctil ni con densidad 2 o más (la densidad ya suaviza los bordes y el
     búfer multimuestra cuadruplica la memoria de GPU); con WebGL por
     software (sin GPU) no se carga.
   ================================================================ */
(function () {
  'use strict';
  var M = window.ElevaMov;
  if (!M) return;

  var script = document.currentScript;
  var version = script && /[?&]v=([^&]+)/.exec(script.src);
  var URL_PISTA = './pista.js' + (version ? '?v=' + version[1] : '');

  var hero, escena, penumbra, tinte, lienzo, pista = null, lista = false, cargando = false, activo = false;
  var pausado = true, raf = 0, ultimoT = 0, ro = null, programada = false;
  var vertical = window.matchMedia('(max-aspect-ratio: 1/1)');
  var tactil = window.matchMedia('(pointer: coarse)');
  var objetivo = { progreso: 0, px: 0, py: 0, giro: 0 };
  var actual = { progreso: 0, px: 0, py: 0, giro: 0, encendido: 0 };
  var velGiro = 0, arrastre = null;
  var porAncla = !!(location.hash && location.hash !== '#inicio' && location.hash.length > 1);

  /* ── ¿Lo aguanta el dispositivo? ───────────────────────────── */
  function apto() {
    if (M.reducido()) return false;
    if (!('WebGL2RenderingContext' in window)) return false;
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return false;
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;
    if (gpu === false) return false;
    return true;
  }

  /* ¿Hay GPU? Sin ella (WebGL por software: SwiftShader, llvmpipe…) la
     escena a pantalla completa cuesta fotogramas y batería: se queda la
     imagen fija y no se descarga nada. Se mira una sola vez, en el momento
     diferido de la carga (no al abrir la página), con un contexto mínimo de
     1 × 1 px que se libera enseguida y ANTES de pedir el módulo 3D. */
  var gpu = null;
  function hayGPU() {
    if (gpu !== null) return gpu;
    gpu = false;
    try {
      var c = document.createElement('canvas');
      c.width = c.height = 1;
      var gl = c.getContext('webgl2', { failIfMajorPerformanceCaveat: true, antialias: false, depth: false, alpha: false });
      if (gl) {
        var info = gl.getExtension('WEBGL_debug_renderer_info');
        var nombre = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
        gpu = !/swiftshader|llvmpipe|software|basic render/i.test(nombre);
        var perder = gl.getExtension('WEBGL_lose_context');
        if (perder) perder.loseContext();
      }
    } catch (e) { gpu = false; }
    return gpu;
  }

  /* Encendido de las LED: mientras dure la animación CSS de la penumbra
     (sobre la imagen fija), la escena sigue su mismo punto. */
  function encendidoCSS() {
    if (!penumbra) return 1;
    var o = parseFloat(getComputedStyle(penumbra).opacity);
    var inicial = M.tokens().penumbraInicial || 0.75;
    return isNaN(o) ? 1 : M.limitar(1 - o / inicial, 0, 1);
  }

  function dpr() { return Math.min(window.devicePixelRatio || 1, tactil.matches ? 1.5 : 2); }
  function medir() {
    if (!pista || !escena) return;
    var r = escena.getBoundingClientRect();
    pista.redimensionar(r.width, r.height, dpr(), vertical.matches ? 'vertical' : 'horizontal');
    despertar();
  }

  /* Cede el hilo principal entre pasos de la creación de la escena */
  function ceder() {
    if (window.scheduler && typeof window.scheduler.yield === 'function') return window.scheduler.yield();
    return new Promise(function (r) { setTimeout(r, 0); });
  }

  /* ── Bucle: solo mientras algo se mueve ────────────────────── */
  function despertar() { if (!raf && pista && lista && !pausado) { ultimoT = 0; raf = requestAnimationFrame(cuadro); } }
  function cuadro(t) {
    raf = 0;
    var dt = ultimoT ? Math.min(0.05, (t - ultimoT) / 1000) : 1 / 60;
    ultimoT = t;
    var tk = M.tokens(), k = tk.fisicaSuavizado;
    actual.progreso = M.acercar(actual.progreso, objetivo.progreso, k, dt);
    actual.px = M.acercar(actual.px, objetivo.px, k * 0.5, dt);
    actual.py = M.acercar(actual.py, objetivo.py, k * 0.5, dt);
    if (arrastre) {
      actual.giro = M.acercar(actual.giro, objetivo.giro, k * 2, dt);
      velGiro = 0;
    } else {
      /* muelle amortiguado hacia 0: retorno elástico */
      velGiro += (-tk.fisicaRigidez * actual.giro - tk.fisicaAmortiguacion * velGiro) * dt;
      actual.giro += velGiro * dt;
    }
    var enc = encendidoCSS();
    actual.encendido = enc;
    pista.pintar(actual);

    var quieto = Math.abs(actual.progreso - objetivo.progreso) < 1e-4 &&
      Math.abs(actual.px - objetivo.px) < 1e-3 && Math.abs(actual.py - objetivo.py) < 1e-3 &&
      Math.abs(actual.giro) < 1e-4 && Math.abs(velGiro) < 1e-4 && !arrastre && enc >= 1;
    if (!quieto) raf = requestAnimationFrame(cuadro);
  }

  /* ── Entradas ───────────────────────────────────────────────── */
  function alProgreso(p) { objetivo.progreso = p; if (activo) despertar(); }
  function alMoverRaton(e) {
    if (e.pointerType !== 'mouse') return;
    var p = M.tokens().profParalajePista;
    objetivo.px = ((e.clientX / window.innerWidth) - 0.5) * 2 * p;
    objetivo.py = ((e.clientY / window.innerHeight) - 0.5) * 2 * p;
    despertar();
  }
  function MAX() { return M.tokens().profGiroPista * Math.PI / 180; }
  function alTocar(e) {
    if (e.pointerType === 'mouse') return;
    arrastre = { x: e.clientX, y: e.clientY, id: e.pointerId, horizontal: null };
  }
  function alArrastrar(e) {
    if (!arrastre || e.pointerId !== arrastre.id) return;
    var dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y;
    if (arrastre.horizontal === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) arrastre.horizontal = Math.abs(dx) > Math.abs(dy);
    if (!arrastre.horizontal) return;
    /* solo la componente horizontal; con resistencia al acercarse al tope */
    var n = dx / Math.max(1, hero.clientWidth);
    objetivo.giro = MAX() * Math.tanh(n * 2.2);
    despertar();
  }
  function alSoltar(e) {
    if (!arrastre || (e.pointerId !== undefined && e.pointerId !== arrastre.id)) return;
    arrastre = null;
    objetivo.giro = 0;
    despertar();
  }

  /* ── Carga ──────────────────────────────────────────────────── */
  function cargar() {
    if (pista || cargando || !activo || pausado || !apto()) return;
    /* Solo si el hero se ve. Quien entra por un ancla a otra sección
       (#contacto…) no descarga la escena mientras el navegador baja hasta
       ella; si vuelve arriba, el núcleo la reanuda y entonces se carga. */
    if (porAncla) return;
    var r = hero.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= window.innerHeight) return;
    if (!hayGPU()) return;          /* sin GPU: imagen fija, sin descargas */
    cargando = true;
    /* Por pasos, cediendo el hilo entre uno y otro: contexto WebGL, escena,
       cada shader y el primer fotograma van en tareas separadas */
    import(URL_PISTA).then(function (mod) {
      if (!activo) throw new Error('desactivado');
      lienzo = document.createElement('canvas');
      lienzo.className = 'hero-lienzo';
      /* por encima de la imagen y la penumbra, por debajo del tinte */
      escena.insertBefore(lienzo, tinte);
      lienzo.addEventListener('webglcontextlost', function (ev) { ev.preventDefault(); quitar(); });
      /* MSAA solo con densidad baja: con 2 o más la densidad ya suaviza los
         bordes, y el búfer multimuestra multiplica por 4 la memoria de GPU */
      return mod.crearPista(lienzo, { suavizado: !tactil.matches && (window.devicePixelRatio || 1) < 2, ceder: ceder });
    }).then(function (p) {
      if (!activo || !lienzo) { try { p.destruir(); } catch (e) { /* no-op */ } throw new Error('desactivado'); }
      pista = p;
      medir();
      return ceder();
    }).then(function () { return pista.preparar(); })
      .then(ceder)
      .then(function () {
      cargando = false;
      if (!pista) return;
      lista = true;
      actual.progreso = objetivo.progreso;
      actual.encendido = encendidoCSS();
      pista.pintar(actual);
      /* fundido de la imagen fija a la escena viva */
      requestAnimationFrame(function () { if (lienzo) hero.classList.add('tres-d-lista'); });
      despertar();
    }).catch(function (err) {
      cargando = false;
      /* desactivado a mitad de carga: no es un fallo, no se avisa */
      if (!err || err.message !== 'desactivado') console.info('[Eleva 3D] se queda la imagen fija:', err && err.message);
      quitar();
    });
  }
  /* Cuándo: después de la carga, cuando la persona interactúa por primera
     vez (scroll, puntero, toque o teclado) o, si no lo hace, a los 6 s; y
     siempre en un momento de inactividad. Hasta entonces se ve la imagen
     fija de la misma escena. Así la creación no compite con la carga ni con
     el primer gesto (medido: una tarea de hasta 576 ms en móvil lento). */
  var GESTOS = ['scroll', 'wheel', 'pointerdown', 'pointermove', 'touchstart', 'keydown'];
  function programarCarga() {
    if (programada) return;
    programada = true;
    var hecho = false, espera = 0;
    var ir = function () {
      if (hecho) return;
      hecho = true;
      clearTimeout(espera);
      GESTOS.forEach(function (g) { window.removeEventListener(g, ir, true); });
      var hacer = function () { cargar(); };
      if ('requestIdleCallback' in window) requestIdleCallback(hacer, { timeout: 2000 }); else setTimeout(hacer, 300);
    };
    var tras = function () {
      GESTOS.forEach(function (g) { window.addEventListener(g, ir, { capture: true, passive: true, once: true }); });
      espera = setTimeout(ir, 6000);
    };
    if (document.readyState === 'complete') tras(); else window.addEventListener('load', tras, { once: true });
  }

  function quitar() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (hero) hero.classList.remove('tres-d-lista');
    if (pista) { try { pista.destruir(); } catch (e) { /* no-op */ } }
    pista = null;
    lista = false;
    if (lienzo && lienzo.parentNode) lienzo.parentNode.removeChild(lienzo);
    lienzo = null;
  }

  M.escuchar('hero', alProgreso);

  M.registrar('tres-d', {
    activar: function () {
      hero = document.querySelector('.hero');
      escena = hero && hero.querySelector('.hero-escena');
      penumbra = hero && hero.querySelector('.hero-penumbra');
      tinte = hero && hero.querySelector('.hero-tinte');
      if (!escena || !apto()) return;          /* se queda la imagen fija (la misma escena) */
      activo = true;
      pausado = false;
      window.addEventListener('pointermove', alMoverRaton, { passive: true });
      hero.addEventListener('pointerdown', alTocar, { passive: true });
      hero.addEventListener('pointermove', alArrastrar, { passive: true });
      hero.addEventListener('pointerup', alSoltar, { passive: true });
      hero.addEventListener('pointercancel', alSoltar, { passive: true });
      if ('ResizeObserver' in window) { ro = new ResizeObserver(medir); ro.observe(escena); }
      if (vertical.addEventListener) vertical.addEventListener('change', medir);
      programarCarga();
    },
    pausar: function () { pausado = true; arrastre = null; if (raf) cancelAnimationFrame(raf); raf = 0; },
    reanudar: function () {
      /* tras una pausa por salir de pantalla, volver al hero ya es verlo */
      if (pausado && porAncla && window.scrollY < hero.offsetHeight) porAncla = false;
      pausado = false;
      if (pista) despertar(); else if (programada) cargar();
    },
    desactivar: function () {
      activo = false; pausado = true; programada = false;
      window.removeEventListener('pointermove', alMoverRaton);
      if (hero) {
        hero.removeEventListener('pointerdown', alTocar);
        hero.removeEventListener('pointermove', alArrastrar);
        hero.removeEventListener('pointerup', alSoltar);
        hero.removeEventListener('pointercancel', alSoltar);
      }
      if (ro) ro.disconnect();
      if (vertical.removeEventListener) vertical.removeEventListener('change', medir);
      quitar();
    },
    /* para medir y para los vídeos */
    estado: function () { return { cargada: !!pista, actual: actual, objetivo: objetivo }; }
  }, { raiz: '.hero' });

  /* Acceso de solo lectura para las pruebas */
  window.ElevaTresD = { estado: function () { return { cargada: !!pista, actual: actual, objetivo: objetivo }; } };
})();
