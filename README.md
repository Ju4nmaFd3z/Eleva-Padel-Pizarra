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

**Nada se carga desde internet.** Las tipografías (`assets/fonts/`), Leaflet
(el motor del mapa) y GSAP están **autoalojados** en este repositorio: no hay
Google Fonts ni jsDelivr ni ningún otro CDN. La única conexión externa que hace
la web es la descarga de las imágenes del mapa (teselas de CARTO) en el pie de
`/pizarra`. Esto está declarado en `privacidad.html`: **si algún día se añade un
servicio externo (analítica, fuentes, un vídeo incrustado), hay que actualizar
esa página.**

---

## Ver la web en tu ordenador

Abre `index.html` (la landing) o `pizarra/index.html` (el club) haciendo doble
clic; se abren en tu navegador. La navegación entre `/` y `/pizarra` y el mapa
del pie solo funcionan del todo una vez publicado en Vercel (usan rutas del
servidor).

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
> `.vscode/`) que **no debe publicarse**. Está fuera de Git (ver `.gitignore`),
> así que desplegando desde Git nunca sale. Si en cambio arrastras la carpeta
> entera al "Upload" de Vercel, **se subiría también ese material interno**.

Como red de seguridad adicional existe **`.vercelignore`**, que excluye del
despliegue `presupuesto/`, `.claude/`, `.vscode/`, la carpeta `clubs/`
(plantilla interna, no es una página pública) y `README.md`. Si algún día
añades otra carpeta interna, añádela también ahí.

El archivo `vercel.json` deja listas las URLs limpias (`/pizarra`,
`/privacidad`), las cabeceras de seguridad (incluida una política de seguridad
de contenido restringida a este propio dominio) y el cacheo. No hay que tocarlo
salvo que cambie la estructura del sitio.

---

## Cambiar el teléfono, la dirección, el mapa y los enlaces del club

Los datos del club de Pizarra están en **`pizarra/manifest.js`**. Ábrelo con
cualquier editor de texto y busca el bloque `brand`:

```js
phone:              '34659143103',   // ← número sin + ni espacios (empieza por 34)
phoneDisplayPrefix: '+34',           // ← cómo se muestra el prefijo
phoneRegex:         '^34\\d{9}$',    // ← validación del número
address:            'Pasaje de Jerez S/N · 29560 Pizarra, Málaga',
geo:                { lat: 36.769391, lng: -4.709363 },   // ← mapa del pie
instagram:          { url: 'https://instagram.com/elevapadelpizarra', handle: '@elevapadelpizarra' },
whatsappCommunity:  'https://chat.whatsapp.com/…',        // grupo de WhatsApp
volaReservas:       'https://vola.plus/app-link/club/1498',// reservas
mapsUrl:            'https://maps.app.goo.gl/…',          // "cómo llegar"
schedule:           'L–D · 9:00–00:00',                    // horario visible
```

Para obtener `lat`/`lng`: en Google Maps, clic derecho sobre la ubicación del
club y copia las dos coordenadas (latitud, longitud). El mapa del pie (Leaflet
autoalojado + teselas de CARTO sobre datos de OpenStreetMap) se dibuja solo con
esas coordenadas; no hace falta ninguna clave de Google. Si el mapa no puede
montarse, la web deja en su lugar el enlace "Ver en Google Maps".

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
manifest.)

---

## Cambiar los textos

- Los textos de cada web están en su HTML: `index.html` para la landing,
  `pizarra/index.html` para el club. Las listas repetibles del club (pools,
  equipo, patrocinadores y tarifas) se rellenan desde `pizarra/manifest.js`.
- Las **traducciones comunes** (Español / Inglés / Neerlandés) están en
  **`js/translations.js`**. Cada texto traducible lleva un atributo `data-i18n`
  en el HTML; su traducción vive bajo la misma clave para los tres idiomas. Si
  añades o cambias un texto traducible, actualízalo en los tres.
- Las **traducciones propias de una sede** (ciudad, horario real, claim, la bio
  de su monitora…) van en el bloque **`i18n`** del manifest de ese club, no en
  `js/translations.js`. El motor busca primero ahí y, si no encuentra la clave,
  cae al archivo común. Así una segunda sede no hereda "PIZARRA · MÁLAGA".

---

## Cambiar las fotos

Las fotos van en `assets/img/`. Los nombres que la web espera son:

| Archivo                              | Dónde aparece                          |
|--------------------------------------|----------------------------------------|
| `hero.jpg`                           | Fondo del inicio del club              |
| `club-01.jpg` … `club-03.jpg`        | Collage de "El Club" y red de sedes    |
| `team-lorena.jpg`                    | Foto del equipo (Lorena Vano)          |
| `gallery-01.jpg` … `gallery-16.jpg`  | Galería de imágenes                    |
| `og.jpg`                             | Vista previa al compartir (1200×630 px)|

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

