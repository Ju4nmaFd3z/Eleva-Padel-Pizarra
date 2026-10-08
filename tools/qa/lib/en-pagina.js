/* =========================================================
   Comprobaciones que se ejecutan DENTRO de la página
   ---------------------------------------------------------
   Funciones autocontenidas: Playwright las serializa y las
   evalúa en el navegador (no pueden usar nada de fuera).
   Cada una devuelve una lista de problemas { tipo, clave,
   detalle }: «clave» identifica el elemento (para agrupar el
   mismo problema visto en varias posiciones de scroll) y
   «detalle» lleva la medida.
   ========================================================= */
'use strict';

/* Revisa lo que está en la pantalla en este momento:
   · desborde horizontal del documento (scrollWidth);
   · contenido visible fuera de la vista por los lados;
   · texto recortado por una caja con overflow distinto de visible;
   · objetivos interactivos de menos de opc.minObjetivo px;
   · campos de formulario con letra de menos de 16 px. */
function revisarVista(opc) {
  /* En emulación móvil un desborde ensancha la vista: se mide contra el ancho pedido */
  const W = Math.min(document.documentElement.clientWidth, opc.anchoVista || Infinity);
  const H = innerHeight;
  const TOL = 2; /* px: medio píxel de redondeo y el remate de algunas letras */
  const salida = [];

  const desc = e => {
    let s = e.tagName.toLowerCase();
    if (e.id) s += '#' + e.id;
    const cl = (typeof e.className === 'string' ? e.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cl.length) s += '.' + cl.join('.');
    /* Destino de enlaces y controles: identifica el elemento aunque otro
       repita su texto y su medida (dos «Aviso Legal» con distinto destino) */
    const destino = e.getAttribute('href') || e.getAttribute('aria-controls') || e.getAttribute('name') || e.getAttribute('data-lang');
    if (destino && e.matches('a, button, input, select, textarea')) s += '[' + destino.slice(0, 60) + ']';
    const t = (e.textContent || e.getAttribute('aria-label') || e.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    return t ? s + ' «' + t + '»' : s;
  };
  const opacidad = e => {
    let o = 1;
    for (let a = e; a && a.nodeType === 1; a = a.parentElement) o *= parseFloat(getComputedStyle(a).opacity);
    return o;
  };
  /* Retirado a propósito: fuera del árbol accesible y visual (hidden, aria-hidden,
     inert…), sin caja o con el patrón «solo lectores de pantalla» */
  const retirado = e => {
    if (e.closest('[hidden], [aria-hidden="true"], [inert], template, noscript')) return true;
    const cs = getComputedStyle(e);
    if (cs.display === 'none') return true;
    const r = e.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) return true;
    return cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)';
  };
  /* Invisible aunque ocupa su sitio: visibility o opacidad efectiva ~0 */
  const invisible = e => getComputedStyle(e).visibility !== 'visible' || opacidad(e) < 0.05;
  /* Ocultaciones previstas por el diseño (no son fallos): sin JS, el selector
     de idioma (necesita JS; <noscript> lo oculta); el menú móvil cerrado (su
     botón está a la vista con aria-expanded=false). Repetido en revisarVista y
     revisarRetirados: cada función se evalúa sola dentro de la página. */
  const permitido = e => {
    if (opc.sinJs && e.closest('.idioma-selector')) return true;
    const b = document.querySelector('.menu-boton');
    return !!e.closest('#menu') && !!b && b.getBoundingClientRect().width > 0 && b.getAttribute('aria-expanded') === 'false';
  };
  const enPantalla = r => r.bottom > 0 && r.top < H;
  /* Caja que encierra el texto propio del elemento (sus nodos de texto directos) */
  const cajaTexto = e => {
    let caja = null;
    for (const n of e.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const rg = document.createRange();
      rg.selectNodeContents(n);
      for (const r of rg.getClientRects()) {
        if (r.width === 0) continue;
        caja = caja ? { left: Math.min(caja.left, r.left), right: Math.max(caja.right, r.right), top: Math.min(caja.top, r.top), bottom: Math.max(caja.bottom, r.bottom) } : { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      }
    }
    return caja;
  };
  /* Antepasado con desplazamiento propio (carrusel, lista con scroll):
     ahí estar fuera de la vista es intencionado */
  /* Solo cuenta si es una región accesible: se alcanza con el teclado
     (tabindex ≥ 0) y tiene nombre (aria-label o aria-labelledby). Una tabla de
     datos que se desplaza así cumple WCAG 1.4.10; sin eso, es un desborde más. */
  const enContenedorConScroll = e => {
    for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (/(auto|scroll)/.test(cs.overflowX + cs.overflowY) && (a.scrollWidth > a.clientWidth + 1 || a.scrollHeight > a.clientHeight + 1)) {
        return a.tabIndex >= 0 && a.hasAttribute('tabindex') && (a.hasAttribute('aria-label') || a.hasAttribute('aria-labelledby'));
      }
    }
    return false;
  };

  /* Efectos ligados al scroll (animaciones sd-* y progreso del hero que mueve js/movimiento/scroll.js)
     fuera de su posición de reposo: el elemento está, a propósito, de camino.
     Reposo = 0 en los de salida (sd-hero-*, sd-corte-*) y = final en los de
     entrada (abanico, precios, títulos). En reposo se revisa como todo lo demás,
     y el estado estático completo lo cubren los casos sin JS y con movimiento
     reducido. */
  const cacheEfecto = new Map();
  const deCamino = a => {
    if (cacheEfecto.has(a)) return cacheEfecto.get(a);
    /* El hero se mueve con una variable de progreso (--p-hero, que escribe
       scroll.js), no con animaciones: reposo = 0 */
    let si = a.matches && a.matches('.hero, .marca-hero') && (parseFloat(getComputedStyle(a).getPropertyValue('--p-hero')) || 0) > 0.001;
    for (const an of (a.getAnimations ? a.getAnimations() : [])) {
      const nombre = an.animationName || '';
      if (nombre.indexOf('sd-') !== 0 || !an.effect) continue;
      const fin = an.effect.getComputedTiming().endTime || 1;
      const prog = (Number(an.currentTime) || 0) / fin;
      const reposo = /^sd-(hero|corte)/.test(nombre) ? 0 : 1;
      if (Math.abs(prog - reposo) > 0.001) { si = true; break; }
    }
    cacheEfecto.set(a, si);
    return si;
  };
  const enEfectoScroll = e => {
    for (let a = e; a && a.nodeType === 1; a = a.parentElement) if (deCamino(a)) return true;
    return false;
  };

  /* Caja que se ve aunque no tenga texto: fondo, imagen de fondo o borde */
  const cajaVisible = e => {
    const cs = getComputedStyle(e);
    const fondo = cs.backgroundImage !== 'none' || !/^(rgba\(0, 0, 0, 0\)|transparent)$/.test(cs.backgroundColor);
    const borde = ['Top', 'Right', 'Bottom', 'Left'].some(l => parseFloat(cs['border' + l + 'Width']) > 0 && cs['border' + l + 'Style'] !== 'none');
    return fondo || borde;
  };

  /* 1. Desborde horizontal del documento */
  const sw = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0);
  if (sw > W) salida.push({ tipo: 'desborde-horizontal', clave: 'documento', detalle: 'scrollWidth ' + sw + ' > ' + W });

  const objetivos = [];
  const todos = document.body ? document.body.querySelectorAll('*') : [];
  for (const e of todos) {
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|BR|WBR|svg|path|use|g|symbol|defs)$/i.test(e.tagName)) continue;
    /* fuera de la pantalla en vertical: se revisa en otro paso del scroll */
    if (!enPantalla(e.getBoundingClientRect())) continue;
    const interactivo = e.matches('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], summary');
    const tieneTexto = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    const medio = /^(IMG|PICTURE|VIDEO|CANVAS|IFRAME)$/.test(e.tagName);
    const conCaja = !interactivo && !tieneTexto && !medio && cajaVisible(e);
    if (!interactivo && !tieneTexto && !medio && !conCaja) continue;
    if (retirado(e)) continue;
    const r = e.getBoundingClientRect();
    if (!enPantalla(r)) continue;

    /* 1b. Contenido que debería verse y no se ve (opacidad 0, visibility hidden) */
    if (invisible(e)) {
      if ((tieneTexto || interactivo || (medio && e.getAttribute('alt'))) && !enEfectoScroll(e) && !permitido(e)) {
        salida.push({ tipo: 'contenido-invisible', clave: desc(e), detalle: 'opacidad ' + opacidad(e).toFixed(2) + ', visibility ' + getComputedStyle(e).visibility });
      }
      continue;
    }

    /* 1c. Caja sin texto (fondo o borde) que sale de la vista por los lados */
    if (conCaja) {
      if ((r.left < -TOL || r.right > W + TOL) && !enContenedorConScroll(e) && !enEfectoScroll(e)) {
        salida.push({ tipo: 'caja-fuera-de-la-vista', clave: desc(e), detalle: 'x ' + Math.round(r.left) + '…' + Math.round(r.right) + ' (vista 0…' + W + ')' });
      }
      continue;
    }

    /* 2. Contenido fuera de la vista por los lados */
    const caja = tieneTexto ? (cajaTexto(e) || r) : r;
    if ((caja.left < -TOL || caja.right > W + TOL) && !enContenedorConScroll(e) && !enEfectoScroll(e)) {
      salida.push({ tipo: 'fuera-de-la-vista', clave: desc(e), detalle: 'x ' + Math.round(caja.left) + '…' + Math.round(caja.right) + ' (vista 0…' + W + ')' });
    }

    /* 3. Texto recortado por un antepasado (o él mismo) con overflow ≠ visible */
    if (tieneTexto && !enEfectoScroll(e)) {
      const t = cajaTexto(e);
      if (t) {
        for (let a = e; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
          const cs = getComputedStyle(a);
          const cx = cs.overflowX !== 'visible', cy = cs.overflowY !== 'visible';
          if (!cx && !cy) continue;
          const ra = a.getBoundingClientRect();
          const izq = ra.left + a.clientLeft, arr = ra.top + a.clientTop;
          const der = izq + a.clientWidth, aba = arr + a.clientHeight;
          /* un contenedor con scroll propio no recorta: deja desplazarse */
          if (/(auto|scroll)/.test(cs.overflowX + cs.overflowY)) continue;
          const corteX = cx && (t.left < izq - TOL || t.right > der + TOL);
          /* En vertical la caja del texto incluye el hueco de ascendentes y
             descendentes de la fuente: se admite hasta un 15 % del cuerpo */
          const tolY = Math.max(TOL, 0.15 * parseFloat(getComputedStyle(e).fontSize));
          const corteY = cy && (t.top < arr - tolY || t.bottom > aba + tolY);
          if (corteX || corteY) {
            salida.push({ tipo: 'texto-cortado', clave: desc(e), detalle: 'recortado por ' + desc(a).split(' «')[0] + (corteX ? ' en horizontal' : ' en vertical') });
            break;
          }
        }
      }
    }

    /* 3b. Palabra partida: una palabra que no cabe en su línea y el navegador
       corta (overflow-wrap o guiones). Se mide la palabra entera sin saltos con
       una sonda del mismo estilo y se compara con el ancho disponible. */
    if (tieneTexto && !enEfectoScroll(e)) {
      for (const n of e.childNodes) {
        if (n.nodeType !== 3 || !n.textContent.trim()) continue;
        const rg = document.createRange();
        rg.selectNodeContents(n);
        if (rg.getClientRects().length < 2) continue; /* una sola línea */
        const re = /\S{2,}/g;
        let m;
        while ((m = re.exec(n.textContent))) {
          const rp = document.createRange();
          rp.setStart(n, m.index); rp.setEnd(n, m.index + m[0].length);
          const trozos = [...rp.getClientRects()].filter(r => r.width > 0);
          if (trozos.length < 2 || Math.abs(trozos[0].top - trozos[trozos.length - 1].top) < 1) continue;
          let bloque = e;
          while (bloque.parentElement && /^inline/.test(getComputedStyle(bloque).display)) bloque = bloque.parentElement;
          const cb = getComputedStyle(bloque);
          const disponible = bloque.clientWidth - parseFloat(cb.paddingLeft) - parseFloat(cb.paddingRight);
          const sonda = document.createElement('span');
          sonda.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0';
          sonda.textContent = m[0].replace(/\u00AD/g, '');
          e.appendChild(sonda);
          const ancho = sonda.getBoundingClientRect().width;
          sonda.remove();
          if (ancho > disponible + 0.5) {
            salida.push({ tipo: 'palabra-partida', clave: desc(e) + ' «' + m[0] + '»', detalle: Math.round(ancho) + ' px en ' + Math.round(disponible) + ' px' });
          }
        }
      }
    }

    /* 4. Objetivos interactivos (WCAG 2.5.8: se exime el enlace en línea dentro de un texto) */
    if (interactivo && opc.minObjetivo) {
      const cs = getComputedStyle(e);
      const enLinea = e.tagName === 'A' && cs.display === 'inline' &&
        [...e.parentElement.childNodes].some(n => n !== e && n.nodeType === 3 && n.textContent.trim());
      objetivos.push({ e, r, enLinea });
    }

    /* 5. Campos con letra menor de 16 px (iOS hace zoom al enfocarlos) */
    if (e.matches('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea, select')) {
      const f = parseFloat(getComputedStyle(e).fontSize);
      if (f < 16) salida.push({ tipo: 'campo-menor-16px', clave: desc(e), detalle: f + ' px' });
    }
  }
  /* Objetivos pequeños. Con opc.espaciado (ratón), la excepción de espaciado
     de WCAG 2.5.8: vale si un círculo de minObjetivo px centrado en él no toca
     otro objetivo ni el círculo de otro objetivo pequeño. */
  const min = opc.minObjetivo - 0.5;
  const pequeno = o => o.r.width < min || o.r.height < min;
  const centro = r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  const distRect = (c, r) => Math.hypot(Math.max(r.left - c.x, 0, c.x - r.right), Math.max(r.top - c.y, 0, c.y - r.bottom));
  for (const o of objetivos) {
    if (o.enLinea || !pequeno(o)) continue;
    if (opc.espaciado) {
      const c = centro(o.r), rad = opc.minObjetivo / 2;
      const choca = objetivos.some(x => x !== o && !x.e.contains(o.e) && !o.e.contains(x.e) &&
        (distRect(c, x.r) < rad || (pequeno(x) && !x.enLinea && Math.hypot(c.x - centro(x.r).x, c.y - centro(x.r).y) < 2 * rad)));
      if (!choca) continue;
    }
    salida.push({ tipo: 'objetivo-pequeno', clave: desc(o.e), detalle: Math.round(o.r.width) + '×' + Math.round(o.r.height) + ' px (mínimo ' + opc.minObjetivo + (opc.espaciado ? ', sin espacio libre alrededor' : '') + ')' });
  }
  return salida;
}

