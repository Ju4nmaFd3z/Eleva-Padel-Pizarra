/* =========================================================
   Módulo «interaccion»
   ---------------------------------------------------------
   Comportamientos con teclado, ratón y táctil que antes se
   probaban con guiones sueltos (teclado.js, foco.js,
   estados.js, abanico2.js, ancla.js, singpu.js):
   · selector de idioma con teclado y ratón;
   · menú móvil: apertura, foco en ciclo, Escape, paso a escritorio;
   · orden y visibilidad del foco en la cabecera;
   · giro de las insignias con teclado y tras cambiar de idioma;
   · abanico de los pools: ninguna insignia sale de su celda;
   · idioma: solo se guarda al elegirlo y se recuerda entre / y
     /pizarra (también al volver atrás);
   · sin JS: menú desplegado y selector oculto;
   · entrada por ancla y equipos sin GPU: la pista 3D no se pide.
   ========================================================= */
'use strict';
const { vista } = require('../lib/vistas');
const { abrir, estabilizar, problemasDeRegistro } = require('../lib/pagina');

/* Abre una página, ejecuta fn(p, f) y añade el registro (consola, errores…) */
function caso(id, pagina, rapido, opciones, fn) {
  return {
    id: 'interaccion · ' + id,
    pagina,
    rapido,
    limiteMs: opciones.limiteMs,
    async ejecutar(entorno) {
      const { ctx, p, registro } = await abrir(entorno.navegador, { vista: vista(opciones.vista), modo: opciones.modo || 'normal', base: entorno.base });
      const f = [];
      const comprobar = (ok, clave, detalle) => { if (!ok) f.push({ tipo: id.split(' · ')[0], clave, detalle: detalle === undefined ? '' : String(detalle) }); };
      try {
        await p.goto(entorno.base + opciones.ruta, { waitUntil: 'load' });
        await estabilizar(p);
        await fn(p, comprobar, entorno);
        f.push(...await problemasDeRegistro(p, registro, { esperado: 200 }));
        if (f.length) await entorno.capturar(p, 'interaccion · ' + id);
        return f;
      } finally {
        await ctx.close();
      }
    }
  };
}

const foco = p => p.evaluate(() => {
  const a = document.activeElement;
  return a ? (a.getAttribute('data-lang') || (a.className && String(a.className).split(' ')[0]) || a.tagName) : null;
});
const selector = p => p.evaluate(() => ({
  abierto: document.querySelector('.idioma-boton').getAttribute('aria-expanded'),
  oculta: document.querySelector('.idioma-lista').hidden,
  lang: document.documentElement.lang,
  actual: (document.querySelector('.idioma[aria-current="true"]') || {}).dataset?.lang || null
}));

function selectorIdioma(pagina, ruta) {
  return caso('selector-idioma · ' + pagina + ' · 1440x900', pagina, true, { vista: '1440x900', ruta }, async (p, ok) => {
    await p.focus('.idioma-boton');
    await p.keyboard.press('Enter');
    let s = await selector(p);
    ok(s.abierto === 'true' && !s.oculta, 'Enter no abre la lista', JSON.stringify(s));
    ok(await foco(p) === 'es', 'Enter: el foco no va a la opción actual', await foco(p));
    const pasos = [['ArrowDown', 'en'], ['ArrowDown', 'nl'], ['ArrowDown', 'es'], ['ArrowUp', 'nl'], ['Home', 'es'], ['End', 'nl']];
    for (const [k, esperado] of pasos) {
      await p.keyboard.press(k);
      const fx = await foco(p);
      ok(fx === esperado, k + ': el foco no pasa a ' + esperado, fx);
    }
    await p.keyboard.press('Escape');
    s = await selector(p);
    ok(s.abierto === 'false' && s.oculta, 'Escape no cierra la lista', JSON.stringify(s));
    ok(await foco(p) === 'idioma-boton', 'Escape no devuelve el foco al botón', await foco(p));
    await p.keyboard.press('ArrowDown');
    ok((await selector(p)).abierto === 'true', 'flecha abajo en el botón no abre la lista');
    await p.keyboard.press('ArrowDown');
    await p.keyboard.press('Enter');
    s = await selector(p);
    ok(s.lang === 'en' && s.actual === 'en' && s.abierto === 'false', 'elegir EN con Enter no aplica el idioma o no cierra', JSON.stringify(s));
    ok(await foco(p) === 'idioma-boton', 'tras elegir, el foco no vuelve al botón', await foco(p));
    ok(await p.evaluate(() => localStorage.getItem('eleva-lang')) === 'en', 'el idioma elegido no se guarda');
    await p.keyboard.press(' ');
    ok((await selector(p)).abierto === 'true' && await foco(p) === 'en', 'Espacio no abre con el foco en la opción actual', await foco(p));
    await p.keyboard.press('Tab');
    ok((await selector(p)).abierto === 'false', 'Tab no cierra la lista');
    await p.click('.idioma-boton');
    ok((await selector(p)).abierto === 'true', 'el clic no abre la lista');
    await p.mouse.click(5, 600);
    ok((await selector(p)).abierto === 'false', 'el clic fuera no cierra la lista');
  });
}

