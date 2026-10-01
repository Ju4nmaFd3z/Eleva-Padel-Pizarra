# Dar de alta un club

Material interno (no se publica: `clubs/` está en `.vercelignore`).
Esquema de referencia: `pizarra/manifest.js`. Plantilla vacía: `manifest.js`.

> Este procedimiento es provisional: en el bloque 2 del rediseño se decide si
> el HTML del club se genera desde el manifest. Cuando cambie, se actualiza aquí.

## Regla de oro

Solo se publica lo que el club ha confirmado. Lo pendiente se queda como
`PENDIENTE_CLUB` y no se pinta. Su valor propuesto va a `CONFIRMAR.md`
(local, fuera de Git), nunca al repo, que es público.

## Pasos

1. **Copiar la carpeta.** `cp -R pizarra <slug>` y, en `<slug>/index.html`,
   cambiar el script del manifest a `../<slug>/manifest.js`. Siempre con `../`:
   Vercel sirve `/<slug>` sin barra final.
2. **Rellenar el manifest** a partir de `clubs/_plantilla/manifest.js`. Los
   datos que caducan (tarifas, condiciones…) llevan `verificado` y `fuente`.
3. **Cabecera y textos fijos de `<slug>/index.html`**: `title`, `description`,
   canónica, Open Graph, JSON-LD, el `h1` y los enlaces de contacto, reservas,
   Instagram y Maps. Solo con datos confirmados. Ni eventos ni horarios en el
   JSON-LD.
4. **Plano del pie**, solo con coordenadas confirmadas:
   `node clubs/_plantilla/generar-mapa.js <lat> <lng> assets/maps/<slug>.svg`
   y `contacto.mapImage: '../assets/maps/<slug>.svg'`.
5. **Darlo a conocer**: tarjeta del club en `index.html` (lista «Clubes») y URL
   en `sitemap.xml`.
6. **Cache-buster**: subir `?v=` en todos los HTML (mismo valor en todos).

## Avisos con fecha (`eventos`)

Cada aviso lleva `hasta` obligatorio, con zona horaria
(`2026-10-11T23:59:00+02:00`). Se pinta solo entre `desde` (opcional) y `hasta`;
pasada la fecha desaparece sin tocar nada. Sin `hasta` válido no se pinta.
Nunca se escriben eventos en el HTML fijo ni en el JSON-LD.

## Fotos

Fotos reales en `assets/galeria/` con `<nombre>-480.avif`, `-960.avif`,
`-1440.avif` y `-960.jpg`, y una entrada en `galeria` del manifest. Sin fotos,
la sección no se muestra. Anota cada foto en `assets/credits.json`.
