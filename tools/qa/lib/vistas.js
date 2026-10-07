/* =========================================================
   Tamaños de pantalla y páginas de la batería
   ---------------------------------------------------------
   movil: true → táctil (isMobile + hasTouch, pointer: coarse).
   «zoom200» es el zoom del 200 % de un portátil de 1280×800:
   640×400 px CSS con densidad 2 y ratón.
   ========================================================= */
'use strict';

const VISTAS = [
  { nombre: '320x640', ancho: 320, alto: 640, movil: true, dpr: 2 },
  { nombre: '360x780', ancho: 360, alto: 780, movil: true, dpr: 2 },
  { nombre: '375x812', ancho: 375, alto: 812, movil: true, dpr: 2 },
  { nombre: '390x844', ancho: 390, alto: 844, movil: true, dpr: 2 },
  { nombre: '414x896', ancho: 414, alto: 896, movil: true, dpr: 2 },
  { nombre: '430x932', ancho: 430, alto: 932, movil: true, dpr: 2 },
  { nombre: '667x375-apaisado', ancho: 667, alto: 375, movil: true, dpr: 2 },
  { nombre: '844x390-apaisado', ancho: 844, alto: 390, movil: true, dpr: 2 },
  { nombre: '932x430-apaisado', ancho: 932, alto: 430, movil: true, dpr: 2 },
  { nombre: '768x1024', ancho: 768, alto: 1024, movil: true, dpr: 2 },
  { nombre: '1024x768-tableta', ancho: 1024, alto: 768, movil: true, dpr: 2 },
  { nombre: '820x1180', ancho: 820, alto: 1180, movil: true, dpr: 2 },
  { nombre: '1180x820', ancho: 1180, alto: 820, movil: true, dpr: 2 },
  { nombre: '1024x1366', ancho: 1024, alto: 1366, movil: true, dpr: 2 },
  { nombre: '1366x1024', ancho: 1366, alto: 1024, movil: true, dpr: 2 },
  { nombre: '1024x768', ancho: 1024, alto: 768, movil: false, dpr: 1 },
  { nombre: '1280x800', ancho: 1280, alto: 800, movil: false, dpr: 1 },
  { nombre: '1440x900', ancho: 1440, alto: 900, movil: false, dpr: 1 },
  { nombre: '1920x1080', ancho: 1920, alto: 1080, movil: false, dpr: 1 },
  { nombre: '2560x1440', ancho: 2560, alto: 1440, movil: false, dpr: 1 },
  { nombre: 'zoom200', ancho: 640, alto: 400, movil: false, dpr: 2 }
];

const vista = nombre => {
  const v = VISTAS.find(x => x.nombre === nombre);
  if (!v) throw new Error('Vista desconocida: ' + nombre);
  return v;
};

/* Páginas. «mantenimiento» se pide al servidor con MANTENIMIENTO=1. */
const PAGINAS = [
  { nombre: 'marca', ruta: '/', estado: 200, idiomas: true, cabecera: true },
  { nombre: 'pizarra', ruta: '/pizarra', estado: 200, idiomas: true, cabecera: true, reglaNombre: true },
  { nombre: 'privacidad', ruta: '/privacidad', estado: 200 },
  { nombre: '404', ruta: '/no-existe-qa', estado: 404 },
  { nombre: 'mantenimiento', ruta: '/pizarra', estado: 503, mantenimiento: true }
];

module.exports = { VISTAS, vista, PAGINAS };
