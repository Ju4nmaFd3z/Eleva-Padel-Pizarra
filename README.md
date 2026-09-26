# Eleva Pádel — Web Oficial

Web estática lista para publicar. Sin instalaciones, sin `npm`, sin build.

El proyecto tiene **dos webs que comparten el mismo diseño y motor**:

| URL           | Archivo                | Qué es                                                      |
|---------------|------------------------|-------------------------------------------------------------|
| `/`           | `index.html`           | **Landing de marca (B2B)** para dueños de clubes.           |
| `/pizarra`    | `pizarra/index.html`   | **Web del club** de Pizarra (la primera sede).              |
| `/privacidad` | `privacidad.html`      | Aviso legal, cancelaciones, normas, privacidad y cookies.   |
| *(error 404)* | `404.html`             | Página de "no encontrado" con enlaces a `/` y a `/pizarra`. |

Todo lo común vive en la raíz y lo comparten las dos webs: `css/main.css`,
`css/fonts.css`, `js/main.js`, `js/translations.js`, `lib/` y `assets/`.

**Nada se carga desde internet.** Las tipografías (`assets/fonts/`) y GSAP
(`lib/`) están **autoalojados**, y el mapa del pie de `/pizarra` es una imagen
SVG propia (`assets/maps/pizarra.svg`) hecha con datos de OpenStreetMap. Al
cargar la página no se conecta con ningún tercero. Esto está declarado en
`privacidad.html`: **si algún día se añade un servicio externo (analítica,
fuentes, un mapa interactivo, un vídeo incrustado), hay que actualizar esa
página y la CSP de `vercel.json`.**

---

## Ver la web en tu ordenador

Desde la raíz del repo, con Node 18 o superior (no hace falta instalar nada):

```sh
node tools/servidor-local.js
```

y abre <http://localhost:3000> (landing) y <http://localhost:3000/pizarra>
(club). Ese servidor imita a Vercel: URLs sin `.html` y **sin barra final**,
las cabeceras y la CSP de `vercel.json`, lo excluido en `.vercelignore` y la
página 404.

> **No previsualices con doble clic (`file://`) ni con `python3 -m http.server`.**
> Los dos tratan `/pizarra` como `/pizarra/` y esconden el error más típico de
> este proyecto: en Vercel `/pizarra` se sirve **sin barra final**, así que una
> ruta relativa como `manifest.js` apunta a `/manifest.js` (que no existe). Por
> eso todas las rutas de la página del club llevan el prefijo `../`.

---

## Publicar en Vercel

**Publica siempre desde Git.** Es la forma correcta y la más segura:

1. Sube los cambios al repositorio de GitHub (`git push`).
2. En **vercel.com → Add New → Project → Import Git Repository**, elige este
   repositorio y pulsa **Deploy**.
3. A partir de ahí, **cada `push` a `main` publica automáticamente**. No hay que
   volver a subir nada a mano.
4. Puedes conectar tu dominio propio desde el panel de Vercel.

> ### ⚠️ No uses "Upload" ni arrastres la carpeta
>
> La carpeta local contiene material interno (`presupuesto/`, `.claude/`,
> `.vscode/`, `HANDOFF-AUDITORIA.md`) que **no debe publicarse**. Está fuera de
> Git (ver `.gitignore`), así que desplegando desde Git nunca sale. Si en cambio
> arrastras la carpeta entera al "Upload" de Vercel, **se subiría también ese
> material interno**.

Como red de seguridad adicional existe **`.vercelignore`**, que excluye del
despliegue `presupuesto/`, `.claude/`, `.vscode/`, `clubs/` (plantilla interna),
`tools/` (herramientas de desarrollo), `README.md`, `HANDOFF-AUDITORIA.md` y
`assets/credits.json` (registro interno de licencias de las fotos). Si algún día
añades otra carpeta o archivo interno, añádelo también ahí.

El archivo `vercel.json` deja listas las URLs limpias (`/pizarra`,
`/privacidad`), las cabeceras de seguridad (incluida una política de seguridad
de contenido restringida a este propio dominio) y el cacheo. No hay que tocarlo
salvo que cambie la estructura del sitio o se añada un servicio externo.

