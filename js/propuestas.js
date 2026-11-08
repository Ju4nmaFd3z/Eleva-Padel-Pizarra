/* ================================================================
   Eleva Pádel — propuestas.js (SOLO PARA LA PREVIEW DE PROPUESTAS)
   Conmuta las propuestas en revisión con parámetros de URL, sin tocar el
   estado por defecto: ?marron=1|2|3 (color del scroll) y ?cancel=1|2
   (Política de cancelaciones); 0 vuelve al actual. La elección se recuerda
   en la pestaña (sessionStorage) al pasar entre / y /pizarra. Se carga en
   <head> sin defer para que no haya un primer pintado con la versión
   anterior. Desaparece al integrar la propuesta elegida.
   ================================================================ */
(function () {
  'use strict';
  var html = document.documentElement;
  var q = new URLSearchParams(location.search);
  ['marron', 'cancel'].forEach(function (k) {
    var v = q.get(k);
    try {
      if (v !== null) sessionStorage.setItem('eleva-propuesta-' + k, v);
      else v = sessionStorage.getItem('eleva-propuesta-' + k);
    } catch (e) { /* sin almacenamiento: solo el parámetro */ }
    if (v && /^[1-3]$/.test(v)) html.setAttribute('data-' + k, v);
  });
})();