function menuMovil() {
  return caso('menu-movil · pizarra · 390x844', 'pizarra', true, { vista: '390x844', ruta: '/pizarra' }, async (p, ok) => {
    const estado = () => p.evaluate(() => ({
      exp: document.querySelector('.menu-boton').getAttribute('aria-expanded'),
      abierto: document.getElementById('menu').classList.contains('abierto'),
      bloqueo: document.body.classList.contains('sin-scroll'),
      foco: document.activeElement && (document.activeElement.closest('#menu') ? 'menu' : document.activeElement.classList.contains('menu-boton') ? 'boton' : 'fuera')
    }));
    await p.focus('.menu-boton');
    await p.keyboard.press('Enter');
    let s = await estado();
    ok(s.exp === 'true' && s.abierto && s.bloqueo, 'Enter no abre el menú (o no bloquea el scroll)', JSON.stringify(s));
    ok(s.foco === 'menu', 'al abrir, el foco no va al menú', s.foco);
    const n = await p.evaluate(() => document.querySelectorAll('#menu a[href]').length);
    for (let i = 0; i < n + 2; i++) {
      await p.keyboard.press('Tab');
      const fx = (await estado()).foco;
      ok(fx !== 'fuera', 'Tab saca el foco del menú abierto (paso ' + (i + 1) + ')', fx);
    }
    await p.keyboard.press('Shift+Tab');
    ok((await estado()).foco !== 'fuera', 'Shift+Tab saca el foco del menú abierto');
    await p.keyboard.press('Escape');
    s = await estado();
    ok(s.exp === 'false' && !s.abierto && !s.bloqueo, 'Escape no cierra el menú', JSON.stringify(s));
    ok(s.foco === 'boton', 'Escape no devuelve el foco al botón', s.foco);
    await p.click('.menu-boton');
    ok((await estado()).abierto, 'el clic no abre el menú');
    await p.click('#menu a[href="#pools"]');
    await estabilizar(p);
    s = await estado();
    ok(!s.abierto && !s.bloqueo, 'tocar un enlace no cierra el menú', JSON.stringify(s));
    await p.click('.menu-boton');
    await p.setViewportSize({ width: 1100, height: 844 });
    await estabilizar(p);
    s = await estado();
    ok(!s.abierto && !s.bloqueo && s.exp === 'false', 'al pasar a escritorio con el menú abierto no se cierra', JSON.stringify(s));
  });
}

