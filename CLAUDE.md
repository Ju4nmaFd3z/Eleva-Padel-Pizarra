# Eleva Pádel — notas para Claude Code

Web estática (HTML/CSS/JS, **sin build en Vercel, sin npm en la raíz, sin framework**)
desplegada en Vercel desde `main`: cada push a `main` publica en producción
(https://eleva-padel-pizarra.vercel.app). El repo de GitHub es **público**.
Servicio de Biznaga Consulting para Eleva Pádel. Guía de uso en `README.md`;
convención de commits en `CONTRIBUTING.md`; alta de clubes en `clubs/_plantilla/README.md`.

## Páginas
- `/` → `index.html`: web de la **marca** Eleva Pádel. Sigue siendo de la marca
  (no se convierte en la del club); desde ella se accede a los clubes.
- `/pizarra` → `pizarra/index.html` (generado) + `pizarra/manifest.js`: club **Eleva Pádel Pizarra**.
- `/privacidad` → `privacidad.html` (legal, solo en español, CSS propio, sin JS) · `404.html`.

## Modo mantenimiento (`middleware.js`: 503 + `Retry-After` + noindex en todo)
- Activar: variable `MANTENIMIENTO=1` en Vercel (Production) + Redeploy.
- Desactivar: borrar la variable o ponerla a `0` + Redeploy.
- Saltárselo: `?acceso=<MANTENIMIENTO_CLAVE>` (cookie `eleva-acceso`, 30 días). La clave nunca va al repo.

## Reglas que no se rompen
1. **No inventar datos.** Solo se publica lo confirmado por el cliente. Lo
   pendiente se marca `PENDIENTE_CLUB` / `PENDIENTE_MARCA` y no se pinta. El valor
   propuesto vive solo en `CONFIRMAR.md` (local; en `.gitignore` y `.vercelignore`):
   nunca en un archivo servido o versionado, ni oculto ni comentado, ni en un mensaje de commit.
2. **Datos que caducan** (tarifas, condiciones, pools, coordenadas…) llevan
   `verificado: 'AAAA-MM-DD'` y `fuente` en el manifest. `tools/validar.js` avisa a los 90 días.
3. **Eventos con fecha de fin obligatoria** (`eventos[].hasta`): solo los pinta el
   navegador y se ocultan solos. Nunca en el HTML generado ni en el JSON-LD. Nada de
   textos que caduquen («este verano», «nueva temporada», «recién inaugurado»…).
4. **El HTML del club se genera**: tras tocar un manifest, `node tools/generar.js`.
   No se editan a mano las zonas `data-gen` ni el `hidden` de `data-seccion`.
5. **Rutas `../` en la página del club** y el manifest siempre como
   `../<slug>/manifest.js` (Vercel sirve `/pizarra` sin barra final). Excepción:
   `404.html`, con rutas absolutas.
6. **Previsualizar solo con `node tools/servidor-local.js`** (imita Vercel e
   incluye el middleware).
7. **Sin CDN ni terceros en ejecución.** CSP `'self'` en `vercel.json`, sin scripts
   inline (salvo JSON-LD). Añadir un tercero obliga a tocar la CSP **y** `privacidad.html`.
8. **Sin email.** Ninguna dirección de correo en ningún archivo. Canales del club:
   WhatsApp +34 659 14 31 03 e Instagram @elevapadelpizarra. Se rotula «WhatsApp»;
   nada de enlaces `tel:` hasta confirmar que atienden llamadas.
9. **Horarios de pools**: el club tiene horario semanal (en `CONFIRMAR.md`) pero no
   se publica hasta saber si es fijo, cuánto dura y cómo se avisan los cambios. Mientras,
   ni «horario fijo» ni «horarios variables»: «Información e inscripciones por WhatsApp».
   Cuando se publique, irá en el manifest con `verificado`.
10. **Patrocinadores**: la sección solo se pinta con la lista completa confirmada
    (`patrocinadores.listaCompleta === true`); nunca una lista parcial.
11. **i18n ES/EN/NL**: `js/translations.js` (solo interfaz) con las mismas claves en los
    tres idiomas. Los datos del club son `{ es, en, nl }` en su manifest (respaldo `es`).
    Textos nuevos: primero en español, a revisión del cliente; EN/NL después.
12. **Cache-buster** `?v=YYYYMMDD[letra]` (hoy `20261005a`) igual en todos los HTML;
    subirlo al cambiar CSS, JS o manifest. Imágenes y fuentes reemplazadas: nombre nuevo.
13. **Git**: trabajo en ramas; push o merge a `main` solo con OK explícito. Commits según
    `CONTRIBUTING.md`: `tipo(ámbito): resumen` en español, presente, minúscula, ≤72,
    cuerpo con fuente y fecha si toca datos, un cambio lógico por commit, sin emojis y
    **sin firmas ni `Co-Authored-By` de IA**. Hooks: `git config core.hooksPath tools/hooks`.

## Identidad visual
- **Logo oficial: `assets/img/favicon.svg`**, diseñado por Juanma y aprobado por el club.
  No hay otro vectorial y no tiene que coincidir con el de las insignias: en la web manda
  este. Es el único origen: `favicon.ico` y `apple-touch-icon.png` se renderizan desde él.
  Nunca se redibuja ni se copia su trazado.
- **Variante sin fondo: `assets/img/logo-sin-fondo.svg`** (`favicon.svg` sin su `<rect>`).
  Va donde el fondo es más oscuro que #1A1A1A, para que no se vea el «cuadrado
  fantasma»: cabecera, pie, hero de `/`, 404, mantenimiento (`middleware.js`) y todas las
  máscaras del movimiento (hero, cortes de sección, transición). Favicon e icono de iOS:
  siempre el original.
- Tipografía: Barlow Condensed 600 (títulos, botones) y Barlow 400/500 (texto),
  autoalojadas, subconjunto latino, OFL en `assets/fonts/OFL-Barlow.txt`.
- Colores muestreados de las insignias: negro `#000`, crema `#EDE4DC`, claro `#DBD2CC`,
  beige `#947E6B`, anillo `#A18572`, tinta `#181411` (superficie alterna de secciones).
  Crema sobre beige (3,1:1) no se usa.
- **Color por insignia, no por género**: campo `color` de cada insignia en
  `pizarra/manifest.js` (muestreado de la palabra de la categoría de su imagen de 720 px,
  04/10/2026; la mixta añade `colorAro`). `render.js` lo lleva al HTML como `--acento` y
  es el único color que marca la categoría (aro y reverso).
- Iconos: Lucide 1.49.0 (`assets/icons/lucide.svg`, `<use href>`, color del texto) solo
  en lo funcional; glifos oficiales de WhatsApp e Instagram (`assets/marcas/`) sin
  modificar, nunca en lugar de la palabra ni como elemento principal. Nada de iconos
  dibujados a mano. Todos miden `--tam-icono` (1,125 em), también el del menú.
- CSS mobile-first con tres puntos de corte: 40rem, 64rem y 90rem. Hover solo dentro de
  `(hover: hover)`. Objetivos táctiles ≥ 44 px; inputs a 16 px.

## Arquitectura
- `js/render.js` convierte el manifest en HTML. Lo usan `tools/generar.js` (escribe el
  HTML en español: todo lo confirmado se ve sin JS) y `js/main.js` (vuelve a pintar al
  cambiar de idioma). `presente(v)`: vacío o `PENDIENTE_*` no se pinta y la sección sin
  datos queda `hidden`.
- `js/main.js`: idioma, menú móvil (con JS; sin JS el menú se ve desplegado), enlaces de
  WhatsApp con mensaje, avisos con fecha y formulario. No hay botón flotante: «Reservar»
  va siempre en la cabecera. Tras repintar al cambiar de idioma emite `eleva:repintado`.
- **Selector de idioma**: en la cabecera, fuera del menú (logo · Reservar · idioma · menú),
  en `/` y `/pizarra`. Botón con el idioma actual que despliega ES, EN, NL: Enter/Espacio/
  flechas abren, flechas/Inicio/Fin recorren, Escape cierra y devuelve el foco, la opción
  activa lleva `aria-current`. Sin JS se oculta (`<noscript>`). Por debajo de 25,5rem el
  nombre del club junto al logo se oculta a la vista en `/pizarra` (queda en `aria-label`).
- **Sistema de movimiento** (uno para las dos páginas): tokens `--dur-*`, `--curva-*`,
  `--retardo-*`, `--dist-*`, `--prof-*`, `--fisica-*` en `:root` de `css/main.css` (versión
  reducida en `prefers-reduced-motion`); espejo en JS en `js/movimiento/nucleo.js`, que
  registra cada módulo con la API `activar · pausar · reanudar · desactivar · reenganchar`
  y la gobierna (movimiento reducido, pestaña oculta, fuera de pantalla, bfcache, resize,
  `eleva:repintado`). Módulos: `scroll.js` (motor JS que mueve el `currentTime` de las
  animaciones `sd-*`: las scroll-driven nativas bajaban a 30 fps en móvil; progreso del
  hero; luz LED de las tarjetas), `puntero.js` (paralaje, inclinación de insignias, imán,
  puntero «punto»; solo ratón), `tacto.js` (giro de insignias por toque/clic/teclado,
  pulso del logo), `tres-d.js` + `pista.js` (pista 3D). Todo lo animado vive en
  `css/movimiento.css`; `main.css` es el estado estático, completo sin JS y con
  movimiento reducido. Solo `transform`/`opacity` (excepción documentada: la transición
  entre páginas). Nada de cursores ni hovers con el logo. Formato de filas reutilizable:
  `.filas > .fila` (el de Cancelaciones).
- **Pista 3D** (`js/movimiento/pista.js`, three.js r186 reducido en `lib/three/`, MIT,
  ≤ 160 KB gzip): reglamento FIP «Rules of Padel» versión «in force as of 1.01.2026»,
  pág. 6 del documento (7 del PDF), diagrama «Laterales – Variante 1»: 2 | 2 | 12 | 2 | 2 m;
  primer tramo pared 3 m + malla hasta 4 m, segundo pared 2 m + malla hasta 3 m, 12 m
  centrales malla hasta 3 m; fondos 3 + 1 m. Sin puerta, suelo, focos ni entorno. Se carga
  diferida, solo visible y en equipos aptos; imagen fija `assets/img/pista-*` de la misma
  escena (si cambia la escena: re-render con nombre nuevo).
- **Borrador de la marca**: `MARCA-borrador.md` y `marca-borrador.js` (raíz, en
  `.gitignore` y `.vercelignore`). `main.js` carga el `.js` solo en localhost con
  `?borrador`. `/` publicado lleva solo lo confirmado.
- `tools/validar.js`: pendientes, fechas de verificación, eventos, claves i18n,
  cache-buster, scripts inline y HTML sincronizado con el manifest.
- Hooks (`tools/hooks/`): `pre-commit` (generar + validar) y `commit-msg` (convención).
- Plano del pie: SVG propio generado con `clubs/_plantilla/generar-mapa.js` desde las
  coordenadas confirmadas; atribución «© OpenStreetMap contributors» bajo el plano.
- El idioma solo se guarda en `localStorage` (`eleva-lang`) cuando el usuario lo elige.
- Excluido del despliegue (`.vercelignore`): `clubs/`, `tools/`, docs, `CONFIRMAR.md`,
  `borradores/`, `capturas/`, `assets/credits.json`, `MARCA-borrador.md`, `marca-borrador.js`.

## Trampas al verificar
- Las previews de Vercel tienen Vercel Authentication: `curl` recibe 302; usar
  `web_fetch_vercel_url` del conector o pedir al usuario que pruebe.
- Las capturas de página completa salen antes de que carguen las imágenes `loading="lazy"`:
  hacer scroll hasta cada sección antes de capturarla.
- Producción puede responder 403 `x-vercel-mitigated: challenge` con muchas
  peticiones seguidas: no es un fallo del sitio.

## Estado del rediseño (octubre 2026)
Hechos en la rama `rediseno`: 1 limpieza, 2 datos, estructura y generador, 3 CSS
mobile-first, 4 iconos y la integración «web viva» (mezcla de las propuestas A y C,
04-05/10/2026; las ramas `propuesta-a` y `propuesta-c` se borran cuando el cliente apruebe). Siguen: 5 textos en español
(a revisión), 6 EN/NL, 7 legal y 8 QA con otro agente. Al final, con OK explícito: sustituir el historial de Git por un único commit
documentado en `CHANGELOG.md` (plan aprobado, ver memoria; el repo no tiene forks a
01/10/2026; los commits van con la identidad de Git actual del propietario, por
decisión suya). Pendientes del cliente y de
la marca: `CONFIRMAR.md`.

## Decisiones tomadas (no reabrir sin preguntar)
`/` es la web de la marca · sin email (riesgo LSSI asumido) · i18n solo en cliente,
sin `/en` ni `/nl` · `/privacidad` solo en español · enlaces internos como
`…/index.html` (308 en Vercel a cambio de funcionar en local) ·
`'unsafe-inline'` en `style-src` · `hero.jpg` se queda sin rotular como ilustrativa ·
lema del Instagram y «Training & Social Club»: no se usan hasta que el cliente decida ·
logo oficial = `favicon.svg` · tipografía Barlow · HTML generado con `tools/generar.js` ·
commits sin firmas de IA.
