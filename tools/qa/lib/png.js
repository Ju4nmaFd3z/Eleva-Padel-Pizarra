/* =========================================================
   Lector mínimo de PNG (sin dependencias: zlib de Node)
   ---------------------------------------------------------
   Solo lo que producen las capturas de Playwright: 8 bits por
   canal, RGB o RGBA, sin entrelazado. Devuelve { ancho, alto,
   canales, datos } y pixel(img, x, y) → [r, g, b].
   ========================================================= */
'use strict';
const zlib = require('zlib');

function leerPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('No es un PNG');
  let pos = 8, ancho = 0, alto = 0, tipo = 0, prof = 0, entrelazado = 0;
  const idat = [];
  while (pos < buf.length) {
    const largo = buf.readUInt32BE(pos);
    const nombre = buf.toString('latin1', pos + 4, pos + 8);
    const datos = buf.subarray(pos + 8, pos + 8 + largo);
    if (nombre === 'IHDR') {
      ancho = datos.readUInt32BE(0); alto = datos.readUInt32BE(4);
      prof = datos[8]; tipo = datos[9]; entrelazado = datos[12];
    } else if (nombre === 'IDAT') idat.push(datos);
    else if (nombre === 'IEND') break;
    pos += 12 + largo;
  }
  if (prof !== 8 || entrelazado || (tipo !== 2 && tipo !== 6)) throw new Error('PNG no admitido (tipo ' + tipo + ', ' + prof + ' bits)');
  const canales = tipo === 6 ? 4 : 3;
  const crudo = zlib.inflateSync(Buffer.concat(idat));
  const fila = ancho * canales;
  const datos = Buffer.alloc(fila * alto);
  let previa = Buffer.alloc(fila);
  for (let y = 0; y < alto; y++) {
    const filtro = crudo[y * (fila + 1)];
    const ent = crudo.subarray(y * (fila + 1) + 1, (y + 1) * (fila + 1));
    const sal = datos.subarray(y * fila, (y + 1) * fila);
    for (let i = 0; i < fila; i++) {
      const a = i >= canales ? sal[i - canales] : 0;
      const b = previa[i];
      const c = i >= canales ? previa[i - canales] : 0;
      let v = ent[i];
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : (pb <= pc ? b : c);
      }
      sal[i] = v & 255;
    }
    previa = sal;
  }
  return { ancho, alto, canales, datos };
}

function pixel(img, x, y) {
  x = Math.max(0, Math.min(img.ancho - 1, Math.round(x)));
  y = Math.max(0, Math.min(img.alto - 1, Math.round(y)));
  const i = (y * img.ancho + x) * img.canales;
  return [img.datos[i], img.datos[i + 1], img.datos[i + 2]];
}

module.exports = { leerPng, pixel };
