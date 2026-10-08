/* =========================================================
   Oráculo del hero de /pizarra: ¿la máscara del logo está
   donde dice la especificación y se ve así en pantalla?
   ---------------------------------------------------------
   Fuente de verdad (css/main.css y css/movimiento.css):
   · el logo mide --L de lado y está en --mx/--my dentro del
     telón (semántica de mask-position: los % se toman sobre
     el telón menos el logo);
   · con el scroll crece desde --ox/--oy con escala 24^p, donde
     p = scrollY / (0,7 · alto de la ventana) limitado a 0-1, y
     se funde entre p = 0,55 y p = 0,92 (sd-hero-abre);
   · el fondo baja 0,45 px por px de scroll (scroll.js) y el
     telón se desplaza con el paralaje del ratón (puntero.js).
   medir() calcula en la página la caja ESPERADA del logo con
   esas reglas (sin leer la escala que aplica la animación) y
   la REAL (una sonda dentro de la máscara, con todas sus
   transformaciones), más el estado del lienzo 3D.
   comprobar() compara las dos cajas y muestrea la captura:
   fuera del logo solo puede haber negro; dentro, el tinte o la
   pista (nunca negro puro mientras hay tinte).
   ========================================================= */
'use strict';
const { leerPng, pixel } = require('./png');

/* Logo oficial sin fondo (assets/img/logo-sin-fondo.svg, viewBox 0 0 100 100) */
const CHEVRON = [[50, 16], [20, 70], [26, 70], [50, 27], [74, 70], [80, 70]];
const BARRA = [[20, 80], [80, 80], [80, 85], [20, 85]];
const ESCALA_FINAL = 24;          /* --prof-escala-hero */
const RANGO = 0.7;                /* scroll.js: 0 → 70 % de pantalla */

/* Se ejecuta en la página (Playwright la serializa) */
function medirEnPagina(rango) {
  const hero = document.querySelector('.hero');
  const masc = document.querySelector('.hero-mascara');
  if (!hero || !masc) return { error: 'sin hero o sin máscara' };
  const cs = el => getComputedStyle(el);
  /* Caja del logo según --L, --mx, --my. Dos sondas: una en un «telón
     fantasma» sin transformaciones (misma caja que .hero-telon) y otra dentro
     de la máscara real, que hereda todas sus transformaciones. */
  const sonda = padre => {
    const caja = document.createElement('div');
    caja.style.cssText = 'position:absolute;left:0;top:0;width:calc(100% - var(--L));height:calc(100% - var(--L));visibility:hidden;pointer-events:none;';
    const logo = document.createElement('div');
    logo.style.cssText = 'position:absolute;left:var(--mx);top:var(--my);width:var(--L);height:var(--L);';
    const origen = document.createElement('div');
    origen.style.cssText = 'position:absolute;left:var(--ox);top:var(--oy);width:0;height:0;visibility:hidden;';
    caja.appendChild(logo);
    padre.appendChild(caja);
    padre.appendChild(origen);
    return { caja, logo, origen };
  };
  const fantasma = document.createElement('div');
  fantasma.style.cssText = 'position:absolute;inset:calc(-1 * var(--sangrado));visibility:hidden;pointer-events:none;';
  hero.appendChild(fantasma);
  const sf = sonda(fantasma), sr = sonda(masc);
  const real = sr.logo.getBoundingClientRect();
  const rl = sf.logo.getBoundingClientRect(), ro = sf.origen.getBoundingClientRect();
  fantasma.remove(); sr.caja.remove(); sr.origen.remove();
  const rh = hero.getBoundingClientRect();
  const mov = document.documentElement.classList.contains('mov');
  const vh = innerHeight;
  const p = mov ? Math.min(1, Math.max(0, scrollY / (rango * vh))) : 0;
  const S = mov ? Math.pow(24, p) : 1;
  /* Traslaciones explícitas: fondo (scroll.js) y telón (paralaje) */
  const fondo = document.querySelector('.hero-fondo');
  const telon = document.querySelector('.hero-telon');
  const mFondo = new DOMMatrix(cs(fondo).transform === 'none' ? undefined : cs(fondo).transform);
  const trasl = el => { const v = (cs(el).translate || 'none'); return v === 'none' ? [0, 0] : v.split(' ').map(parseFloat).concat([0, 0]); };
  const tr = trasl(telon), tf = trasl(fondo);
  const tx = mFondo.e + tf[0] + (tr[0] || 0), ty = mFondo.f + (tf[1] || 0) + (tr[1] || 0);
  /* Escala del pulso (toque) */
  const sPulso = parseFloat(cs(document.querySelector('.hero-pulso')).scale) || 1;
  /* escala alrededor del origen; después, las traslaciones */
  const esperado = {
    x: ro.left + tx + (rl.left - ro.left) * S * sPulso,
    y: ro.top + ty + (rl.top - ro.top) * S * sPulso,
    lado: rl.width * S * sPulso
  };
  const opacidad = parseFloat(cs(masc).opacity);
  const opTinte = parseFloat(cs(document.querySelector('.hero-tinte')).opacity);
  const escalaReal = parseFloat(cs(masc).scale) || 1;
  const lienzo = document.querySelector('.hero-lienzo');
  let lz = null;
  if (lienzo) {
    const r = lienzo.getBoundingClientRect();
    const re = document.querySelector('.hero-escena').getBoundingClientRect();
    let perdido = null;
    try { const gl = lienzo.getContext('webgl2'); perdido = gl ? gl.isContextLost() : null; } catch (e) { perdido = 'error'; }
    lz = { x: r.left, y: r.top, w: r.width, h: r.height, ew: re.width, eh: re.height, bw: lienzo.width, bh: lienzo.height,
           opacidad: parseFloat(cs(lienzo).opacity), perdido };
  }
  const img = document.querySelector('.hero-imagen img');
  const excluir = [];
  document.querySelectorAll('.cabecera, .hero-linea, .hero-lugar, .botones a, .cursor.visible, #eventos:not([hidden])').forEach(e => {
    const r = e.getBoundingClientRect();
    if (r.width && r.height) excluir.push({ x: r.left, y: r.top, w: r.width, h: r.height });
  });
  const tresD = window.ElevaTresD ? window.ElevaTresD.estado() : null;
  return {
    vw: innerWidth, vh, dpr: devicePixelRatio, scrollY, mov, p, S,
    /* la captura es la ventana visual (en móvil puede estar alejada) */
    vv: window.visualViewport ? { x: visualViewport.offsetLeft, y: visualViewport.offsetTop, w: visualViewport.width, h: visualViewport.height, escala: visualViewport.scale } : { x: 0, y: 0, w: innerWidth, h: vh, escala: 1 },
    hero: { x: rh.left, y: rh.top, w: rh.width, h: rh.height },
    real: { x: real.left, y: real.top, lado: real.width, alto: real.height },
    esperado, escalaReal, opacidad, opTinte,
    lienzo: lz, lista: hero.classList.contains('tres-d-lista'),
    imagen: img ? { completa: img.complete && img.naturalWidth > 0, src: (img.currentSrc || '').split('/').pop() } : null,
    tresD: tresD ? { cargada: tresD.cargada } : null,
    fuentes: document.fonts ? document.fonts.status : '?',
    excluir
  };
}