---

## Cambiar el teléfono, la dirección, el mapa y los enlaces del club

Los datos del club de Pizarra están en **`pizarra/manifest.js`**. Ábrelo con
cualquier editor de texto y busca el bloque `brand`:

```js
phone:              '34659143103',   // ← número sin + ni espacios (empieza por 34)
phoneDisplayPrefix: '+34',           // ← cómo se muestra el prefijo
phoneRegex:         '^34\\d{9}$',    // ← validación del número
address:            'Pasaje de Jerez S/N · 29560 Pizarra, Málaga',
geo:                { lat: 36.769391, lng: -4.709363 },
instagram:          { url: 'https://instagram.com/elevapadelpizarra', handle: '@elevapadelpizarra' },
whatsappCommunity:  'https://chat.whatsapp.com/…',        // grupo de WhatsApp
volaReservas:       'https://vola.plus/app-link/club/1498',// reservas
mapsUrl:            'https://maps.app.goo.gl/…',          // "cómo llegar"
schedule:           'L–D · 9:00–00:00',                    // horario (ver nota)
mapImage:           '../assets/maps/pizarra.svg',          // plano del pie
```

**El mapa del pie** es un plano SVG estático que se genera **una sola vez** a
partir de las coordenadas (datos de OpenStreetMap, sin claves ni servicios de
pago). Si cambia la ubicación, vuelve a generarlo:

```sh
node clubs/_plantilla/generar-mapa.js 36.769391 -4.709363 assets/maps/pizarra.svg
```

Para obtener `lat`/`lng`: en Google Maps, clic derecho sobre la ubicación del
club y copia las dos coordenadas. Todo el plano enlaza a `mapsUrl`. Sin
`mapImage`, el pie muestra solo el enlace "Ver en Google Maps".

**El horario** que se ve en la web sale de la clave `club.scheduleValue` del
bloque `i18n` del manifest (traducida en cada idioma). `brand.schedule` solo se
usa si esa clave no existe. Si cambia el horario, edita las dos.

### El teléfono de la landing de marca

La landing (`/`) **no carga el manifest**, así que su número no puede salir de
ahí. Vive en **tres sitios**, y los tres deben coincidir:

| Dónde                                             | Qué es                                                                 |
|---------------------------------------------------|------------------------------------------------------------------------|
| `js/main.js` → constante `B2B_PHONE` (arriba, en el bloque *CONSTANTES*) | **La fuente de verdad.** Al cargar la página, el JS reescribe con ella el `href` de todos los enlaces con la clase `js-wa-b2b`. |
| `index.html` → los `href="https://wa.me/…"` de los enlaces `js-wa-b2b`, y el número **visible** en la sección de contacto | Respaldo para que el botón funcione aunque el JS no llegue a ejecutarse, y el número que se lee en pantalla. |
| `js/translations.js` → clave `home.waB2B`         | **Solo el texto** del mensaje de WhatsApp, en los tres idiomas. No contiene el número. |

Si cambia el número de la marca: edita `B2B_PHONE` en `js/main.js` **y** los
`href` de `index.html`. (En `/pizarra` no hace falta: ahí el teléfono sale del
manifest; solo los avisos `<noscript>` de `pizarra/index.html` lo repiten.)

---

## Cambiar los textos

- Los textos de cada web están en su HTML: `index.html` para la landing,
  `pizarra/index.html` para el club. Las listas repetibles del club (pools,
  equipo, patrocinadores y tarifas) se rellenan desde `pizarra/manifest.js`.
- Las **traducciones comunes** (Español / Inglés / Neerlandés) están en
  **`js/translations.js`**. Cada texto traducible lleva un atributo `data-i18n`
  en el HTML; su traducción vive bajo la misma clave para los tres idiomas. Si
  añades o cambias un texto traducible, actualízalo en los tres: **las tres
  tablas deben tener exactamente las mismas claves** (hoy, 283 cada una).