/* Texto del documento que no se pinta (display: none en su cadena) y no está
   retirado a propósito (hidden, aria-hidden, template, noscript, inert) ni
   en la lista de ocultaciones previstas. Una entrada por bloque oculto. */
function revisarRetirados(opc) {
  const salida = [];
  /* Ocultaciones previstas por el diseño (no son fallos): sin JS, el selector
     de idioma (necesita JS; <noscript> lo oculta); el menú móvil cerrado (su
     botón está a la vista con aria-expanded=false). Repetido en revisarVista y
     revisarRetirados: cada función se evalúa sola dentro de la página. */
  const permitido = e => {
    if (opc.sinJs && e.closest('.idioma-selector')) return true;
    const b = document.querySelector('.menu-boton');
    return !!e.closest('#menu') && !!b && b.getBoundingClientRect().width > 0 && b.getAttribute('aria-expanded') === 'false';
  };
  const vistos = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    if (!n.textContent.trim()) continue;
    const e = n.parentElement;
    if (!e || e.closest('[hidden], [aria-hidden="true"], template, noscript, script, style, [inert], title, option')) continue;
    const rg = document.createRange();
    rg.selectNodeContents(n);
    if (rg.getClientRects().length) continue;
    if (permitido(e)) continue;
    let t = e;
    while (t.parentElement && t.parentElement !== document.body && t.parentElement.getClientRects().length === 0 && getComputedStyle(t.parentElement).display !== 'contents') t = t.parentElement;
    if (vistos.has(t)) continue;
    vistos.add(t);
    let s = t.tagName.toLowerCase() + (t.id ? '#' + t.id : '');
    const cl = (typeof t.className === 'string' ? t.className : '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cl.length) s += '.' + cl.join('.');
    salida.push({ tipo: 'contenido-oculto', clave: s + ' «' + t.textContent.trim().replace(/\s+/g, ' ').slice(0, 30) + '»', detalle: 'display: none' });
  }
  return salida;
}

