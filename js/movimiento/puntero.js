/* ================================================================
   Eleva Pádel — movimiento/puntero.js
   Lo que responde al ratón (solo con (hover: hover) and (pointer: fine);
   en táctil lo equivalente responde al scroll y al dedo: tacto.js):
   · paralaje    — el logo del hero y el titular se desplazan en sentidos
                   opuestos (la cámara de la pista lo hace en tres-d.js)
   · inclinacion — las insignias de los pools se inclinan hacia el puntero
   · iman        — botones magnéticos suaves (como mucho --dist-iman)
   · cursor      — un punto que crece sobre lo interactivo; cursor nativo
                   en los campos de texto
   Cada uno es un módulo del núcleo (activar, pausar, reanudar, desactivar,
   reenganchar).
   ================================================================ */
(function () {
  'use strict';
  var M = window.ElevaMov;
  if (!M) return;
  var T = M.tokens;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function lim(v, a) { return Math.max(-a, Math.min(a, v)); }

  /* Un bucle rAF que se detiene solo cuando no hay nada que mover */
  function bucle(paso) {
    var id = 0;
    function tick() { id = 0; if (paso()) id = requestAnimationFrame(tick); }
    return {
      pedir: function () { if (!id) id = requestAnimationFrame(tick); },
      parar: function () { if (id) cancelAnimationFrame(id); id = 0; }
    };
  }

  /* ── Paralaje del hero: logo y titular, opuestos ───────────── */
  (function () {
    var telon, titulo, obj = { x: 0, y: 0 }, act = { x: 0, y: 0 };
    var b = bucle(function () {
      act.x += (obj.x - act.x) * 0.12;
      act.y += (obj.y - act.y) * 0.12;
      var t = T();
      if (telon) telon.style.translate = (act.x * t.distParalaje).toFixed(2) + 'px ' + (act.y * t.distParalaje).toFixed(2) + 'px';
      if (titulo) titulo.style.translate = (-act.x * t.distTitulo).toFixed(2) + 'px ' + (-act.y * t.distTitulo).toFixed(2) + 'px';
      return Math.abs(obj.x - act.x) > 0.001 || Math.abs(obj.y - act.y) > 0.001;
    });
    function mover(e) {
      obj.x = (e.clientX / window.innerWidth - 0.5) * 2;
      obj.y = (e.clientY / window.innerHeight - 0.5) * 2;
      b.pedir();
    }
    function enganchar() { telon = $('.hero-telon, .marca-logo'); titulo = $('.hero-titulo, .marca-titulo'); }
    M.registrar('paralaje', {
      activar: function () { enganchar(); window.addEventListener('pointermove', mover, { passive: true }); },
      pausar: function () { window.removeEventListener('pointermove', mover); b.parar(); },
      reanudar: function () { window.addEventListener('pointermove', mover, { passive: true }); },
      reenganchar: enganchar,
      desactivar: function () {
        window.removeEventListener('pointermove', mover); b.parar();
        obj.x = obj.y = act.x = act.y = 0;
        if (telon) telon.style.translate = '';
        if (titulo) titulo.style.translate = '';
      }
    }, { raiz: '.hero, .marca-hero', soloRaton: true });
  })();

  /* ── Insignias que se inclinan hacia el puntero ────────────── */
  (function () {
    var seccion, piezas = [], px = null, py = null;
    var b = bucle(function () {
      var max = T().profInclinacion;
      piezas.forEach(function (c) {
        if (px === null) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); return; }
        /* se mide sobre el <li>, que no se inclina: sin temblor en los bordes */
        var r = c.parentNode.getBoundingClientRect();
        var dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2);
        c.style.setProperty('--ry', (lim(dx / 260, 1) * max).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (lim(-dy / 260, 1) * max).toFixed(2) + 'deg');
      });
      return false;
    });
    function mover(e) { if (e.pointerType !== 'mouse') return; px = e.clientX; py = e.clientY; b.pedir(); }
    function salir() { px = py = null; b.pedir(); }
    function soltar() {
      if (!seccion) return;
      seccion.removeEventListener('pointermove', mover);
      seccion.removeEventListener('pointerleave', salir);
    }
    function enganchar() {
      soltar();
      seccion = $('.seccion-pools');
      piezas = $$('.insignia-pieza');
      if (!seccion) return;
      seccion.addEventListener('pointermove', mover, { passive: true });
      seccion.addEventListener('pointerleave', salir);
    }
    M.registrar('inclinacion', {
      activar: enganchar,
      reenganchar: enganchar,
      pausar: function () { soltar(); b.parar(); },
      reanudar: enganchar,
      desactivar: function () { soltar(); b.parar(); px = py = null; piezas.forEach(function (c) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); }); }
    }, { raiz: '.seccion-pools', soloRaton: true });
  })();

  /* ── Botones magnéticos ────────────────────────────────────── */
  (function () {
    var botones = [], px = -1e4, py = -1e4;
    var b = bucle(function () {
      var t = T();
      botones.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var ox = parseFloat(el.style.getPropertyValue('--iman-x')) || 0;
        var oy = parseFloat(el.style.getPropertyValue('--iman-y')) || 0;
        var cx = r.left - ox + r.width / 2, cy = r.top - oy + r.height / 2;
        var dentro = Math.abs(px - cx) < r.width / 2 + t.distRadioIman && Math.abs(py - cy) < r.height / 2 + t.distRadioIman;
        var x = dentro ? lim((px - cx) * 0.25, t.distIman) : 0;
        var y = dentro ? lim((py - cy) * 0.35, t.distIman) : 0;
        if (Math.abs(x - ox) > 0.05 || Math.abs(y - oy) > 0.05) {
          el.style.setProperty('--iman-x', x.toFixed(2) + 'px');
          el.style.setProperty('--iman-y', y.toFixed(2) + 'px');
        }
      });
      return false;
    });
    function mover(e) { px = e.clientX; py = e.clientY; b.pedir(); }
    function enganchar() {
      botones.forEach(function (el) { el.classList.remove('iman'); });
      botones = $$('.hero .boton, .seccion .boton, .club');
      botones.forEach(function (el) { el.classList.add('iman'); });
    }
    function quitar() {
      window.removeEventListener('pointermove', mover); b.parar();
      botones.forEach(function (el) { el.style.removeProperty('--iman-x'); el.style.removeProperty('--iman-y'); });
    }
    M.registrar('iman', {
      activar: function () { enganchar(); window.addEventListener('pointermove', mover, { passive: true }); },
      reenganchar: enganchar,
      pausar: quitar,
      reanudar: function () { window.addEventListener('pointermove', mover, { passive: true }); },
      desactivar: function () { quitar(); botones.forEach(function (el) { el.classList.remove('iman'); }); botones = []; }
    }, { soloRaton: true });
  })();

  /* ── Puntero propio: un punto ──────────────────────────────── */
  (function () {
    var el = null, x = 0, y = 0;
    var TEXTO = 'input, textarea, select, [contenteditable]';
    var INTERACTIVO = 'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"]), label, summary';
    var b = bucle(function () {
      if (el) el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      return false;
    });
    function mover(e) {
      if (!el) return;
      if (e.pointerType && e.pointerType !== 'mouse') { el.classList.remove('visible'); document.documentElement.classList.remove('cursor-propio'); return; }
      x = e.clientX; y = e.clientY;
      /* El nativo se oculta solo cuando el punto ya está en su sitio */
      document.documentElement.classList.add('cursor-propio');
      var t = e.target && e.target.closest ? e.target : null;
      var enTexto = !!(t && t.closest(TEXTO));
      el.classList.toggle('visible', !enTexto);
      el.classList.toggle('sobre', !!(t && !enTexto && t.closest(INTERACTIVO)));
      b.pedir();
    }
    function pulsar(e) { mover(e); if (el) el.classList.add('pulsando'); }
    function soltarPulsacion() { if (el) el.classList.remove('pulsando'); }
    function ocultar() { if (el) el.classList.remove('visible'); }
    function escuchar(si) {
      var f = si ? 'addEventListener' : 'removeEventListener';
      window[f]('pointermove', mover, { passive: true });
      window[f]('pointerdown', pulsar, { passive: true });
      window[f]('pointerup', soltarPulsacion, { passive: true });
      document.documentElement[f]('pointerleave', ocultar);
      window[f]('blur', ocultar);
    }
    M.registrar('cursor', {
      activar: function () {
        el = document.createElement('div');
        el.className = 'cursor';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = '<span class="cursor-punto"></span>';
        document.body.appendChild(el);
        escuchar(true);
      },
      pausar: function () { escuchar(false); ocultar(); },
      reanudar: function () { escuchar(true); },
      desactivar: function () {
        escuchar(false); b.parar();
        document.documentElement.classList.remove('cursor-propio');
        if (el) el.remove();
        el = null;
      }
    }, { soloRaton: true });
  })();
})();