**Convención: `?v=YYYYMMDD` con la fecha del cambio. Valor actual: `20260926`.**

Hay que subirlo **en los tres HTML**, y con **el mismo número en todos** (si no,
el mismo archivo se cachea dos veces):

| Archivo             | Qué lleva `?v=`                                                                                              |
|---------------------|--------------------------------------------------------------------------------------------------------------|
| `index.html`        | `css/fonts.css`, `css/main.css`, `js/translations.js`, `js/main.js`                                          |
| `pizarra/index.html`| `../css/fonts.css`, `../lib/leaflet.min.css`, `../css/main.css`, `../lib/leaflet.min.js`, `../lib/gsap.min.js`, `../lib/ScrollTrigger.min.js`, `../pizarra/manifest.js`, `../js/translations.js`, `../js/main.js` |
| `privacidad.html`   | `css/fonts.css` (es la única hoja que carga; tiene su propio CSS embebido)                                    |

Truco para verlos todos de golpe:

```sh
grep -rn '?v=' --include='*.html' .
```

---

## Añadir un club nuevo a la red

La arquitectura es **una carpeta por club** (`/pizarra`, `/marbella`, …). El
paso a paso completo y verificado está en **`clubs/_plantilla/README.md`**, con
`clubs/_plantilla/manifest.js` como esquema de referencia. En resumen: copia
`/pizarra`, edita lo estático-SEO de su `index.html`, rellena su `manifest.js`
(incluido su bloque `i18n`), añade la sede a `HOME_CLUBS` en `js/main.js`, añade
la URL a `sitemap.xml` y sube el cache-buster.

La carpeta `clubs/` es **material interno**: está excluida del despliegue en
`.vercelignore` y no es una página pública.

---

## Estructura de archivos

```
Eleva-Padel-Pizarra/
├── index.html            ← landing de marca (B2B), raíz /
├── privacidad.html       ← aviso legal, privacidad, normas y cookies (noindex)
├── 404.html              ← página de error
├── pizarra/
│   ├── index.html        ← web del club (/pizarra)
│   └── manifest.js       ← datos del club (teléfono, mapa, pools, i18n propio…)
├── clubs/_plantilla/     ← esquema + guía para dar de alta clubes (NO se publica)
│   ├── manifest.js
│   └── README.md
├── css/
│   ├── main.css          ← todos los estilos (compartidos)
│   └── fonts.css         ← @font-face de las fuentes autoalojadas
├── js/
│   ├── main.js           ← interactividad + motor de render (compartido)
│   └── translations.js   ← traducciones comunes ES / EN / NL
├── lib/                  ← librerías locales, sin CDN
│   ├── leaflet.min.js / leaflet.min.css / images/   ← mapa
│   ├── gsap.min.js
│   └── ScrollTrigger.min.js
├── assets/
│   ├── fonts/            ← .woff2 de Cormorant Garamond, Inter y Space Mono
│   ├── img/              ← fotos del club y galería
│   ├── pools/opt/        ← imágenes de pools optimizadas (AVIF + JPEG)
│   └── credits.json      ← créditos de imágenes
├── robots.txt
├── sitemap.xml
├── vercel.json           ← rutas limpias, cabeceras de seguridad y cacheo
└── .vercelignore         ← qué NO se publica (presupuesto/, clubs/, …)
```

---

## Preguntas frecuentes

**¿Necesito un servidor para verla?**
Para editar y previsualizar, no: abre los `index.html` directamente. Para que
funcionen la navegación entre páginas y el mapa, publícala en Vercel.

**¿Qué navegadores son compatibles?**
Todos los modernos: Chrome, Firefox, Safari, Edge. Internet Explorer no está
soportado.

**El mapa no aparece, ¿es normal?**
El mapa del pie descarga sus imágenes de CARTO (sobre datos de OpenStreetMap) y
necesita conexión a internet. Si no carga, se muestra automáticamente un enlace
"Ver en Google Maps" como alternativa.

**¿Dónde se guardan los datos del formulario del club?**
En ningún sitio. El formulario no envía nada a ningún servidor: compone un
mensaje de WhatsApp con lo que has escrito y abre WhatsApp para que lo envíes
tú. No hay base de datos ni backend. Está explicado así en `/privacidad`.

**¿La web usa cookies o analítica?**
No. Solo guarda en el navegador el idioma elegido (`eleva-lang`) y una marca de
"presentación ya vista" (`eleva-splash-seen`). Por eso no hay banner de cookies.
Si algún día se añade analítica, hay que poner banner **y** actualizar
`/privacidad`.

**El club no tiene email, ¿es un olvido?**
No: es una decisión. Los únicos canales son el teléfono/WhatsApp
**+34 659 14 31 03** y el Instagram **@elevapadelpizarra**. No añadas una
dirección de correo en ninguna página.

---

*Diseño web por Juanma Fernández · [juanma-dev-portfolio.vercel.app](https://juanma-dev-portfolio.vercel.app)*
