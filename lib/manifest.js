/* =========================================================
   ELEVA PADEL CLUB — Datos editables por JS
   =========================================================
   Solo los campos que el sitio inyecta dinámicamente viven aquí.
   El resto del contenido (precios, torneo, equipo, etc.) está en
   el HTML y en lib/translations.js (i18n).
   Tras cualquier cambio: actualiza el ?v= de este <script> en index.html.
   ========================================================= */
(function () {
  window.__ELEVA__ = {

    brand: {
      phone:   '34659143103',   // número sin + ni espacios, ej: 34612345678
      address: 'Pasaje de Jerez S/N · 29560 Pizarra, Málaga',
      mapLat:  36.769391,
      mapLng:  -4.709363,
    },

    /* Rutas de imagen de la galería (índice = .gi-N en el HTML) */
    gallery: [
      'assets/img/gallery-01.jpg',
      'assets/img/gallery-02.jpg',
      'assets/img/gallery-03.jpg',
      'assets/img/gallery-04.jpg',
      'assets/img/gallery-05.jpg',
      'assets/img/gallery-06.jpg',
      'assets/img/gallery-07.jpg',
      'assets/img/gallery-08.jpg',
      'assets/img/gallery-09.jpg',
      'assets/img/gallery-10.jpg',
      'assets/img/gallery-11.jpg',
      'assets/img/gallery-12.jpg',
      'assets/img/gallery-13.jpg',
      'assets/img/gallery-14.jpg',
      'assets/img/gallery-15.jpg',
      'assets/img/gallery-16.jpg',
    ],

  };
})();
