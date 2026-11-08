/* ================================================================
   Eleva Pádel — idioma.js
   Va en el <head> de cada página, SIN defer (archivo propio: la CSP no
   admite scripts inline). Decide el idioma antes de la primera pintura:
   · el elegido por el usuario (localStorage `eleva-lang`, solo se guarda
     cuando elige en el selector);
   · si no eligió nunca: el primero de los idiomas del navegador que sea
     ES, EN o NL; si es EN o NL, ese; si no, español;
   · sin almacenamiento (ventana privada que lanza): igual, sin errores.
   Si no es español, pone <html lang> y la clase i18n-pendiente, que
   esconde (visibility, sin mover nada) los textos traducibles hasta que
   main.js los cambia: no se ve un destello en español. Si main.js no
   llega a hacerlo en 1,5 s, se muestran en español con lang="es".
   Sin JS no pasa nada de esto: la página se ve en español.
   ================================================================ */
(function () {
  'use strict';

  var CLAVE = 'eleva-lang';
  var IDIOMAS = ['es', 'en', 'nl'];
  var html = document.documentElement;

  function valido(l) { return IDIOMAS.indexOf(l) > -1; }
  function guardado() {
    try { var l = window.localStorage.getItem(CLAVE); return valido(l) ? l : null; } catch (e) { return null; }
  }
  function guardar(l) {
    try { window.localStorage.setItem(CLAVE, l); } catch (e) { /* sin almacenamiento: no se recuerda */ }
  }
  function delNavegador() {
    var lista = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < lista.length; i++) {
      var l = String(lista[i] || '').toLowerCase().split('-')[0];
      if (valido(l)) return l;
    }
    return 'es';
  }

  var inicial = guardado() || delNavegador();
  if (inicial !== 'es') {
    html.setAttribute('lang', inicial);
    html.classList.add('i18n-pendiente');
    setTimeout(function () {
      if (!html.classList.contains('i18n-pendiente')) return;
      html.classList.remove('i18n-pendiente');
      html.setAttribute('lang', 'es');
    }, 1500);
  }

  window.ElevaIdioma = {
    idiomas: IDIOMAS,
    inicial: inicial,
    guardado: guardado,
    guardar: guardar,
    /* main.js: los textos ya están en el idioma activo */
    listo: function () { html.classList.remove('i18n-pendiente'); }
  };
})();