function ordenFoco(pagina, ruta) {
  return caso('orden-foco · ' + pagina + ' · 1440x900', pagina, false, { vista: '1440x900', ruta }, async (p, ok) => {
    await p.keyboard.press('Tab');
    const primero = await p.evaluate(() => document.activeElement.className);
    ok(/\bsaltar\b/.test(primero), 'el primer Tab no va a «Saltar al contenido»', primero);
    const visibleSaltar = await p.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width > 1; });
    ok(visibleSaltar, '«Saltar al contenido» no se ve al enfocarlo');
    let x = -1;
    for (let i = 0; i < 12; i++) {
      await p.keyboard.press('Tab');
      const d = await p.evaluate(() => {
        const a = document.activeElement;
        const cs = getComputedStyle(a);
        const r = a.getBoundingClientRect();
        return { cab: !!a.closest('.cabecera'), x: r.left, nombre: (a.textContent || a.className).trim().slice(0, 20), anillo: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none' };
      });
      if (!d.cab) break;
      ok(d.x > x, 'el foco no avanza de izquierda a derecha en la cabecera', d.nombre + ' @' + Math.round(d.x));
      ok(d.anillo, 'sin indicador de foco visible', d.nombre);
      x = d.x;
    }
  });
}

function insigniasTeclado() {
  return caso('insignias-teclado · pizarra · 1440x900', 'pizarra', true, { vista: '1440x900', ruta: '/pizarra' }, async (p, ok) => {
    const n0 = await p.$$eval('#pools button.insignia-pieza', l => l.length);
    ok(n0 > 0, 'las insignias no son botones con JS', n0);
    if (!n0) return;
    const pz = p.locator('#pools button.insignia-pieza').first();
    await pz.focus();
    await p.keyboard.press('Enter');
    ok(await pz.getAttribute('aria-pressed') === 'true', 'Enter no gira la insignia');
    await p.keyboard.press(' ');
    ok(await pz.getAttribute('aria-pressed') === 'false', 'Espacio no la vuelve a girar');
    await p.keyboard.press('Enter');
    await p.click('.idioma-boton');
    await p.click('.idioma[data-lang="nl"]');
    await estabilizar(p);
    const n1 = await p.$$eval('#pools button.insignia-pieza', l => l.length);
    ok(n1 === n0, 'tras cambiar a NL cambia el número de insignias-botón', n0 + ' → ' + n1);
    ok(await p.locator('#pools button.insignia-pieza').first().getAttribute('aria-pressed') === 'true', 'tras cambiar de idioma la insignia girada pierde el giro');
  });
}

/* Abanico: el centro de cada insignia no sale de su celda (≤ 0,5 celdas) en
   25 posiciones de scroll alrededor de la lista */
function abanico(nombreVista) {
  const v = vista(nombreVista);
  return caso('abanico · pizarra · ' + nombreVista, 'pizarra', nombreVista === '1440x900' || nombreVista === '390x844', { vista: nombreVista, ruta: '/pizarra' }, async (p, ok) => {
    const top = await p.evaluate(() => document.querySelector('.insignias').getBoundingClientRect().top + scrollY);
    let max = 0, fuera = 0;
    for (let k = 0; k <= 24; k++) {
      await p.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), Math.max(0, top - v.alto + k * v.alto / 20));
      await estabilizar(p);
      /* Celda = posición de maquetación del <li> (offset*, sin transformaciones),
         sin tocar las animaciones que mueve el scroll */
      const d = await p.evaluate(() => [...document.querySelectorAll('.insignias')].flatMap(ul => {
        const ru = ul.getBoundingClientRect();
        return [...ul.querySelectorAll('.insignia')].map(li => {
          const pz = li.querySelector('.insignia-pieza').getBoundingClientRect();
          const cx = ru.left + ul.clientLeft + (li.offsetLeft - ul.offsetLeft) + li.offsetWidth / 2;
          const cy = ru.top + ul.clientTop + (li.offsetTop - ul.offsetTop) + li.offsetHeight / 2;
          return Math.hypot((pz.left + pz.width / 2) - cx, (pz.top + pz.height / 2) - cy) / li.offsetWidth;
        });
      }));
      d.forEach(x => { max = Math.max(max, x); if (x > 0.5) fuera++; });
    }
    ok(fuera === 0, 'insignias cuyo centro sale de su celda', fuera + ' (desplazamiento máx. ' + max.toFixed(2) + ' celdas)');
  });
}

