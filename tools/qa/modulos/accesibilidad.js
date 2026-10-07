/* =========================================================
   Módulo «accesibilidad»
   ---------------------------------------------------------
   axe-core (versión fijada en package.json) con las reglas de
   WCAG 2.0/2.1/2.2 A y AA, en cada página a 390 px (táctil) y
   1440 px, con la página quieta tras recorrerla entera (las
   animaciones con fin terminadas). Fallan las infracciones de
   impacto «serious» y «critical».
   axe se inyecta con bypassCSP: la CSP del sitio ('self') no
   permite scripts añadidos; solo afecta a este contexto de prueba.
   ========================================================= */
'use strict';
const fs = require('fs');
const { vista, PAGINAS } = require('../lib/vistas');
const { opcionesContexto, estabilizar, recorrer } = require('../lib/pagina');

const AXE = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const ETIQUETAS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const GRAVES = ['serious', 'critical'];

function caso(pag, nombreVista, modo) {
  const id = ['accesibilidad', pag.nombre, nombreVista, modo].join(' · ');
  return {
    id,
    pagina: pag.nombre,
    rapido: nombreVista === '390x844' && modo === 'normal',
    async ejecutar(entorno) {
      const base = pag.mantenimiento ? entorno.baseMantenimiento : entorno.base;
      const ctx = await entorno.navegador.newContext(Object.assign(opcionesContexto(vista(nombreVista), modo), { bypassCSP: true, javaScriptEnabled: true }));
      try {
        const p = await ctx.newPage();
        await p.goto(base + pag.ruta, { waitUntil: 'load' });
        await estabilizar(p);
        await recorrer(p, async () => {});
        await estabilizar(p);
        await p.addScriptTag({ content: AXE });
        const r = await p.evaluate(async etiquetas => {
          const res = await window.axe.run(document, { runOnly: { type: 'tag', values: etiquetas }, resultTypes: ['violations'] });
          return res.violations.map(v => ({ id: v.id, impacto: v.impact, ayuda: v.help, nodos: v.nodes.map(n => n.target.join(' ')).slice(0, 4), total: v.nodes.length }));
        }, ETIQUETAS);
        const fallos = r.filter(v => GRAVES.includes(v.impacto)).map(v => ({
          tipo: 'axe ' + v.impacto, clave: v.id + ': ' + v.ayuda, detalle: v.total + ' nodos: ' + v.nodos.join(' | ')
        }));
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
  for (const pag of PAGINAS) for (const v of ['390x844', '1440x900']) lista.push(caso(pag, v, 'normal'));
  /* sin animaciones: cada texto en su estado final (contraste real) */
  for (const pag of PAGINAS.filter(p => p.idiomas)) for (const v of ['390x844', '1440x900']) lista.push(caso(pag, v, 'reducido'));
  return lista;
}

module.exports = {
  nombre: 'accesibilidad',
  descripcion: 'axe-core (WCAG 2.2 A/AA): infracciones graves y críticas',
  casos
};