- Las **traducciones propias de una sede** (ciudad, pistas, horario, precios de
  los pools, equipo, descripciones de la galería, título de la página…) van en
  el bloque **`i18n`** del manifest de ese club, no en `js/translations.js`. El
  motor busca primero ahí y, si no encuentra la clave, cae al archivo común. Así
  una segunda sede no hereda los datos de Pizarra.

---

## Cambiar las fotos

Las fotos van en `assets/img/`:

| Archivo                              | Dónde aparece                          |
|--------------------------------------|----------------------------------------|
| `hero.jpg`                           | Fondo del inicio del club (`css/main.css`) y su `preload` en `pizarra/index.html` |
| `club-01.jpg` … `club-03.jpg`        | Collage de "El Club" (`data-bg` en `pizarra/index.html`) y tarjeta de la sede en la landing |
| `team-lorena.jpg`                    | Foto del equipo (Lorena Vano), desde el manifest |
| `gallery-NN.jpg`                     | Galería: la lista exacta (12 fotos, en orden) está en `gallery:` del manifest; sus descripciones, en `gallery.img1…12` del bloque `i18n` |
| `og.jpg`                             | Vista previa al compartir (1200×630 px)|
| `favicon.svg` (+ `/favicon.ico`, `/apple-touch-icon.png` en la raíz) | Icono del sitio |

Las fotos actuales de galería, collage, hero y `og.jpg` son **de banco e
ilustrativas** (la galería lo dice en su subtítulo). La procedencia y licencia
de cada una está en `assets/credits.json` (interno, no se publica). Al poner
fotos reales, actualiza ese archivo y las descripciones de la galería.

**Si sustituyes una foto conservando su nombre**, los visitantes que ya la
tengan en caché pueden seguir viendo la antigua hasta 7 días: mejor ponle un
nombre nuevo y actualiza la referencia.

Las imágenes de los pools están en `assets/pools/opt/` ya optimizadas en varios
tamaños (AVIF + JPEG de respaldo). Si las regeneras, mantén esa estructura:
`<base>-240.avif`, `<base>-480.avif`, `<base>-720.avif` y `<base>-480.jpg`.

