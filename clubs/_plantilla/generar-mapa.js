#!/usr/bin/env node
/* =========================================================
   GENERADOR DEL MAPA ESTÁTICO DE UNA SEDE
   ---------------------------------------------------------
   Descarga UNA VEZ las calles de OpenStreetMap alrededor de
   las coordenadas del club y dibuja un SVG oscuro con el
   estilo de la marca y el punto dorado del club.

   La web no pide nada a terceros para el mapa: el SVG se
   aloja junto al resto de assets. Atribución obligatoria
   (licencia ODbL): «© OpenStreetMap contributors», que
   js/main.js ya pinta bajo el mapa.

   Herramienta de desarrollo: Node 22+ sin dependencias.
   No se publica (clubs/ está en .vercelignore).

   Uso (desde la raíz del repo):
     node clubs/_plantilla/generar-mapa.js <lat> <lng> <salida.svg>
   Ejemplo:
     node clubs/_plantilla/generar-mapa.js 36.7 -4.7 assets/maps/<slug>.svg   (coordenadas confirmadas)

   Luego, en el manifest de la sede:
     contacto.mapImage: '../assets/maps/<slug>.svg'
   ========================================================= */
'use strict';
const fs = require('fs');
const path = require('path');

const [latArg, lngArg, outArg] = process.argv.slice(2);
const lat = Number(latArg), lng = Number(lngArg);
if (!Number.isFinite(lat) || !Number.isFinite(lng) || !outArg) {
  console.error('Uso: node clubs/_plantilla/generar-mapa.js <lat> <lng> <salida.svg>');
  process.exit(1);
}

/* Lienzo 1200×480 (2,5:1). El contenedor del pie recorta con
   object-fit:cover centrado, así que el club queda siempre en medio. */
const W = 1200, H = 480;
const HALF_W_M = 650;                         /* medio ancho en metros */
const M_PER_DEG_LAT = 111320;
const M_PER_DEG_LNG = 111320 * Math.cos(lat * Math.PI / 180);
const halfLng = HALF_W_M / M_PER_DEG_LNG;
const halfLat = (HALF_W_M * H / W) / M_PER_DEG_LAT;
const pad = 1.15;                             /* margen para que las calles salgan del borde */
const bbox = [lng - halfLng * pad, lat - halfLat * pad, lng + halfLng * pad, lat + halfLat * pad];

const x = lo => ((lo - (lng - halfLng)) / (2 * halfLng)) * W;
const y = la => ((lat + halfLat - la) / (2 * halfLat)) * H;

/* Jerarquía de vías: ancho de trazo en unidades del lienzo */
const ROADS = {
  motorway: 9, trunk: 9, primary: 8, secondary: 7, tertiary: 6,
  unclassified: 4.5, residential: 4.5, living_street: 4, service: 2.5,
  pedestrian: 3, track: 2, footway: 1.4, path: 1.4, cycleway: 1.4, steps: 1.4
};
const MAJOR = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary']);

(async () => {
  const url = 'https://api.openstreetmap.org/api/0.6/map.json?bbox=' + bbox.map(n => n.toFixed(5)).join(',');
  const res = await fetch(url, { headers: { 'User-Agent': 'EleVa-static-map/1.0 (one-off generation)' } });
  if (!res.ok) { console.error('OSM respondió ' + res.status); process.exit(1); }
  const data = await res.json();

  const nodes = new Map();
  data.elements.filter(e => e.type === 'node').forEach(n => nodes.set(n.id, n));
  const ways = data.elements.filter(e => e.type === 'way' && e.tags);

  const d = w => w.nodes.map((id, i) => {
    const n = nodes.get(id); if (!n) return '';
    return (i ? 'L' : 'M') + x(n.lon).toFixed(1) + ' ' + y(n.lat).toFixed(1);
  }).join('');

  const green = [], water = [], buildings = [], minor = [], major = [];
  for (const w of ways) {
    const t = w.tags;
    if (t.building) buildings.push(d(w) + 'Z');
    else if (t.leisure === 'park' || t.leisure === 'pitch' || t.landuse === 'grass' ||
             t.landuse === 'orchard' || t.landuse === 'farmland' || t.natural === 'wood') green.push(d(w) + 'Z');
    else if (t.waterway || t.natural === 'water') water.push(d(w));
    else if (t.highway && ROADS[t.highway]) {
      (MAJOR.has(t.highway) ? major : minor).push({ d: d(w), sw: ROADS[t.highway] });
    }
  }

  const group = (items, attrs) => items.length
    ? `<g ${attrs}>${items.map(p => typeof p === 'string'
        ? `<path d="${p}"/>` : `<path d="${p.d}" stroke-width="${p.sw}"/>`).join('')}</g>` : '';

  const cx = x(lng).toFixed(1), cy = y(lat).toFixed(1);
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<!-- Datos: © OpenStreetMap contributors (ODbL). Generado con clubs/_plantilla/generar-mapa.js -->
<rect width="${W}" height="${H}" fill="#1c1b1a"/>
${group(green, 'fill="#23241f"')}
${group(water, 'fill="none" stroke="#1f2a30" stroke-width="3"')}
${group(buildings, 'fill="#262422"')}
${group(minor, 'fill="none" stroke="#35322e" stroke-linecap="round" stroke-linejoin="round"')}
${group(major, 'fill="none" stroke="#4a4239" stroke-linecap="round" stroke-linejoin="round"')}
<circle cx="${cx}" cy="${cy}" r="26" fill="#C4A882" fill-opacity=".18"/>
<circle cx="${cx}" cy="${cy}" r="11" fill="#C4A882"/>
</svg>
`;
  fs.mkdirSync(path.dirname(outArg), { recursive: true });
  fs.writeFileSync(outArg, svg);
  console.log(`OK: ${outArg} · ${(svg.length / 1024).toFixed(1)} KB · ${major.length + minor.length} vías, ${buildings.length} edificios`);
})().catch(err => { console.error(err); process.exit(1); });