/* Cabecera: sus piezas no se solapan, caben en la vista y no
   saltan a una segunda línea. Y la regla del nombre del club:
   en /pizarra se oculta a la vista por debajo de 25,5 rem (408 px),
   con JS y sin JS. */
function revisarCabecera(opc) {
  const salida = [];
  const W = Math.min(document.documentElement.clientWidth, opc.anchoVista || Infinity);
  const cab = document.querySelector('.cabecera');
  if (!cab) return salida;
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.visibility === 'visible' && !e.closest('[hidden]'); };
  const menu = document.querySelector('.cabecera .menu');
  const menuEnLinea = menu && getComputedStyle(menu).position !== 'fixed';
  const piezas = [];
  const anade = (sel, nombre) => document.querySelectorAll(sel).forEach(e => { if (vis(e)) piezas.push({ nombre: nombre || sel, r: e.getBoundingClientRect() }); });
  anade('.cabecera .logo', 'logo');
  if (menuEnLinea) document.querySelectorAll('.cabecera .menu a').forEach(e => { if (vis(e)) piezas.push({ nombre: 'menú «' + e.textContent.trim() + '»', r: e.getBoundingClientRect() }); });
  anade('.cabecera .boton-reservar', 'Reservar');
  anade('.cabecera .idioma-boton', 'idioma');
  anade('.cabecera .menu-boton', 'botón de menú');
  for (const p of piezas) {
    if (p.r.left < -0.5 || p.r.right > W + 0.5) salida.push({ tipo: 'cabecera-fuera', clave: p.nombre, detalle: Math.round(p.r.left) + '…' + Math.round(p.r.right) + ' (vista ' + W + ')' });
  }
  for (let i = 0; i < piezas.length; i++) for (let j = i + 1; j < piezas.length; j++) {
    const a = piezas[i].r, b = piezas[j].r;
    const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (x > 0.5 && y > 0.5) salida.push({ tipo: 'cabecera-solape', clave: piezas[i].nombre + ' / ' + piezas[j].nombre, detalle: Math.round(x) + '×' + Math.round(y) + ' px' });
  }
  const alto = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alto-cabecera')) * parseFloat(getComputedStyle(document.documentElement).fontSize);
  const rc = cab.getBoundingClientRect();
  /* Sin JS el menú se ve desplegado (decisión del proyecto): la cabecera crece a propósito */
  if (!opc.sinJs && alto && rc.height > alto + 1) salida.push({ tipo: 'cabecera-dos-lineas', clave: 'cabecera', detalle: Math.round(rc.height) + ' px de alto (previsto ' + Math.round(alto) + ')' });

  if (opc.reglaNombre) {
    const n = document.querySelector('.cabecera .logo-nombre');
    if (n) {
      const visible = n.getBoundingClientRect().width > 2;
      const debe = W >= 408;
      if (visible !== debe) salida.push({ tipo: 'nombre-del-club', clave: 'logo-nombre', detalle: (visible ? 'visible' : 'oculto') + ' a ' + W + ' px (debe estar ' + (debe ? 'visible' : 'oculto') + ' desde/por debajo de 408 px)' });
    }
  }
  return salida;
}

module.exports = { revisarVista, revisarCabecera, revisarRetirados };
