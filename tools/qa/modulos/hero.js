/* =========================================================
   Módulo «hero»: la máscara del logo del hero de /pizarra
   ---------------------------------------------------------
   Regresión del fallo intermitente del hero (pista fuera del
   triángulo, bloques negros, barra del logo desplazada):
   escenarios de lib/hero-escenarios.js en cinco dispositivos
   (1920, 1440 y 1280 con ratón; 390 y 360 táctiles), con el
   oráculo de lib/hero.js (geometría según el CSS y muestreo
   de la captura). Un caso = un escenario en un dispositivo.

   Repeticiones por caso: QA_HERO_REP (1 por defecto). La QA
   final lo pasa con 50:
     QA_HERO_REP=50 node tools/qa/bateria.js --modulo hero
   Cada repetición usa su propia semilla (tiempos aleatorios
   reproducibles: el fallo indica la semilla).
   ========================================================= */
'use strict';
const E = require('../lib/hero-escenarios');

const REP = Math.max(1, Number(process.env.QA_HERO_REP) || 1);
/* En --rapido: los escenarios que más estresan la máscara, en un
   escritorio y un móvil */
const RAPIDOS = new Set(['frio', 'recarga', 'gpu-justa', 'webgl-perdido', 'dpr-zoom']);
const DISP_RAPIDOS = new Set(['e1920', 'm390']);

function casos() {
  const lista = [];
  for (const esc of Object.keys(E.ESCENARIOS)) {
    for (const d of Object.keys(E.DISPOSITIVOS)) {
      lista.push({
        id: 'hero · ' + esc + ' · ' + d,
        pagina: 'pizarra',
        rapido: RAPIDOS.has(esc) && DISP_RAPIDOS.has(d),
        limiteMs: 90000 * REP,
        async ejecutar(entorno) {
          const navegadores = clave => entorno.lanzar('hero-' + clave, E.opcionesLanzar(clave));
          const fallos = [];
          for (let i = 0; i < REP; i++) {
            const semilla = 1 + i * 7919 + esc.length * 31 + d.length;
            const r = await E.ejecutar(navegadores, { escenario: esc, dispositivo: d, semilla, base: entorno.base });
            r.fallos.forEach(f => fallos.push(Object.assign({}, f, {
              detalle: (f.detalle ? f.detalle + ' · ' : '') + 'semilla ' + semilla + (REP > 1 ? ' (rep. ' + (i + 1) + '/' + REP + ')' : '')
            })));
          }
          return fallos;
        }
      });
    }
  }
  return lista;
}

module.exports = { nombre: 'hero', descripcion: 'escenarios de carga del hero de /pizarra (máscara del logo y pista 3D)', casos };