**Consejo:** cada foto debería pesar menos de 500 KB para que cargue rápido.
Puedes comprimir gratis en [squoosh.app](https://squoosh.app).

---

## Actualizar el caché (tras cualquier cambio)

Cuando cambies un archivo compartido (estilos, textos, código, manifest), los
navegadores pueden seguir usando la versión antigua. Para forzar la
actualización se usa un **cache-buster**: el `?v=` que acompaña a cada archivo
en el HTML.

**Convención: `?v=YYYYMMDD` con la fecha del cambio. Valor actual: `20260927`.**

Hay que subirlo **en los cuatro HTML**, y con **el mismo número en todos** (si
no, el mismo archivo se cachea dos veces):

| Archivo             | Qué lleva `?v=`                                                                                              |
|---------------------|--------------------------------------------------------------------------------------------------------------|
| `index.html`        | `css/fonts.css`, `css/main.css`, `js/translations.js`, `js/main.js`                                          |
| `pizarra/index.html`| `../css/fonts.css`, `../css/main.css`, `../lib/gsap.min.js`, `../lib/ScrollTrigger.min.js`, `../pizarra/manifest.js`, `../js/translations.js`, `../js/main.js` |
| `privacidad.html`   | `css/fonts.css` (es la única hoja que carga; tiene su propio CSS embebido)                                    |
| `404.html`          | `/css/fonts.css`                                                                                               |

El `preload` de `hero.jpg` va **sin** `?v=` a propósito: tiene que ser la misma
URL exacta que pide el CSS, o la imagen se descargaría dos veces.

Truco para verlos todos de golpe:

```sh
grep -rn '?v=' --include='*.html' .
```

---

## Añadir un club nuevo a la red

La arquitectura es **una carpeta por club** (`/pizarra`, `/marbella`, …). El
paso a paso completo está en **`clubs/_plantilla/README.md`**, con
`clubs/_plantilla/manifest.js` como esquema de referencia. En resumen: copia
`/pizarra`, cambia la ruta de su manifest, edita lo estático de su `index.html`,
rellena su `manifest.js` (incluido su bloque `i18n`), genera su mapa, añade la
sede a `HOME_CLUBS` en `js/main.js`, añade la URL a `sitemap.xml` y sube el
cache-buster.

La carpeta `clubs/` es **material interno**: está excluida del despliegue en
`.vercelignore` y no es una página pública.

---

## Estructura de archivos

```
Eleva-Padel-Pizarra/
├── index.html            ← landing de marca (B2B), raíz /
├── privacidad.html       ← aviso legal, privacidad, normas y cookies (noindex)
├── 404.html              ← página de error (rutas absolutas: se sirve en cualquier URL)
├── favicon.ico · apple-touch-icon.png   ← iconos que los navegadores piden en la raíz
├── pizarra/
│   ├── index.html        ← web del club (/pizarra)
│   └── manifest.js       ← datos del club (teléfono, mapa, pools, i18n propio…)
├── clubs/_plantilla/     ← esquema + guía para dar de alta clubes (NO se publica)
│   ├── manifest.js
│   ├── generar-mapa.js   ← genera el plano SVG del pie de una sede
│   └── README.md
├── tools/
│   └── servidor-local.js ← previsualizar como en Vercel (NO se publica)
├── css/
│   ├── main.css          ← todos los estilos (compartidos)
│   └── fonts.css         ← @font-face de las fuentes autoalojadas
├── js/
│   ├── main.js           ← interactividad + motor de render (compartido)
│   └── translations.js   ← traducciones comunes ES / EN / NL
├── lib/                  ← librerías locales, sin CDN
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
├── assets/
│   ├── fonts/            ← .woff2 de Cormorant Garamond, Inter y Space Mono
│   ├── img/              ← fotos, og.jpg y favicon.svg
│   ├── maps/             ← planos SVG del pie de cada sede
│   ├── pools/opt/        ← imágenes de pools optimizadas (AVIF + JPEG)
│   └── credits.json      ← procedencia y licencias de las imágenes (NO se publica)
├── robots.txt
├── sitemap.xml
├── vercel.json           ← rutas limpias, cabeceras de seguridad y cacheo
└── .vercelignore         ← qué NO se publica (presupuesto/, clubs/, tools/, …)
```

---

## Preguntas frecuentes

**¿Necesito un servidor para verla?**
Sí, el de `tools/servidor-local.js` (ver arriba). Con doble clic la página se
abre, pero no se comporta como en Vercel y puede ocultar errores de rutas.

**¿Qué navegadores son compatibles?**
Todos los modernos: Chrome, Firefox, Safari, Edge. Internet Explorer no está
soportado.

**¿Por qué el mapa no se puede mover ni hacer zoom?**
Es una imagen estática a propósito: no depende de ningún servicio externo (el
anterior, CARTO, empezó a exigir clave y el mapa dejó de verse), no envía datos
del visitante a terceros y pesa 17 KB. Al pulsarlo se abre Google Maps.

**¿Dónde se guardan los datos del formulario del club?**
En ningún sitio. El formulario no envía nada a ningún servidor: compone un
mensaje de WhatsApp con lo que has escrito y abre WhatsApp para que lo envíes
tú. Sin JavaScript, el botón está desactivado (así el navegador no puede
mandar los datos en la URL). Está explicado así en `/privacidad`.

**¿La web usa cookies o analítica?**
No. Solo guarda en el navegador el idioma **cuando el usuario lo elige**
(`eleva-lang`) y una marca de "presentación ya vista" (`eleva-splash-seen`).
Por eso no hay banner de cookies. Si algún día se añade analítica, hay que poner
banner **y** actualizar `/privacidad`.

**El club no tiene email, ¿es un olvido?**
No: es una decisión. Los únicos canales son el teléfono/WhatsApp
**+34 659 14 31 03** y el Instagram **@elevapadelpizarra**. No añadas una
dirección de correo en ninguna página.

---

*Diseño web por Juanma Fernández · [juanma-dev-portfolio.vercel.app](https://juanma-dev-portfolio.vercel.app)*
