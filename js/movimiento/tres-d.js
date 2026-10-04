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
     táctil (la densidad de píxeles ya suaviza los bordes).
   ================================================================ */
(function () {
  'use strict';
  var M = window.ElevaMov;
  if (!M) return;

  var script = document.currentScript;
  var version = script && /[?&]v=([^&]+)/.exec(script.src);
  var URL_PISTA = './pista.js' + (version ? '?v=' + version[1] : '');

  var hero, escena, penumbra, lienzo, pista = null, cargando = false, activo = false;
  var pausado = true, raf = 0, ultimoT = 0, ro = null, programada = false;
  var vertical = window.matchMedia('(max-aspect-ratio: 1/1)');
  var tactil = window.matchMedia('(pointer: coarse)');
  var objetivo = { progreso: 0, px: 0, py: 0, giro: 0 };
  var actual = { progreso: 0, px: 0, py: 0, giro: 0, encendido: 0 };
  var velGiro = 0, arrastre = null;

  /* ── ¿Lo aguanta el dispositivo? ───────────────────────────── */
  function apto() {
    if (M.reducido()) return false;
    if (!('WebGL2RenderingContext' in window)) return false;
    var c = navigator.connection;
    if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return false;
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return false;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;
    return true;
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

  /* ── Bucle: solo mientras algo se mueve ────────────────────── */
  function despertar() { if (!raf && pista && !pausado) { ultimoT = 0; raf = requestAnimationFrame(cuadro); } }
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
    cargando = true;
    import(URL_PISTA).then(function (mod) {
      if (!activo) { cargando = false; return; }
      lienzo = document.createElement('canvas');
      lienzo.className = 'hero-lienzo';
      escena.appendChild(lienzo);
      try { pista = mod.crearPista(lienzo, { suavizado: !tactil.matches }); } catch (err) { quitar(); cargando = false; return; }
      lienzo.addEventListener('webglcontextlost', function (ev) { ev.preventDefault(); quitar(); });
      medir();
      return pista.preparar();
    }).then(function () {
      cargando = false;
      if (!pista) return;
      actual.progreso = objetivo.progreso;
      actual.encendido = encendidoCSS();
      pista.pintar(actual);
      /* fundido de la imagen fija a la escena viva */
      requestAnimationFrame(function () { if (lienzo) hero.classList.add('tres-d-lista'); });
      despertar();
    }).catch(function (err) {
      cargando = false;
      console.warn('[Eleva 3D] sin escena 3D, se queda la imagen fija:', err && err.message);
      quitar();
    });
  }
  function programarCarga() {
    if (programada) return;
    programada = true;
    var ir = function () {
      var hacer = function () { cargar(); };
      if ('requestIdleCallback' in window) requestIdleCallback(hacer, { timeout: 1500 }); else setTimeout(hacer, 200);
    };
    if (document.readyState === 'complete') ir(); else window.addEventListener('load', ir, { once: true });
  }

  function quitar() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (hero) hero.classList.remove('tres-d-lista');
    if (pista) { try { pista.destruir(); } catch (e) { /* no-op */ } }
    pista = null;
    if (lienzo && lienzo.parentNode) lienzo.parentNode.removeChild(lienzo);
    lienzo = null;
  }

  M.escuchar('hero', alProgreso);

  M.registrar('tres-d', {
    activar: function () {
      hero = document.querySelector('.hero');
      escena = hero && hero.querySelector('.hero-escena');
      penumbra = hero && hero.querySelector('.hero-penumbra');
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
    reanudar: function () { pausado = false; if (pista) despertar(); else if (programada) cargar(); },
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
