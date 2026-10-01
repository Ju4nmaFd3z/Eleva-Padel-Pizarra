# Dar de alta un club

Material interno (no se publica: `clubs/` está en `.vercelignore`).
Esquema de referencia: `pizarra/manifest.js`. Plantilla vacía: `manifest.js`.

## Regla de oro

Solo se publica lo que el club ha confirmado. Lo pendiente se queda como
`PENDIENTE_CLUB` y no se pinta. Su valor propuesto va a `CONFIRMAR.md`
(local, fuera de Git), nunca al repo, que es público.

## Pasos

1. **Copiar la carpeta.** `cp -R pizarra <slug>` y, en `<slug>/index.html`,
   cambiar el script del manifest a `../<slug>/manifest.js`. Siempre con `../`:
   Vercel sirve `/<slug>` sin barra final.
2. **Rellenar el manifest** a partir de `clubs/_plantilla/manifest.js`. Los
   datos que caducan (tarifas, condiciones, coordenadas…) llevan `verificado` y
   `fuente`.
3. **Cabecera de `<slug>/index.html`**: `title`, `description`, canónica, Open
   Graph, el `h1` y la localidad del hero y del pie. Solo con datos confirmados.
   El JSON-LD, los enlaces de reservas y WhatsApp y todas las secciones los
   escribe el generador: no se tocan a mano.
4. **Plano del pie**, solo con coordenadas confirmadas:
   `node clubs/_plantilla/generar-mapa.js <lat> <lng> assets/maps/<slug>.svg`
   y `contacto.mapImage: '../assets/maps/<slug>.svg'`. Anota el plano en
   `assets/credits.json` (OpenStreetMap, ODbL).
5. **Generar y validar**: `node tools/generar.js` y `node tools/validar.js`
   (con los hooks activos, `git config core.hooksPath tools/hooks`, lo hace el commit).
6. **Darlo a conocer y publicar**: tarjeta del club en `index.html` (lista
   «Clubes»), URL en `sitemap.xml` y `?v=` nuevo en todos los HTML.

## Avisos con fecha (`eventos`)

Cada aviso lleva `hasta` obligatorio, con zona horaria
(`2026-10-11T23:59:00+02:00`). Solo lo pinta el navegador, entre `desde`
(opcional) y `hasta`; pasada la fecha desaparece sin tocar nada. Sin `hasta`
válido no se pinta. Nunca se escriben eventos en el HTML ni en el JSON-LD.

## Patrocinadores

La sección solo aparece con `patrocinadores.listaCompleta: true`, es decir, con
la lista completa confirmada por el club. Nunca se publica una lista parcial.

## Fotos

Fotos reales en `assets/galeria/` con `<nombre>-480.avif`, `-960.avif`,
`-1440.avif` y `-960.jpg`, y una entrada en `galeria` del manifest. Sin fotos,
la sección no se muestra. Anota cada foto en `assets/credits.json`.
