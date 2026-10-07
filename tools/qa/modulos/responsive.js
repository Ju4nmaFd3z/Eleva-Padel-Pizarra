/* =========================================================
   Módulo «responsive»
   ---------------------------------------------------------
   Cada caso abre una página en un tamaño, idioma y modo, la
   recorre entera pantalla a pantalla y en cada parada revisa
   (lib/en-pagina.js): desborde horizontal, contenido fuera de
   la vista, texto cortado, objetivos < 44 px y campos < 16 px.
   Además: cabecera sin solapes ni segunda línea, regla del
   nombre del club (< 408 px oculto, con y sin JS), menú y
   selector de idioma abiertos, idioma aplicado, y el registro
   de la página (consola, errores, peticiones, CSP, terceros).
   ========================================================= */
'use strict';
const { VISTAS, vista, PAGINAS } = require('../lib/vistas');
const { abrir, estabilizar, recorrer, problemasDeRegistro, agrupar } = require('../lib/pagina');
const { revisarVista, revisarCabecera, revisarRetirados } = require('../lib/en-pagina');

/* Objetivos: 44 px en táctil (regla del proyecto); con ratón, 24 px con la
   excepción de espaciado de WCAG 2.5.8 */
const objetivos = (v, modo) => Object.assign(v.movil ? { minObjetivo: 44, espaciado: false } : { minObjetivo: 24, espaciado: true }, { anchoVista: v.ancho, sinJs: modo === 'sinjs' });

/* Tamaños con cobertura extra (idiomas y modos) */
const EXTRA_IDIOMAS = ['320x640', '390x844', '1440x900'];
const EXTRA_MODOS = ['390x844', '1440x900'];
const SINJS_ESTRECHAS = ['320x640', '414x896', 'zoom200'];
const RAPIDAS = ['320x640', '390x844', '844x390-apaisado', '1440x900', 'zoom200'];

async function revisarDesplegables(p, pag, v) {
  const prob = [];
  /* Menú móvil abierto */
  const hayMenu = await p.evaluate(() => { const b = document.querySelector('.menu-boton'); return !!b && b.getBoundingClientRect().width > 0; });
  if (hayMenu) {
    await p.click('.menu-boton');
    await estabilizar(p);
    const abierto = await p.evaluate(() => document.querySelector('.menu-boton').getAttribute('aria-expanded'));
    if (abierto !== 'true') prob.push({ tipo: 'menu', clave: 'no se abre con un clic', detalle: 'aria-expanded=' + abierto });
    for (const x of await p.evaluate(revisarVista, objetivos(v, 'normal'))) prob.push(Object.assign(x, { tipo: x.tipo + ' (menú abierto)' }));
    for (const x of await p.evaluate(revisarCabecera, { reglaNombre: !!pag.reglaNombre, anchoVista: v.ancho })) prob.push(Object.assign(x, { tipo: x.tipo + ' (menú abierto)' }));
    await p.click('.menu-boton');
    await estabilizar(p);
  }
  /* Selector de idioma abierto */
  const haySelector = await p.evaluate(() => { const b = document.querySelector('.idioma-boton'); return !!b && b.getBoundingClientRect().width > 0; });
  if (haySelector) {
    await p.click('.idioma-boton');
    await estabilizar(p);
    for (const x of await p.evaluate(revisarVista, objetivos(v, 'normal'))) prob.push(Object.assign(x, { tipo: x.tipo + ' (idiomas abiertos)' }));
    await p.keyboard.press('Escape');
    await estabilizar(p);
  }
  return prob;
}

function caso(v, pag, lang, modo, rapido) {
  const id = ['responsive', pag.nombre, v.nombre, lang, modo].join(' · ');
  return {
    id,
    pagina: pag.nombre,
    rapido,
    async ejecutar(entorno) {
      const base = pag.mantenimiento ? entorno.baseMantenimiento : entorno.base;
      const { ctx, p, registro } = await abrir(entorno.navegador, { vista: v, modo, lang: lang === 'es' ? null : lang, base });
      try {
        const prob = [];
        await p.goto(base + pag.ruta, { waitUntil: 'load' });
        const pendientes = await estabilizar(p);
        if (pendientes) prob.push({ tipo: 'animacion-sin-fin', clave: pendientes.join(', '), detalle: 'siguen en marcha a los 6 s de cargar' });
        if (pag.idiomas && modo !== 'sinjs') {
          const l = await p.evaluate(() => document.documentElement.lang);
          if (l !== lang) prob.push({ tipo: 'idioma', clave: 'lang=' + l, detalle: 'se esperaba ' + lang });
        }
        if (pag.cabecera) prob.push(...await p.evaluate(revisarCabecera, { reglaNombre: !!pag.reglaNombre, anchoVista: v.ancho, sinJs: modo === 'sinjs' }));
        await recorrer(p, async () => { prob.push(...await p.evaluate(revisarVista, objetivos(v, modo))); });
        prob.push(...await p.evaluate(revisarRetirados, { sinJs: modo === 'sinjs' }));
        if (pag.cabecera && modo !== 'sinjs') {
          /* Si algo tapa el botón (p. ej. una cabecera solapada), el clic no llega:
             es un fallo más, sin perder los ya encontrados */
          try { prob.push(...await revisarDesplegables(p, pag, v)); } catch (e) {
            prob.push({ tipo: 'desplegables', clave: 'no se pueden abrir el menú o el selector de idioma', detalle: String(e.message).split('\n')[0] });
          }
        }
        prob.push(...await problemasDeRegistro(p, registro, { esperado: pag.estado }));
        const fallos = agrupar(prob);
        if (fallos.length) await entorno.capturar(p, id);
        return fallos;
      } finally {
        await ctx.close();
      }
    }
  };
}

function casos() {
  const lista = [];
  for (const v of VISTAS) for (const pag of PAGINAS) {
    lista.push(caso(v, pag, 'es', 'normal', RAPIDAS.includes(v.nombre)));
  }
  for (const n of EXTRA_IDIOMAS) for (const pag of PAGINAS.filter(x => x.idiomas)) for (const lang of ['en', 'nl']) {
    lista.push(caso(vista(n), pag, lang, 'normal', n === '390x844'));
  }
  for (const n of EXTRA_MODOS) {
    for (const pag of PAGINAS) {
      lista.push(caso(vista(n), pag, 'es', 'reducido', false));
      lista.push(caso(vista(n), pag, 'es', 'sinjs', n === '390x844'));
    }
    for (const pag of PAGINAS.filter(x => x.idiomas)) for (const lang of ['en', 'nl']) lista.push(caso(vista(n), pag, lang, 'reducido', false));
  }
  for (const n of SINJS_ESTRECHAS) for (const pag of PAGINAS.filter(x => x.cabecera)) {
    lista.push(caso(vista(n), pag, 'es', 'sinjs', n === '320x640'));
  }
  return lista;
}

module.exports = {
  nombre: 'responsive',
  descripcion: 'tamaños, idiomas, sin JS, movimiento reducido y zoom 200 %: desbordes, cortes, objetivos, cabecera y registro',
  casos
};
