# Eleva Pádel — notas para Claude Code

Web estática (HTML/CSS/JS, **sin build, sin npm en la raíz, sin framework**)
desplegada en Vercel desde `main`: cada push a `main` publica en producción
(https://eleva-padel-pizarra.vercel.app). El repo de GitHub es **público**.
Servicio de Biznaga Consulting para Eleva Pádel. Guía de uso en `README.md`;
alta de clubes en `clubs/_plantilla/README.md`.

## Páginas
- `/` → `index.html`: web de la **marca** Eleva Pádel. Sigue siendo de la marca
  (no se convierte en la del club); desde ella se accede a los clubes.
- `/pizarra` → `pizarra/index.html` + `pizarra/manifest.js`: club **Eleva Pádel Pizarra**.
- `/privacidad` → `privacidad.html` (legal, solo en español, CSS propio, sin JS) · `404.html`.

## Modo mantenimiento (`middleware.js`: 503 + `Retry-After` + noindex en todo)
- Activar: variable `MANTENIMIENTO=1` en Vercel (Production) + Redeploy.
- Desactivar: borrar la variable o ponerla a `0` + Redeploy.
- Saltárselo: `?acceso=<MANTENIMIENTO_CLAVE>` (cookie `eleva-acceso`, 30 días). La clave nunca va al repo.

## Reglas que no se rompen
1. **No inventar datos.** Solo se publica lo confirmado por el cliente. Lo
   pendiente se marca `PENDIENTE_CLUB` / `PENDIENTE_MARCA` y no se pinta. El valor
   propuesto vive solo en `CONFIRMAR.md` (local; en `.gitignore` y `.vercelignore`):
   nunca en un archivo servido o versionado, ni oculto ni comentado.
2. **Datos que caducan** (tarifas, condiciones, pools…) llevan en el manifest
   `verificado: 'AAAA-MM-DD'` y `fuente`. `node tools/validar.js` avisa a los 90 días.
3. **Eventos con fecha de fin obligatoria** (`eventos[].hasta`): se ocultan solos.
   Nunca en el HTML fijo ni en el JSON-LD. Nada de textos que caduquen
   («este verano», «nueva temporada», «recién inaugurado»…).
4. **Rutas `../` en la página del club** y el manifest siempre como
   `../<slug>/manifest.js` (Vercel sirve `/pizarra` sin barra final). Excepción:
   `404.html`, con rutas absolutas.
5. **Previsualizar solo con `node tools/servidor-local.js`** (imita Vercel e
   incluye el middleware). Doble clic o `python3 -m http.server` esconden el bug de la regla 4.
6. **Sin CDN ni terceros en ejecución.** CSP `'self'` en `vercel.json`, sin scripts
   inline (salvo JSON-LD). Añadir un tercero obliga a tocar la CSP **y** `privacidad.html`.
7. **Sin email.** Ninguna dirección de correo en ningún archivo. Canales del club:
   WhatsApp +34 659 14 31 03 e Instagram @elevapadelpizarra. Se rotula
   «WhatsApp»; nada de enlaces `tel:` hasta confirmar que atienden llamadas.
8. **Horarios de pools**: el club tiene horario semanal (en `CONFIRMAR.md`) pero no
   se publica hasta saber si es fijo, cuánto dura y cómo se avisan los cambios. Mientras,
   ni «horario fijo» ni «horarios variables»: el CTA es «Información e inscripciones
   por WhatsApp». Cuando se publique, irá en el manifest con `verificado`.
9. **i18n ES/EN/NL**: `js/translations.js` (solo interfaz) con las mismas claves en
   los tres idiomas. Los datos del club son `{ es, en, nl }` en su manifest
   (respaldo: `es`). Textos nuevos: primero en español, a revisión del cliente; EN/NL después.
10. **Cache-buster** `?v=YYYYMMDD` (hoy `20261001`) igual en todos los HTML; subirlo al
    cambiar CSS, JS o manifest. Imágenes y fuentes reemplazadas: nombre nuevo.
11. **Git**: trabajo en ramas; push o merge a `main` solo con OK explícito.

## Arquitectura
- `js/main.js` (IIFE) pinta desde `window.__ELEVA__`: el club, clases, pools,
  otros servicios, cancelaciones, equipo, patrocinadores, galería (vacía = oculta),
  avisos con fecha y plano. `presente(v)` decide: vacío o `PENDIENTE_*` no se pinta
  y la sección sin datos queda `hidden`. SEO (title, meta, JSON-LD, H1) es HTML fijo.
- `tools/validar.js`: pendientes, fechas de verificación, eventos, claves i18n,
  cache-buster y scripts inline. Pasarlo antes de cada commit.
- Mapa del pie: SVG propio generado con `clubs/_plantilla/generar-mapa.js`; hoy no
  hay (coordenadas pendientes).
- El idioma solo se guarda en `localStorage` (`eleva-lang`) cuando el usuario lo elige.
- Excluido del despliegue (`.vercelignore`): `clubs/`, `tools/`, docs, `CONFIRMAR.md`,
  `borradores/`, `capturas/`, `assets/credits.json`.

## Trampas al verificar
- Las previews de Vercel tienen Vercel Authentication: `curl` recibe 302; usar
  `web_fetch_vercel_url` del conector o pedir al usuario que pruebe.
- Producción puede responder 403 `x-vercel-mitigated: challenge` con muchas
  peticiones seguidas: no es un fallo del sitio.

## Estado del rediseño (octubre 2026)
Bloque 1 (limpieza) hecho en la rama `rediseno`: fuera splash, cursor, grano,
aurora, marquees, GSAP, decoraciones y fotos de banco salvo `hero.jpg`. El CSS
actual es el antiguo más un bloque «PROVISIONAL»: se rehace mobile-first en el
bloque 2. Pendientes del cliente y de la marca: `CONFIRMAR.md`.

## Decisiones tomadas (no reabrir sin preguntar)
`/` es la web de la marca · sin email (riesgo LSSI asumido) · i18n solo en cliente,
sin `/en` ni `/nl` · `/privacidad` solo en español · enlaces internos como
`…/index.html` (308 en Vercel a cambio de funcionar en local) ·
`'unsafe-inline'` en `style-src` · `hero.jpg` se queda sin rotular como ilustrativa
hasta tener foto real · lema del Instagram y «Training & Social Club»: no se usan
hasta que el cliente decida.
