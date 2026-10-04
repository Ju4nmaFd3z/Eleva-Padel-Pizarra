/* ================================================================
   Eleva Pádel — pista.js (módulo ES, se importa bajo demanda)
   La pista del club en 3D. Todo en metros, medidas interiores.

   Reglamento: FIP, «Rules of Padel», versión «in force as of 1.01.2026»
   (https://www.padelfip.com/wp-content/uploads/2024/11/FIP-Rules-of-Padel.pdf),
   página 6 del documento (página 7 del PDF), diagrama «Laterales –
   Variante 1 (dimensiones interiores)». Cotas del lateral, de fondo a
   fondo: 2 m | 2 m | 12 ± 0,1 m (simétricos respecto a la red) | 2 m | 2 m.
   Texto de las medidas: versión «Review of application 01.01.2026»,
   págs. 5-7. El club confirmó la variante 1 (01/10/2026).
   · Pista de 10 × 20 m, red en la mitad.
   · Líneas de 5 cm: de saque a 6,95 m de la red; central de saque
     prolongada 20 cm más allá de cada línea de saque.
   · Red de 10 m: 0,88 m en el centro y 0,92 m en los extremos (postes de
     hasta 1,05 m: no se dibujan).
   · Fondos (10 m): 3 m de pared (en este club, cristal) + 1 m de malla
     (hasta 4 m).
   · Laterales, en cada extremo: primer tramo de 2 m con pared de 3 m de
     alto y 1 m de malla encima (hasta 4 m); segundo tramo de 2 m con pared
     de 2 m y malla encima hasta 3 m. Los 12 m centrales (6 m a cada lado
     de la red): malla hasta 3 m.
   El diagrama dibuja una puerta en el lateral: no se modela (no está
   confirmada). Tampoco color de suelo, focos, postes de luz, gradas ni
   entorno. La luz LED (confirmada) se expresa como iluminación de la
   escena y un brillo en el canto superior del cristal. Colores de la
   marca, sin fotorrealismo.

   Lo usan js/movimiento/tres-d.js (la escena viva) y el guion que
   renderiza la imagen fija del hero (assets/img/pista-*), para que las
   dos salgan de la misma escena y el relevo no se note.
   ================================================================ */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, LineSegments,
  BufferGeometry, Float32BufferAttribute, ShaderMaterial, Vector3,
  DoubleSide, AdditiveBlending, LinearSRGBColorSpace, ColorManagement
} from '../../lib/three/three.eleva.js';

/* Paleta de las insignias (sRGB, 0-1). Se escribe tal cual: sin gestión de color. */
function rgb(hex) { return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255]; }
const CREMA = rgb(0xEDE4DC), CLARO = rgb(0xDBD2CC), ANILLO = rgb(0xA18572);

/* Medidas (m) */
const ANCHO = 10, LARGO = 20, MEDIO_A = ANCHO / 2, MEDIO_L = LARGO / 2;
const LINEA = 0.05, SAQUE = 6.95, PROLONGA = 0.20;
const RED_CENTRO = 0.88, RED_EXTREMO = 0.92;

/* Encuadres de referencia. La imagen fija se renderiza con estas mismas
   proporciones y se muestra con object-fit: cover; la escena viva recorta
   igual (setViewOffset), así que el primer fotograma coincide con la foto. */
export const REFERENCIA = {
  horizontal: { ancho: 1920, alto: 1080 },
  vertical:   { ancho: 1000, alto: 2000 }
};

/* Cámara: vista alta (progreso 0) → altura de jugador (progreso 1).
   El jugador está en su campo, a 1,4 m del fondo, con los ojos a 1,7 m. */
const CAMARA = {
  horizontal: {
    fov: 34,
    alta: { pos: [11.5, 26, 20], mira: [-4.8, 0, 0.4] },
    baja: { pos: [1.4, 1.7, 8.6], mira: [-0.4, 1.1, -6] }
  },
  vertical: {
    fov: 46,
    alta: { pos: [3.2, 38, 17.5], mira: [0, 0, 4.8] },
    baja: { pos: [1.1, 1.7, 8.6], mira: [-0.3, 1.0, -6] }
  }
};

const VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vLocal;
  attribute vec3 local;
  void main() {
    vUv = uv;
    vLocal = local;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;

function material(frag, uniforms, extra) {
  return new ShaderMaterial(Object.assign({
    uniforms, vertexShader: VERT, fragmentShader: frag, transparent: true, depthWrite: false, side: DoubleSide
  }, extra || {}));
}

/* Geometría de rectángulos sueltos (posición, uv 0-1 y coordenada local en metros) */
function Quads() {
  const pos = [], uv = [], local = [], idx = [];
  return {
    /* a, b, c, d: esquinas (abajo-izq, abajo-der, arriba-der, arriba-izq); ancho/alto en m */
    add(a, b, c, d, w, h) {
      const n = pos.length / 3;
      pos.push(...a, ...b, ...c, ...d);
      uv.push(0, 0, 1, 0, 1, 1, 0, 1);
      local.push(0, 0, 0, w, 0, 0, w, h, 0, 0, h, 0);
      idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
    },
    geo() {
      const g = new BufferGeometry();
      g.setAttribute('position', new Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
      g.setAttribute('local', new Float32BufferAttribute(local, 3));
      g.setIndex(idx);
      return g;
    }
  };
}

/* Panel vertical en x = cte (lateral) o z = cte (fondo) */
function panelLateral(q, x, z0, z1, y0, y1) { q.add([x, y0, z0], [x, y0, z1], [x, y1, z1], [x, y1, z0], Math.abs(z1 - z0), y1 - y0); }
function panelFondo(q, z, x0, x1, y0, y1) { q.add([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], Math.abs(x1 - x0), y1 - y0); }

export function crearPista(canvas, opciones) {
  const op = opciones || {};
  ColorManagement.enabled = false;

  const renderer = new WebGLRenderer({
    canvas, antialias: op.suavizado !== false, alpha: false, powerPreference: 'high-performance',
    preserveDrawingBuffer: !!op.conservarImagen
  });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 1);

  const escena = new Scene();
  const pista = new Group();
  escena.add(pista);
  const camara = new PerspectiveCamera(34, 16 / 9, 0.1, 200);

  const enc = { value: 0 };               /* encendido de las LED: 0 penumbra, 1 iluminada */

  /* ── Suelo: negro; la luz LED lo levanta hacia el centro ─────── */
  {
    const q = Quads();
    q.add([-MEDIO_A, 0, MEDIO_L], [MEDIO_A, 0, MEDIO_L], [MEDIO_A, 0, -MEDIO_L], [-MEDIO_A, 0, -MEDIO_L], ANCHO, LARGO);
    pista.add(new Mesh(q.geo(), material(/* glsl */`
      uniform float uEnc;
      varying vec3 vLocal;
      void main() {
        vec2 p = (vLocal.xy - vec2(5.0, 10.0)) / vec2(8.0, 13.0);
        float charco = 1.0 - smoothstep(0.0, 1.0, length(p));
        vec3 penumbra = vec3(0.012, 0.011, 0.010);
        vec3 luz = mix(vec3(0.030, 0.027, 0.024), vec3(0.105, 0.092, 0.082), charco);
        gl_FragColor = vec4(mix(penumbra, luz, uEnc), 1.0);
      }`, { uEnc: enc }, { transparent: false, depthWrite: true })));
  }

  /* ── Líneas de 5 cm ───────────────────────────────────────── */
  {
    const q = Quads(), y = 0.004, m = LINEA / 2;
    const tira = (x0, z0, x1, z1) => q.add([x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], 1, 1);
    for (const s of [-1, 1]) tira(-MEDIO_A, s * SAQUE - m, MEDIO_A, s * SAQUE + m);
    tira(-m, -(SAQUE + PROLONGA), m, SAQUE + PROLONGA);
    pista.add(new Mesh(q.geo(), material(/* glsl */`
      uniform float uEnc; uniform vec3 uColor;
      void main() { gl_FragColor = vec4(uColor * (0.32 + 0.68 * uEnc), 1.0); }`,
      { uEnc: enc, uColor: { value: CREMA } }, { transparent: false })));
  }

  /* ── Cristal: planos translúcidos ─────────────────────────── */
  const cristal = Quads(), cantos = [];
  for (const s of [-1, 1]) {
    panelFondo(cristal, s * MEDIO_L, -MEDIO_A, MEDIO_A, 0, 3);
    cantos.push([[-MEDIO_A, 3, s * MEDIO_L], [MEDIO_A, 3, s * MEDIO_L]]);
    for (const x of [-MEDIO_A, MEDIO_A]) {
      panelLateral(cristal, x, s * 10, s * 8, 0, 3);
      panelLateral(cristal, x, s * 8, s * 6, 0, 2);
      cantos.push([[x, 3, s * 10], [x, 3, s * 8]], [[x, 2, s * 8], [x, 2, s * 6]]);
    }
  }
  pista.add(new Mesh(cristal.geo(), material(/* glsl */`
    uniform float uEnc; uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      float arriba = pow(vUv.y, 4.0);
      float a = 0.035 + uEnc * (0.035 + 0.13 * arriba);
      gl_FragColor = vec4(uColor, a);
    }`, { uEnc: enc, uColor: { value: CLARO } })));

  /* ── Malla metálica: retícula fina ────────────────────────── */
  const malla = Quads();
  for (const s of [-1, 1]) {
    panelFondo(malla, s * MEDIO_L, -MEDIO_A, MEDIO_A, 3, 4);
    for (const x of [-MEDIO_A, MEDIO_A]) {
      panelLateral(malla, x, s * 10, s * 8, 3, 4);
      panelLateral(malla, x, s * 8, s * 6, 2, 3);
    }
  }
  for (const x of [-MEDIO_A, MEDIO_A]) panelLateral(malla, x, -6, 6, 0, 3);
  const RETICULA = /* glsl */`
    uniform float uEnc; uniform vec3 uColor; uniform float uCelda; uniform float uAlfa;
    varying vec3 vLocal;
    void main() {
      vec2 c = vLocal.xy / uCelda;
      vec2 w = fwidth(c);
      vec2 g = abs(fract(c - 0.5) - 0.5) / max(w, 1e-4);
      float hilo = 1.0 - min(min(g.x, g.y), 1.0);
      /* Si la celda mide menos de ~3 px, la retícula se funde en un velo (sin muaré) */
      float densa = smoothstep(0.18, 0.4, max(w.x, w.y));
      float a = mix(hilo, 0.22, densa);
      gl_FragColor = vec4(uColor, a * uAlfa * (0.35 + 0.65 * uEnc));
    }`;
  pista.add(new Mesh(malla.geo(), material(RETICULA,
    { uEnc: enc, uColor: { value: ANILLO }, uCelda: { value: 0.1 }, uAlfa: { value: 0.75 } })));

  /* ── Red: 10 m, 0,88 en el centro y 0,92 en los extremos ───── */
  const alturaRed = x => RED_CENTRO + (RED_EXTREMO - RED_CENTRO) * (x / MEDIO_A) * (x / MEDIO_A);
  {
    const q = Quads(), N = 20;
    for (let i = 0; i < N; i++) {
      const x0 = -MEDIO_A + (ANCHO * i) / N, x1 = -MEDIO_A + (ANCHO * (i + 1)) / N;
      q.add([x0, 0, 0], [x1, 0, 0], [x1, alturaRed(x1), 0], [x0, alturaRed(x0), 0], 0, 0);
    }
    const g = q.geo();
    /* coordenada local en metros reales para la retícula de la red */
    const p = g.getAttribute('position'), l = g.getAttribute('local');
    for (let i = 0; i < p.count; i++) l.setXYZ(i, p.getX(i) + MEDIO_A, p.getY(i), 0);
    pista.add(new Mesh(g, material(RETICULA,
      { uEnc: enc, uColor: { value: CLARO }, uCelda: { value: 0.045 }, uAlfa: { value: 0.4 } })));
  }

  /* ── Bordes finos: cristal y malla en color anillo ────────── */
  const bordes = [];
  const rect = (a, b, c, d) => bordes.push(...a, ...b, ...b, ...c, ...c, ...d, ...d, ...a);
  for (const s of [-1, 1]) {
    const z = s * MEDIO_L;
    rect([-MEDIO_A, 0, z], [MEDIO_A, 0, z], [MEDIO_A, 4, z], [-MEDIO_A, 4, z]);
    bordes.push(-MEDIO_A, 3, z, MEDIO_A, 3, z);
    for (const x of [-MEDIO_A, MEDIO_A]) {
      rect([x, 0, s * 10], [x, 0, s * 8], [x, 4, s * 8], [x, 4, s * 10]);
      rect([x, 0, s * 8], [x, 0, s * 6], [x, 3, s * 6], [x, 3, s * 8]);
      bordes.push(x, 3, s * 10, x, 3, s * 8, x, 2, s * 8, x, 2, s * 6);
    }
  }
  for (const x of [-MEDIO_A, MEDIO_A]) rect([x, 0, -6], [x, 0, 6], [x, 3, 6], [x, 3, -6]);
  {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(bordes, 3));
    g.setAttribute('uv', new Float32BufferAttribute(new Array((bordes.length / 3) * 2).fill(0), 2));
    g.setAttribute('local', new Float32BufferAttribute(new Array(bordes.length).fill(0), 3));
    pista.add(new LineSegments(g, material(/* glsl */`
      uniform float uEnc; uniform vec3 uColor;
      void main() { gl_FragColor = vec4(uColor, 0.45 + 0.4 * uEnc); }`,
      { uEnc: enc, uColor: { value: ANILLO } })));
  }

  /* ── Cinta superior de la red y verticales de sus extremos ── */
  {
    const v = [], N = 40;
    for (let i = 0; i < N; i++) {
      const x0 = -MEDIO_A + (ANCHO * i) / N, x1 = -MEDIO_A + (ANCHO * (i + 1)) / N;
      v.push(x0, alturaRed(x0), 0, x1, alturaRed(x1), 0);
    }
    v.push(-MEDIO_A, 0, 0, -MEDIO_A, RED_EXTREMO, 0, MEDIO_A, 0, 0, MEDIO_A, RED_EXTREMO, 0);
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(v, 3));
    g.setAttribute('uv', new Float32BufferAttribute(new Array((v.length / 3) * 2).fill(0), 2));
    g.setAttribute('local', new Float32BufferAttribute(new Array(v.length).fill(0), 3));
    pista.add(new LineSegments(g, material(/* glsl */`
      uniform float uEnc; uniform vec3 uColor;
      void main() { gl_FragColor = vec4(uColor, 0.5 + 0.5 * uEnc); }`,
      { uEnc: enc, uColor: { value: CREMA } })));
  }

  /* ── Brillo LED en el canto superior del cristal ──────────── */
  {
    const q = Quads(), H = 0.35;
    for (const [a, b] of cantos) {
      /* banda vertical centrada en el canto, en el plano del cristal */
      q.add([a[0], a[1] - H, a[2]], [b[0], b[1] - H, b[2]], [b[0], b[1] + H, b[2]], [a[0], a[1] + H, a[2]], 1, 2 * H);
    }
    pista.add(new Mesh(q.geo(), material(/* glsl */`
      uniform float uEnc; uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float d = abs(vUv.y - 0.5) * 2.0;
        float nucleo = 1.0 - smoothstep(0.0, 0.07, d);
        float halo = exp(-d * 5.0) * 0.35;
        gl_FragColor = vec4(uColor * (nucleo + halo) * uEnc, 1.0);
      }`, { uEnc: enc, uColor: { value: CREMA } }, { blending: AdditiveBlending })));
  }

  /* ── Cámara ───────────────────────────────────────────────── */
  let modo = 'horizontal', ancho = 1, alto = 1;
  const pos = new Vector3(), mira = new Vector3(), a = new Vector3(), b = new Vector3();
  const suave = t => t * t * t * (t * (t * 6 - 15) + 10);   /* smootherstep */

  function redimensionar(w, h, dpr, orientacion) {
    ancho = Math.max(1, w); alto = Math.max(1, h);
    modo = orientacion || (w / h <= 1 ? 'vertical' : 'horizontal');
    renderer.setPixelRatio(dpr || 1);
    renderer.setSize(ancho, alto, false);
    const ref = REFERENCIA[modo];
    /* Recorte tipo object-fit: cover del encuadre de referencia */
    const k = Math.max(ancho / ref.ancho, alto / ref.alto);
    const fw = ref.ancho * k, fh = ref.alto * k;
    camara.aspect = ref.ancho / ref.alto;
    camara.fov = CAMARA[modo].fov;
    camara.setViewOffset(fw, fh, (fw - ancho) / 2, (fh - alto) / 2, ancho, alto);
  }

  /* estado: { progreso 0-1, px/py paralaje -1..1, giro (rad), encendido 0-1 } */
  function pintar(e) {
    const c = CAMARA[modo];
    const t = suave(Math.min(1, Math.max(0, e.progreso || 0)));
    pos.fromArray(c.alta.pos).lerp(b.fromArray(c.baja.pos), t);
    mira.fromArray(c.alta.mira).lerp(a.fromArray(c.baja.mira), t);
    /* Paralaje del ratón: más amplio arriba, contenido a la altura del jugador */
    const amp = 1.6 - 1.2 * t;
    pos.x += (e.px || 0) * amp;
    pos.y += (e.py || 0) * amp * 0.6;
    camara.position.copy(pos);
    camara.lookAt(mira);
    camara.updateProjectionMatrix();
    pista.rotation.y = e.giro || 0;
    enc.value = e.encendido == null ? 1 : e.encendido;
    renderer.render(escena, camara);
  }

  function destruir() {
    escena.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    renderer.dispose();
  }

  return {
    renderer, redimensionar, pintar, destruir,
    /* compila los shaders sin bloquear (KHR_parallel_shader_compile si existe) */
    preparar() { return renderer.compileAsync ? renderer.compileAsync(escena, camara) : Promise.resolve(); }
  };
}
