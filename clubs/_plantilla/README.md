# Plantilla de club · Eleva Pádel

Arquitectura **una página estática por club** (sin build, sin npm). Cada club es
una carpeta de primer nivel (`/pizarra`, `/marbella`, …) con dos archivos:

- `index.html` — estático y crítico para SEO (title, meta, canonical, OG,
  JSON-LD, `<h1>`, copy del hero).
- `manifest.js` — datos repetibles del club + sus textos propios
  (`window.__ELEVA__`).

Todo lo demás es **compartido en la raíz**: `css/main.css`, `css/fonts.css`,
`js/main.js` (motor + render), `js/translations.js` (i18n común), `lib/`
(GSAP y ScrollTrigger, locales, sin CDN) y `assets/`.

> **Esta carpeta `clubs/` no se publica.** Está excluida en `.vercelignore`.
> Es material interno: `manifest.js` aquí es solo el **esquema comentado** de
> referencia, `generar-mapa.js` la herramienta del plano del pie y este README
> la guía. **No hay `clubs/_plantilla/index.html`**: el HTML de partida es
> siempre el de `/pizarra`, que es la referencia completa y probada.

---

## Dar de alta un club nuevo · checklist

Ejemplo con el slug `marbella`. Previsualiza siempre con
`node tools/servidor-local.js` (ver el `README.md` de la raíz), **no** con doble
clic ni con `python3 -m http.server`: esos dos esconden los errores de rutas.

### 1. Copiar la sede de referencia

```sh
cp -R pizarra marbella          # trae index.html + manifest.js
```

No copies nada más: los estilos, el JS y los assets ya son compartidos.

### 2. Cambiar la ruta del manifest — lo primero

En `marbella/index.html`, al final del `<body>`:

```html
<script src="../pizarra/manifest.js?v=…" defer></script>   ← antes
<script src="../marbella/manifest.js?v=…" defer></script>  ← después
```

**Si se te olvida, la página se pinta entera con los datos de Pizarra**
(teléfono, equipo, patrocinadores, mapa…), sin romperse. `js/main.js` lo detecta
y avisa en la consola del navegador: *«Esta página es /marbella pero carga el
manifest de "pizarra"»*. El prefijo `../marbella/` es obligatorio: `manifest.js`
a secas apuntaría a `/manifest.js` en Vercel.

### 3. Editar `/marbella/index.html` — lo estático

Lo que el manifest **no** cambia y hay que editar a mano:

| Qué                                   | Dónde                                                        |
|---------------------------------------|--------------------------------------------------------------|
| `<title>`                             | `<head>` (y la clave `meta.title` del i18n del manifest, que lo traduce) |
| `<meta name="description">`           | `<head>`                                                     |
| `<link rel="canonical">`              | → `https://…/marbella`                                       |
| `<link rel="alternate" hreflang="x-default">` | → la misma URL canónica                              |
| `og:url`, `og:title`, `og:description`, `og:image`, `og:image:alt` | bloque Open Graph      |
| `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt` | bloque Twitter/X |
| El bloque **JSON-LD** (`SportsActivityLocation`) | `name`, `description`, `address`, `geo`, `telephone`, `url`, `image`, `priceRange`, `openingHoursSpecification`, `sameAs`, `hasMap` |
| `<h1>` y copy del hero                | primera sección del `<body>`                                 |
| Texto del splash (`.splash-sub-text`) | «Pizarra» → la ciudad de la sede                             |
| Marca lateral (`.brand-mark`)         | «ELEVA · PADEL CLUB · PIZARRA · MÁLAGA»                      |
| Copyright del pie (`.footer-legal`)   | «© 2026 Eleva Padel Club · Pizarra, Málaga»                  |
| Avisos `<noscript>` (aviso de datos y formulario) | el teléfono de WhatsApp de la sede              |
| Galería (`.gallery-img`)              | el número de fotos debe coincidir con `gallery[]` del manifest; el `aria-label` estático de cada una es el respaldo sin JS |
| Collage de «El Club» (`data-bg`)      | las tres fotos de la sede                                    |

Las fotos de fondo del hero (`hero.jpg`, en `css/main.css`) y de redes
(`og.jpg`) son **comunes**: si la sede tiene las suyas, dale nombres propios y
cambia la referencia del CSS (con una regla específica de la sede) y las metas.

### 4. Rellenar `/marbella/manifest.js`