async function medir(p) { return p.evaluate(medirEnPagina, RANGO); }

/* ── Geometría en el plano de la captura ── */
function dentroPoligono(px, py, pol) {
  let dentro = false;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i], [xj, yj] = pol[j];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}
function distSegmento(px, py, [ax, ay], [bx, by]) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function distBorde(px, py, pol) {
  let d = Infinity;
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) d = Math.min(d, distSegmento(px, py, pol[j], pol[i]));
  return d;
}

/* Clasifica un punto de pantalla: 'dentro', 'fuera' o null (cerca del borde) */
function clasificar(x, y, caja, margen) {
  const a = caja.lado / 100;
  const pols = [CHEVRON, BARRA].map(pol => pol.map(([u, v]) => [caja.x + u * a, caja.y + v * a]));
  const dentro = pols.some(pol => dentroPoligono(x, y, pol));
  const d = Math.min(...pols.map(pol => distBorde(x, y, pol)));
  if (d < margen) return null;
  return dentro ? 'dentro' : 'fuera';
}

const NEGRO = 18;          /* suma R+G+B máxima de «negro» (compresión y suavizado) */
const CON_TINTE = 45;      /* suma mínima dentro del logo mientras hay tinte (≥ 0,2) */
const MIN_PUNTOS = 3;      /* un punto suelto es suavizado; una tesela perdida da decenas */

