/* ================================================================
   Eleva Pádel — movimiento/tacto.js
   Lo que responde a pulsar: el dedo y también el clic y el teclado, para
   que nada dependa solo del hover.
   · giro  — cada insignia de los pools es un <button aria-pressed>: al
             pulsarla (toque, clic, Enter o Espacio) gira 180° y enseña
             detrás su nombre (el mismo texto del alt) con el color de la
             insignia; otra pulsación la devuelve. Con movimiento reducido
             el giro es un fundido (css/movimiento.css). Sin JS las
             insignias son imágenes normales y el reverso no se ve.
   · pulso — un toque sobre el hero (fuera de enlaces y botones, sin
             arrastrar) hace latir el logo una vez.
   ================================================================ */
(function () {
  'use strict';
  var M = window.ElevaMov;
  if (!M) return;
  var T = M.tokens;

  /* ── Giro de las insignias ─────────────────────────────────── */
  (function () {
    var giradas = {};               /* índices girados: se conservan al cambiar de idioma */
    var activo = false;

    /* El HTML generado trae <span class="insignia-pieza">; con JS pasa a ser
       un botón con el mismo contenido (se mueven los nodos: la imagen no se
       vuelve a descargar) y las mismas medidas: sin salto de maquetación. */
    function preparar() {
      var piezas = document.querySelectorAll('#pools .insignia-pieza');
      Array.prototype.forEach.call(piezas, function (p, i) {
        var b = p;
        if (p.tagName !== 'BUTTON') {
          b = document.createElement('button');
          b.type = 'button';
          b.className = p.className;
          while (p.firstChild) b.appendChild(p.firstChild);
          p.parentNode.replaceChild(b, p);
        }
        b.setAttribute('data-i', String(i));
        fijar(b, !!giradas[i]);
      });
    }
    function fijar(b, g) {
      b.setAttribute('aria-pressed', String(g));
      b.parentNode.classList.toggle('girada', g);
      giradas[b.getAttribute('data-i')] = g;
    }
    function alPulsar(e) {
      var b = e.target.closest && e.target.closest('#pools button.insignia-pieza');
      if (b) fijar(b, b.getAttribute('aria-pressed') !== 'true');
    }
    M.registrar('giro', {
      activar: function () { preparar(); document.addEventListener('click', alPulsar); activo = true; },
      reenganchar: function () { if (activo) preparar(); },
      desactivar: function () { document.removeEventListener('click', alPulsar); activo = false; }
    }, { conReducido: true });
  })();

  /* ── Pulso del logo del hero ───────────────────────────────── */
  (function () {
    var hero = null, pulso = null, anim = null;
    function tocar(e) {
      if (!pulso || !pulso.animate) return;
      if (e.target.closest && e.target.closest('a, button, input, textarea, select')) return;
      var t = T();
      if (anim) anim.cancel();
      anim = pulso.animate(
        [{ scale: 1 }, { scale: 1 + t.distPulso, offset: 0.35 }, { scale: 1 }],
        { duration: t.durLarga, easing: t.curvaSalida }
      );
    }
    function soltar() { if (hero) hero.removeEventListener('click', tocar); if (anim) anim.cancel(); }
    function enganchar() {
      soltar();
      hero = document.querySelector('.hero');
      pulso = document.querySelector('.hero-pulso');
      /* click: solo un toque, no el inicio de un arrastre o de un scroll */
      if (hero) hero.addEventListener('click', tocar);
    }
    M.registrar('pulso', {
      activar: enganchar, reenganchar: enganchar, reanudar: enganchar,
      pausar: soltar, desactivar: soltar
    }, { raiz: '.hero' });
  })();
})();