Usa `clubs/_plantilla/manifest.js` como esquema y `pizarra/manifest.js` como
ejemplo real y completo. Rellena `brand` (incluido `mapImage`), `pools`, `team`,
`sponsors`, `pricing`, `gallery` y el bloque **`i18n`** propio de la sede (ver
más abajo: hay claves que **siempre** hay que sobrescribir).

### 5. Generar el mapa del pie

```sh
node clubs/_plantilla/generar-mapa.js <lat> <lng> assets/maps/marbella.svg
```

y en el manifest: `brand.mapImage: '../assets/maps/marbella.svg'`. Descarga una
sola vez las calles de OpenStreetMap y dibuja el plano con el estilo de la
marca. Sin `mapImage`, el pie muestra solo el enlace «Ver en Google Maps».

### 6. Assets del club

- **Pools**: `assets/pools/opt/<base>-240.avif`, `-480.avif`, `-720.avif` y
  `-480.jpg` (el JPEG de respaldo es obligatorio: es el `src` del `<img>`).
  En el manifest se indica solo `<base>`, sin talla ni extensión.
- **Equipo y galería**: `assets/img/`, referenciadas desde el manifest con
  prefijo `../`. Nombres nuevos, no sobrescribas los de Pizarra.
- Anota procedencia y licencia de cada foto en `assets/credits.json`.

### 7. Añadir la sede a la red de la landing

La cuadrícula de sedes de `/` se genera desde la constante **`HOME_CLUBS`** en
`js/main.js` (bloque *LANDING B2B*). Añade una entrada con **ruta relativa**
(nunca `/marbella`, que rompe en local):

```js
{ name: 'Eleva Padel Club', city: 'Marbella · Málaga', url: 'marbella/index.html',
  img: 'assets/img/marbella-club-01.jpg', status: 'soon' }   // 'live' cuando abra
```

Con `status: 'soon'` la tarjeta se pinta sin enlace y con la etiqueta
«Próximamente». Con `'live'` la etiqueta es la clave `home.network.statusLive`,
que hoy dice **«Primera sede»**: con dos sedes activas, cámbiala en
`js/translations.js` (p. ej. «Sede activa») en los tres idiomas.

Revisa también lo que en la landing sigue hablando solo de Pizarra: los CTA que
enlazan a `pizarra/index.html`, el `subOrganization` del JSON-LD de
`index.html` y los enlaces de `404.html`.

### 8. Añadir la URL a `sitemap.xml`

```xml
<url>
  <loc>https://eleva-padel-pizarra.vercel.app/marbella</loc>
  <lastmod>AAAA-MM-DD</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

**No hay que tocar `vercel.json`.** Con `cleanUrls: true` y
`trailingSlash: false`, Vercel sirve `marbella/index.html` en `/marbella` sin
configuración adicional.

### 9. Subir el cache-buster

Sube el `?v=YYYYMMDD` de **todos** los `<link>` y `<script>` del nuevo
`index.html` (y del resto de HTML si has tocado algo compartido), usando **el
mismo número en todas las páginas**. Valor actual: `20260927b`. Detalle completo
en el `README.md` de la raíz.

### 10. Revisar `/privacidad`

Es común a toda la red y hoy está escrita para la marca y para el club de
Pizarra. Añade la sede (domicilio, actividad, canales de contacto) antes de
publicarla.

### 11. Comprobar

- Abre `http://localhost:3000/marbella` y revisa la **consola del navegador**:
  no debe haber avisos `[Eleva]`.
- Pools, equipo, patrocinadores, tarifas, teléfono, dirección, horario, mapa y
  galería deben estar rellenos.
- Cambia de idioma: los textos propios de la sede deben cambiar y **no** debe
  aparecer «Pizarra» en ninguna parte (busca también en el `<title>`, el
  splash, la marca lateral y el pie).
- Prueba el formulario de contacto: debe abrir WhatsApp con el número de
  *este* club.

---

## Contenedores que rellena el render

Deben existir en el HTML del club (vacíos o con contenido de respaldo). Si
falta uno, su función de render sale sin tocar nada:

| Selector                                 | Lo rellena                        |
|------------------------------------------|-----------------------------------|
| `#pools-track`                           | `renderPools`                     |
| `.team-grid`                             | `renderTeam`                      |
| `.sponsors-list`                         | `renderSponsors`                  |
| `.service-rates`, `.academy-rates-grid`  | `renderPricing`                   |
| `[id^="link-phone"]`, `[id^="footer-link-phone"]` | `initManifest` (tel + texto) |
| `#info-address`                          | `initManifest`                    |
| `#info-schedule`                         | `renderSchedule`                  |
| `#footer-map`                            | `initMap` (plano de `brand.mapImage`) |
| `.gallery-img.gi-1` … `.gi-N`            | `initGalleryLazy` (N = nº de fotos de `gallery[]`) |
| `[data-bg]`                              | `initLazyBackgrounds` (fondos perezosos: collage, equipo) |
| `#contact-form`                          | `initContact` (compone el WhatsApp)|
| `#club-data-notice`                      | `checkManifest` (lo muestra si falta el manifest) |
| `#network-grid` *(solo en la landing)*   | `renderNetwork` desde `HOME_CLUBS`|

Todas las funciones corren bajo `safe()`: si una falla, avisa por consola y el
resto de la página sigue funcionando.

---

## Qué campos del manifest se leen de verdad

Verificado contra `js/main.js`. Lo que no está en esta tabla **no lo lee nadie**.

### Se leen

| Campo                                   | Efecto                                                                 |
|-----------------------------------------|------------------------------------------------------------------------|
| `brand.phone`                           | `tel:` y texto de los enlaces de teléfono, CTAs de WhatsApp y formulario |
| `brand.phoneDisplayPrefix`              | Cómo se muestra el número (`+34 659 14 31 03`)                          |
| `brand.phoneRegex`                      | Validación antes de abrir WhatsApp (string de `RegExp`)                 |
| `brand.address`                         | `#info-address`                                                         |
| `brand.schedule`                        | `#info-schedule`, **solo si** el i18n del club no define `club.scheduleValue` (esa clave gana porque va traducida) |
| `brand.mapImage`                        | Plano SVG del pie (`#footer-map`); todo el plano enlaza a `mapsUrl`     |
| `brand.instagram.url` / `.handle`       | Todos los `a[href*="instagram.com"]`; el `@handle` solo si el enlace es texto puro |
| `brand.whatsappCommunity`               | `a[href*="chat.whatsapp.com"]` y el destino de las tarjetas de pool     |
| `brand.volaReservas`                    | `a[href*="vola.plus"]`, y el texto de los enlaces cuyo texto es la propia URL |
| `brand.mapsUrl`                         | `a[href*="maps.app.goo.gl"]`, `google.com/maps`, `maps.google`          |
| `pools[].cat` / `.img` / `.alt`         | Color del medallón, imágenes y texto alternativo                        |
| `team[].name` / `.photo`                | Nombre y foto (sin `photo` → monograma con la inicial)                  |
| `team[].roleKey\|role` / `.bioKey\|bio` | Rol y bio (clave i18n o texto plano)                                    |
| `sponsors[].court` / `.name`            | Número de pista y nombre del patrocinador. La palabra «Pista» sale de la clave i18n `label.court` |
| `sponsors[].courtLabel`                 | Alternativa a `court` para un colaborador **sin pista asignada**: se pinta ese texto tal cual, sin «Pista …». Solo texto plano |
| `sponsors[].badgeKey\|badge`            | Etiqueta del patrocinador                                               |
| `sponsors[].soon`                       | Pinta la fila «¿Tu empresa aquí?»                                       |
| `pricing.courts[].labelKey\|label` / `.price` | Tarifas de pista                                                  |
| `pricing.academy[].titleKey\|title`     | Título de cada bloque de academia                                       |
| `pricing.academy[].rows[].labelKey\|label` / `.value` / `.unitKey\|unit` | Filas de tarifas (unidad traducible con `unitKey`) |
| `gallery[]`                             | Índice del array + 1 ↔ clase `.gi-N` del HTML                           |
| `i18n`                                  | Textos propios de la sede (ver abajo)                                   |

### No se leen (a día de hoy)

| Campo               | Situación                                                                                       |
|---------------------|-------------------------------------------------------------------------------------------------|
| `brand.name`        | Nadie lo lee: el nombre visible está estático en el HTML (y en el JSON-LD).                      |
| `brand.legalName`   | Igual: documental. El nombre legal aparece en `/privacidad`, no aquí.                            |
| `brand.phoneCountry`| **Puramente documental.** El comportamiento real lo fijan `phoneRegex` y `phoneDisplayPrefix`.   |
| `brand.geo`         | Documental: son las coordenadas con las que se genera el plano (paso 5). El JSON-LD lleva las suyas, estáticas. |
| `torneo`            | **Sin usar.** Ninguna función lo lee. Déjalo en `null` salvo que se implemente un render.        |