function idiomaRecordado() {
  return caso('idioma-recordado · pizarra y marca · 390x844', 'pizarra', true, { vista: '390x844', ruta: '/pizarra' }, async (p, ok, entorno) => {
    ok(await p.evaluate(() => localStorage.getItem('eleva-lang')) === null, 'se guarda el idioma sin que el usuario lo elija');
    await p.click('.idioma-boton');
    await p.click('.idioma[data-lang="en"]');
    await p.goto(entorno.base + '/', { waitUntil: 'load' });
    await estabilizar(p);
    ok(await p.evaluate(() => document.documentElement.lang) === 'en', 'la marca no recuerda el idioma elegido en /pizarra');
    await p.goBack({ waitUntil: 'load' });
    await estabilizar(p);
    ok(await p.evaluate(() => document.documentElement.lang) === 'en', 'al volver atrás /pizarra no está en el idioma elegido');
    await p.click('.idioma-boton');
    await p.click('.idioma[data-lang="es"]');
    await p.reload({ waitUntil: 'load' });
    ok(await p.evaluate(() => document.documentElement.lang) === 'es', 'volver a ES no se recuerda');
  });
}

function sinJs(pagina, ruta, nombreVista) {
  return caso('sin-js · ' + pagina + ' · ' + nombreVista, pagina, true, { vista: nombreVista, ruta, modo: 'sinjs' }, async (p, ok) => {
    const d = await p.evaluate(() => {
      const vis = e => !!e && e.getBoundingClientRect().width > 1 && getComputedStyle(e).visibility === 'visible';
      return {
        selector: vis(document.querySelector('.idioma-selector')),
        boton: vis(document.querySelector('.menu-boton')),
        enlaces: [...document.querySelectorAll('.cabecera .menu a[href]')].filter(a => !a.closest('[hidden]')).map(a => vis(a))
      };
    });
    ok(!d.selector, 'sin JS se ve el selector de idioma');
    ok(!d.boton, 'sin JS se ve el botón de menú');
    ok(d.enlaces.every(Boolean), 'sin JS el menú no se ve desplegado', d.enlaces.filter(x => !x).length + ' enlaces ocultos');
  });
}

/* La pista 3D no se pide: al entrar por un ancla, ni en equipos sin GPU
   (el Chromium sin interfaz de la batería usa SwiftShader). */
function sinPista(id, ruta, gesto) {
  return caso(id + ' · pizarra · 1440x900', 'pizarra', false, { vista: '1440x900', ruta, limiteMs: 60000 }, async (p, ok) => {
    const pedidas = [];
    p.on('request', r => { if (/\/lib\/three\/|pista\.js/.test(r.url())) pedidas.push(r.url().split('/').pop()); });
    if (ruta.includes('#')) ok(await p.evaluate(() => scrollY) > 0, 'al entrar por el ancla la página no baja');
    if (gesto) { await p.mouse.move(300, 300); await p.mouse.wheel(0, 10); }
    await p.waitForTimeout(7000); /* el 3D se crea como tarde a los 6 s */
    ok(!pedidas.length, 'se pide la pista 3D', pedidas.join(', '));
    ok(await p.evaluate(() => !!(window.ElevaTresD && window.ElevaTresD.estado().cargada)) === false, 'la pista 3D se ha creado');
  });
}

function casos() {
  return [
    selectorIdioma('pizarra', '/pizarra'),
    selectorIdioma('marca', '/'),
    menuMovil(),
    ordenFoco('pizarra', '/pizarra'),
    ordenFoco('marca', '/'),
    insigniasTeclado(),
    ...['320x640', '390x844', '768x1024', '844x390-apaisado', '1024x768', '1280x800', '1440x900', '1920x1080'].map(abanico),
    idiomaRecordado(),
    sinJs('pizarra', '/pizarra', '390x844'),
    sinJs('pizarra', '/pizarra', '320x640'),
    sinJs('marca', '/', '390x844'),
    sinPista('ancla-sin-3d', '/pizarra#contacto', false),
    sinPista('sin-gpu', '/pizarra', true)
  ];
}

module.exports = {
  nombre: 'interaccion',
  descripcion: 'teclado, foco, menú, selector de idioma, insignias, abanico, idioma recordado, sin JS y carga del 3D',
  casos
};