/* Compara medida y captura. Devuelve una lista de fallos. */
function comprobar(m, png, { etiqueta = '', paso = 24, final = false } = {}) {
  const f = [];
  const fallo = (clave, detalle) => f.push({ tipo: 'hero', clave: (etiqueta ? etiqueta + ': ' : '') + clave, detalle });
  if (m.error) { fallo(m.error, ''); return f; }
  /* 1. La caja real del logo coincide con la especificación */
  const tol = Math.max(1.5, m.esperado.lado * 0.004);
  const dx = m.real.x - m.esperado.x, dy = m.real.y - m.esperado.y, dl = m.real.lado - m.esperado.lado;
  if (Math.abs(dx) > tol || Math.abs(dy) > tol || Math.abs(dl) > tol) {
    fallo('logo fuera de su sitio', `real ${r1(m.real.x)},${r1(m.real.y)} lado ${r1(m.real.lado)} · esperado ${r1(m.esperado.x)},${r1(m.esperado.y)} lado ${r1(m.esperado.lado)} · p=${m.p.toFixed(3)} escala real ${m.escalaReal} esperada ${m.S.toFixed(4)}`);
  }
  /* 2. Opacidad del telón según el progreso (sd-hero-abre) */
  const opEsperada = !m.mov ? 1 : m.p <= 0.55 ? 1 : m.p >= 0.92 ? 0 : 1 - (m.p - 0.55) / 0.37;
  if (Math.abs(m.opacidad - opEsperada) > 0.02) fallo('opacidad del telón', `real ${m.opacidad} esperada ${opEsperada.toFixed(3)}`);
  /* 3. Lienzo 3D: ocupa la escena, con su resolución, y su contexto vive */
  if (m.lienzo) {
    const l = m.lienzo;
    if (Math.abs(l.w - l.ew) > 1 || Math.abs(l.h - l.eh) > 1) fallo('lienzo 3D con otra caja que la escena', `${r1(l.w)}×${r1(l.h)} frente a ${r1(l.ew)}×${r1(l.eh)}`);
    if (l.perdido === true && m.lista) fallo('contexto WebGL perdido y el lienzo sigue a la vista', '');
    const esperadoW = Math.round(l.ew * Math.min(m.dpr, 2));
    /* mientras se crea, el lienzo existe invisible con su tamaño por defecto */
    if (m.lista && Math.abs(l.bw - esperadoW) > 2 && Math.abs(l.bw - Math.round(l.ew * Math.min(m.dpr, 1.5))) > 2) fallo('resolución del lienzo 3D', `${l.bw} px de ancho para ${r1(l.ew)} CSS px a dpr ${m.dpr}`);
  } else if (m.lista) fallo('marcado tres-d-lista sin lienzo', '');
  /* Al final de cada escenario: o la pista 3D a la vista o la imagen fija cargada, nunca nada a medias */
  if (final && !(m.lista && m.lienzo && m.lienzo.opacidad > 0.99) && !(m.imagen && m.imagen.completa)) fallo('ni pista 3D ni imagen fija', JSON.stringify(m.imagen));
  /* 4. Píxeles: fuera del logo, negro; dentro, tinte o pista */
  if (png) {
    const img = leerPng(png);
    /* px de la captura por px CSS (con ventana visible, la barra de scroll queda fuera de vv.w) */
    const k = m.dpr * (m.vv.escala || 1);
    const px = (x, y) => pixel(img, (x - m.vv.x) * k, (y - m.vv.y) * k);
    const hx0 = Math.max(m.vv.x, m.hero.x), hy0 = Math.max(m.vv.y, m.hero.y);
    const hx1 = Math.min(m.vv.x + m.vv.w, m.hero.x + m.hero.w), hy1 = Math.min(m.vv.y + m.vv.h, m.hero.y + m.hero.h);
    const libre = (x, y) => !m.excluir.some(r => x > r.x - 8 && x < r.x + r.w + 8 && y > r.y - 8 && y < r.y + r.h + 8);
    /* el borde inferior del hero (la sección siguiente) y la banda del paralaje quedan fuera */
    const yMax = hy1 - 4;
    let malosFuera = [], malosDentro = [], nFuera = 0, nDentro = 0;
    /* margen junto al borde del logo: el suavizado de la máscara crece con la escala */
    const margen = 3 + 0.5 * m.S;
    const comprobarFuera = m.opacidad >= 0.999;
    const comprobarDentro = m.opTinte >= 0.2;
    for (let y = hy0 + paso / 2; y < yMax; y += paso) {
      for (let x = hx0 + paso / 2; x < hx1; x += paso) {
        if (!libre(x, y)) continue;
        const c = clasificar(x, y, m.real, margen);
        if (!c) continue;
        const [r, g, b] = px(x, y);
        const s = r + g + b;
        if (c === 'fuera' && comprobarFuera) { nFuera++; if (s > NEGRO) malosFuera.push([Math.round(x), Math.round(y), s]); }
        if (c === 'dentro' && comprobarDentro) { nDentro++; if (s < CON_TINTE) malosDentro.push([Math.round(x), Math.round(y), s]); }
      }
    }
    /* También los puntos clave del logo (centro de cada pata y de la barra) */
    if (comprobarDentro) {
      const a = m.real.lado / 100;
      for (const [u, v] of [[34.5, 45], [65.5, 45], [50, 21], [30, 82.5], [50, 82.5], [70, 82.5]]) {
        const x = m.real.x + u * a, y = m.real.y + v * a;
        if (x < hx0 || y < hy0 || x >= hx1 || y >= yMax || !libre(x, y)) continue;
        nDentro++;
        const s = px(x, y).reduce((t, v) => t + v, 0);
        if (s < CON_TINTE) malosDentro.push([Math.round(x), Math.round(y), s]);
      }
    }
    /* un punto suelto es suavizado del borde; una tesela perdida son varios */
    if (malosFuera.length >= MIN_PUNTOS) fallo('pista o color fuera del logo', `${malosFuera.length}/${nFuera} puntos no negros; p. ej. ${malosFuera.slice(0, 4).map(v => v.join(',')).join(' · ')}`);
    if (malosDentro.length >= MIN_PUNTOS) fallo('negro dentro del logo', `${malosDentro.length}/${nDentro} puntos negros; p. ej. ${malosDentro.slice(0, 4).map(v => v.join(',')).join(' · ')}`);
    if (comprobarFuera && nFuera < 20) fallo('muestreo insuficiente fuera del logo', String(nFuera));
  }
  return f;
}

function r1(v) { return Math.round(v * 10) / 10; }

module.exports = { medir, comprobar, medirEnPagina, clasificar, RANGO, ESCALA_FINAL };