Claves `*Key` implementadas: `roleKey`, `bioKey`, `badgeKey`, `labelKey`,
`titleKey` y `unitKey`. **No existen** `altKey` ni `courtLabelKey`: `alt` y
`courtLabel` son texto plano.

---

## i18n: dónde va cada texto

Hay dos sitios y no son intercambiables:

1. **`js/translations.js`** — textos **comunes** a todas las sedes (navegación,
   etiquetas de formulario, mensajes de WhatsApp, botones…), con valores
   **neutros** cuando el dato depende de la sede. Tres idiomas: `es`, `en`, `nl`.
2. **Bloque `i18n` del manifest del club** — textos **propios de esa sede**.

El motor resuelve en este orden:

```
i18n del club[idioma] → translations[idioma] → i18n del club.es → translations.es
```

### Claves que una sede debe sobrescribir siempre

Son las que en `pizarra/manifest.js` llevan datos de Pizarra. Si faltan, la
sede muestra el valor neutro común (p. ej. «Pistas de pádel») en vez de su dato:

| Clave | Qué es |
|---|---|
| `meta.title` | `<title>` de la página, traducido |
| `hero.kicker`, `marquee.courts`, `marquee.location`, `marquee.tag` | Línea del hero y cinta de marquesina (nº de pistas, ciudad) |
| `club.aside`, `club.courtsDesc`, `club.scheduleValue`, `club.tournamentsDesc` | Ficha «El Club» |
| `services.desc1`, `services.desc3` | Descripción de pistas y de pools |
| `pools.include`, `pools.prize` | Qué incluye cada pool y el premio |
| `gallery.subtitle`, `gallery.img1` … `gallery.imgN` | Subtítulo y descripción de cada foto (una por foto de `gallery[]`) |
| `team.role1`, `team.bio1`, `team.role2`, `team.bio2`, … | Rol y bio de cada persona del equipo |
| `sponsors.sub` | Texto sobre los patrocinadores |
| `footer.claim` | Claim del pie |

Forma del bloque: claves **planas**, con puntos. Funciona tal cual (el motor
lee las claves planas); `pizarra/manifest.js` además las pasa por una función
`expand()` que define al final del archivo para admitir también el acceso
anidado. Si copias el manifest de Pizarra, copia también esa función.

```js
i18n: {
  es: {
    'meta.title':         'Eleva Padel Club · Marbella, Málaga',
    'hero.kicker':        'PADEL CLUB · N PISTAS · MARBELLA · MÁLAGA',
    'marquee.location':   'Marbella, Málaga',
    'club.scheduleValue': 'L–D · 9:00–00:00',
    // …
  },
  en: { /* las mismas claves */ },
  nl: { /* las mismas claves */ }
},
```

Reglas prácticas:

- Declara **las mismas claves en los tres idiomas**. Si falta una en EN o NL,
  se muestra el valor **común** (neutro) de ese idioma, no el de la sede.
- Textos con `<br>` o `<em>` se enganchan en el HTML con `data-i18n-html`, no
  con `data-i18n`.
- En los datos repetibles puedes usar la variante `*Key` para apuntar a una
  clave i18n, o el campo en texto plano si esa sede no necesita traducirlo.

---

## Convenciones clave

- **Rutas siempre con `../`** (nunca `/assets/…`): funciona en local y en
  Vercel con y sin barra final. El manifest y el HTML del club resuelven contra
  `…/<slug>/index.html`. Única excepción: `404.html`, que se sirve desde
  cualquier URL y por eso usa rutas absolutas.
- **Color de categorías de pool**: única fuente de verdad en `css/main.css` →
  `.pool-card[data-cat="…"] { --pool-accent }`. Categorías definidas hoy:
  `masculina`, `femenina`, `mixta`, `rocha`. Para una categoría nueva, añade su
  regla al CSS antes de usarla en el manifest.
- **Teléfono internacional**: se parametriza en el manifest. Para un club de
  Países Bajos, por ejemplo:

  ```js
  phone:              '31612345678',   // dígitos con prefijo país, sin + ni espacios
  phoneCountry:       'NL',            // código ISO del país (documental)
  phoneRegex:         '^31\\d{9}$',    // validación
  phoneDisplayPrefix: '+31',           // prefijo visible
  ```

- **Sin CDN ni terceros**: no añadas `<script>`, `<link>` ni imágenes de
  dominios externos. La política de seguridad de contenido de `vercel.json`
  está limitada a este propio dominio y los bloquearía. Si de verdad hace falta
  un tercero nuevo, hay que actualizar la CSP **y** `/privacidad`.
