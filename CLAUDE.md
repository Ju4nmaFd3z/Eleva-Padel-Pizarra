# Eleva Pádel — notas para Claude Code

Web estática (HTML/CSS/JS, **sin build, sin npm, sin framework**) desplegada en
Vercel desde `main` (cada push publica en producción:
https://eleva-padel-pizarra.vercel.app). El repo de GitHub es **público**.
Guía de uso completa en `README.md`; alta de sedes en `clubs/_plantilla/README.md`.

## Páginas
- `/` → `index.html` (landing B2B de la marca Eleva Pádel, sin manifest)
- `/pizarra` → `pizarra/index.html` + `pizarra/manifest.js` (el club)
- `/privacidad` → `privacidad.html` (legal, CSS propio, sin JS) · `404.html`

## Reglas que no se rompen
1. **Rutas relativas con `../`** en la página del club, y el manifest SIEMPRE como
   `../<slug>/manifest.js`: Vercel sirve `/pizarra` sin barra final, así que
   `manifest.js` a secas resolvería a `/manifest.js` (404). Única excepción:
   `404.html`, que usa rutas absolutas.
2. **Previsualizar solo con `node tools/servidor-local.js`** (imita Vercel).
   Doble clic y `python3 -m http.server` esconden el bug de la regla 1.
3. **Sin CDN ni terceros en ejecución.** La CSP de `vercel.json` es `'self'`
   (script con hash sha256 del único script inline). Añadir un tercero obliga a
   tocar la CSP **y** `privacidad.html`.
4. **El club no usa email.** Ninguna dirección de correo en ningún archivo, en
   especial la personal del propietario. Canales: tel/WhatsApp +34 659 14 31 03
   e Instagram @elevapadelpizarra.
5. **Pools sin horario fijo**: nunca publicar día/hora; el CTA es consultar por
   WhatsApp.
6. **i18n ES/EN/NL**: `js/translations.js` (común, valores neutros) debe tener
   las mismas claves en los tres idiomas (hoy 283). Lo propio de una sede va en el
   bloque `i18n` de su manifest. Orden: club[lang] → común[lang] → club.es → común.es.
7. **Cache-buster** `?v=YYYYMMDD` (hoy `20260927b`) igual en todos los `<link>`
   y `<script>` de los 4 HTML; subirlo al cambiar CSS/JS/manifest.
8. **No inventar datos del club.** Si un dato no está confirmado, no se publica.

## Arquitectura que conviene saber
- `js/main.js` (IIFE) renderiza desde `window.__ELEVA__`: pools, equipo,
  patrocinadores, tarifas, galería, teléfono, mapa. SEO (title, meta, JSON-LD,
  H1) es HTML estático.
- **Mapa del pie** = SVG propio (`assets/maps/pizarra.svg`, campo
  `brand.mapImage`) generado con `clubs/_plantilla/generar-mapa.js`. No hay
  Leaflet ni teselas: CARTO pasó a exigir clave y OSM bloquea el uso directo.
- Servicios: pin+scrub con GSAP en escritorio; sin GSAP o con reduced-motion
  las tarjetas se apilan (clases `.is-pinned` / `.is-carousel`).
- El idioma solo se guarda en `localStorage` cuando el usuario lo elige
  (así lo describe la política de cookies).
- Fuentes variables autoalojadas: un archivo por familia/estilo/subset.
- Excluido del despliegue (`.vercelignore`): `clubs/`, `tools/`, `README.md`,
  `CLAUDE.md`, `assets/credits.json` y material interno.

## Trampas al verificar
- `/pizarra` y la galería/mapa son perezosos: hacer scroll antes de medir.
- GSAP escala las medallas: medir con `offsetWidth`, no `getBoundingClientRect`.
- El splash se muestra una vez por pestaña (`sessionStorage`).
- Producción puede responder 403 `x-vercel-mitigated: challenge` si se hacen
  muchas peticiones seguidas: no es un fallo del sitio.

## Pendiente (depende del cliente, no de código)
NIF y titular del aviso legal (lo aporta el propietario) · si los precios llevan
IVA · confirmar «4 pistas outdoor», cristal, LED y zona chill-out · cancelación
con 24 h · «La Herradura» vs «Bar La Herradura» · fotos reales (hoy de banco,
rotuladas como ilustrativas) y foto de Maripaz · consentimiento documentado de
la foto de Lorena · reenviar el sitemap en Search Console.

## Decisiones tomadas (no reabrir sin preguntar)
Sin email (riesgo LSSI asumido) · i18n solo en cliente, sin `/en` ni `/nl` ·
`/privacidad` solo en español · enlaces internos como `…/index.html` (308 en
Vercel a cambio de funcionar en local) · `'unsafe-inline'` en `style-src`.
