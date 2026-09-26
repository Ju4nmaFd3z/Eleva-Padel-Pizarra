# Plantilla de club · Eleva Pádel

Arquitectura **una página estática por club** (sin build, sin npm). Cada club es
una carpeta de primer nivel (`/pizarra`, `/marbella`, …) con dos archivos:

- `index.html` — estático y crítico para SEO (title, meta, canonical, OG,
  JSON-LD, `<h1>`, copy del hero).
- `manifest.js` — datos repetibles del club + sus textos propios
  (`window.__ELEVA__`).

Todo lo demás es **compartido en la raíz**: `css/main.css`, `css/fonts.css`,
`js/main.js` (motor + render), `js/translations.js` (i18n común), `lib/`
(Leaflet, GSAP, ScrollTrigger — todo local, sin CDN) y `assets/`.

> **Esta carpeta `clubs/` no se publica.** Está excluida en `.vercelignore`.
> Es material interno: `manifest.js` aquí es solo el **esquema comentado** de
> referencia y este README la guía. **No hay `clubs/_plantilla/index.html`**: el
> HTML de partida es siempre el de `/pizarra`, que es la referencia completa y
> probada.

---

## Dar de alta un club nuevo · checklist

Ejemplo con el slug `marbella`.

### 1. Copiar la sede de referencia

```sh
cp -R pizarra marbella          # trae index.html + manifest.js
```

No copies nada más: los estilos, el JS y los assets ya son compartidos.

### 2. Editar `/marbella/index.html` — solo lo estático-SEO

Lo que hay que cambiar, en el `<head>` y el hero:

| Qué                                   | Dónde                                                        |
|---------------------------------------|--------------------------------------------------------------|
| `<title>`                             | `<head>`                                                     |
| `<meta name="description">`           | `<head>`                                                     |
| `<link rel="canonical">`              | → `https://…/marbella`                                       |
| `<link rel="alternate" hreflang="x-default">` | → la misma URL canónica                              |
| `og:url`, `og:title`, `og:description`, `og:image`, `og:image:alt` | bloque Open Graph      |
| `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt` | bloque Twitter/X |
| El bloque **JSON-LD** (`LocalBusiness`) | nombre, dirección, `geo`, `telephone`, `url`, `image`, `openingHours`, `sameAs` |
| `<h1>` y copy del hero                | primera sección del `<body>`                                 |
| `<script src="../pizarra/manifest.js">` | → `../marbella/manifest.js`                                |

Ese último punto es fácil de olvidar y rompe todo el render. El club carga su
manifest por la ruta `../<slug>/manifest.js` (no `./manifest.js`), igual que
`/pizarra`.

Si `js/main.js` no encuentra `window.__ELEVA__` en una página con contenedores
de club, **avisa en la consola del navegador** diciendo qué contenedores quedan
vacíos. Es la forma rápida de detectar un `src` mal puesto.

### 3. Rellenar `/marbella/manifest.js`

Usa `clubs/_plantilla/manifest.js` como esquema y `pizarra/manifest.js` como
ejemplo real y completo. Rellena `brand`, `pools`, `team`, `sponsors`,
`pricing`, `gallery` y el bloque **`i18n`** propio de la sede (ver más abajo).

### 4. Assets del club

Sube sus imágenes a `assets/`:

- **Pools**: `assets/pools/opt/<base>-240.avif`, `-480.avif`, `-720.avif` y
  `-480.jpg` (el JPEG de respaldo es obligatorio: es el `src` del `<img>`).
  En el manifest se indica solo `<base>`, sin talla ni extensión.
- **Equipo y galería**: `assets/img/`, referenciadas desde el manifest con
  prefijo `../`.

### 5. Añadir la sede a la red de la landing

La cuadrícula de sedes de `/` se genera desde la constante **`HOME_CLUBS`** en
`js/main.js` (bloque *LANDING B2B*). Añade una entrada:

```js
{ name: 'Eleva Padel Club', city: 'Marbella · Málaga', url: '/marbella',
  img: 'assets/img/club-02.jpg', status: 'live' }   // 'soon' si aún no abre
```

Con `status: 'soon'` la tarjeta se pinta sin enlace. Si te salta este paso, el
club existe pero **no aparece en la landing**.

### 6. Añadir la URL a `sitemap.xml`

```xml
<url>
  <loc>https://eleva-padel-pizarra.vercel.app/marbella</loc>
  <lastmod>2026-09-26</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

**No hay que tocar `vercel.json`.** No contiene ninguna regla de `rewrites`:
con `cleanUrls: true` y `trailingSlash: false`, Vercel sirve
`marbella/index.html` en `/marbella` sin configuración adicional.

### 7. Subir el cache-buster

Sube el `?v=YYYYMMDD` de **todos** los `<link>` y `<script>` del nuevo
`index.html` (y del resto de HTML si has tocado algo compartido), usando **el
mismo número en todas las páginas**. Valor actual: `20260926`. Detalle completo
en el `README.md` de la raíz.

### 8. Comprobar

- Abre `/marbella` y revisa la **consola del navegador**: no debe haber avisos
  `[Eleva]`.
- Pools, equipo, patrocinadores, tarifas, teléfono, dirección, horario, mapa y
  galería deben estar rellenos.
- Cambia de idioma: los textos propios de la sede deben cambiar y **no** debe
  aparecer "Pizarra" en ninguna parte.
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
| `#footer-map`                            | `initMap` (Leaflet + CARTO)       |
| `.gallery-img.gi-1` … `.gi-16`           | `initGalleryLazy`                 |
| `#contact-form`                          | `initContact` (compone el WhatsApp)|
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
| `brand.schedule`                        | `#info-schedule`; **gana** sobre la clave i18n `club.scheduleValue`     |
| `brand.geo.lat` / `brand.geo.lng`       | Centro y marcador del mapa (respaldo: `brand.mapLat` / `brand.mapLng`)  |
| `brand.instagram.url` / `.handle`       | Todos los `a[href*="instagram.com"]`; el `@handle` solo si el enlace es texto puro |
| `brand.whatsappCommunity`               | `a[href*="chat.whatsapp.com"]` y el destino de las tarjetas de pool     |
| `brand.volaReservas`                    | `a[href*="vola.plus"]`                                                  |
| `brand.mapsUrl`                         | `a[href*="maps.app.goo.gl"]`, `google.com/maps`, `maps.google`          |
| `pools[].cat` / `.img` / `.alt`         | Color del medallón, imágenes y texto alternativo                        |
| `team[].name` / `.photo`                | Nombre y foto (sin `photo` → medallón vacío)                            |
| `team[].roleKey\|role` / `.bioKey\|bio` | Rol y bio (clave i18n o texto plano)                                    |
| `sponsors[].court` / `.name`            | Número de pista y nombre del patrocinador. La palabra "Pista" sale de la clave i18n `sponsors.court` |
| `sponsors[].courtLabel`                 | Alternativa a `court` para un colaborador **sin pista asignada**: se pinta ese texto tal cual, sin "Pista …". Solo texto plano |
| `sponsors[].badgeKey\|badge`            | Etiqueta del patrocinador                                               |
| `sponsors[].soon`                       | Pinta la fila "¿Tu empresa aquí?"                                       |
| `pricing.courts[].labelKey\|label` / `.price` | Tarifas de pista                                                  |
| `pricing.academy[].titleKey\|title`     | Título de cada bloque de academia                                       |
| `pricing.academy[].rows[].labelKey\|label` / `.value` / `.unit` | Filas de tarifas             |
| `gallery[]`                             | Índice del array + 1 ↔ clase `.gi-N` del HTML                           |
| `i18n`                                  | Textos propios de la sede (ver abajo)                                   |

### No se leen (a día de hoy)

| Campo               | Situación                                                                                       |
|---------------------|-------------------------------------------------------------------------------------------------|
| `brand.name`        | Nadie lo lee: el nombre visible está estático en el HTML (y en el JSON-LD).                      |
| `brand.legalName`   | Igual: documental. El nombre legal aparece en `/privacidad`, no aquí.                            |
| `brand.phoneCountry`| **Puramente documental.** El comportamiento real lo fijan `phoneRegex` y `phoneDisplayPrefix`.   |
| `torneo`            | **Actualmente sin usar.** Ninguna función lo lee: el banner de torneo vive estático en el HTML del club (por SEO y JSON-LD). Déjalo en `null` salvo que se implemente un render. |

> **Ojo con el comentario de esquema de `pizarra/manifest.js`.** Menciona dos
> variantes que **`js/main.js` no implementa**: `altKey` (texto alternativo de
> los pools) y `unitKey` (unidad de las filas de academia). El render solo lee
> `alt` y `unit` como texto plano. Sí está implementado `courtLabel`, pero solo
> en texto plano: **no** existe `courtLabelKey`. Si necesitas traducir alguno de
> esos tres, hay que añadir antes el soporte en el render.

---

## i18n: dónde va cada texto

Hay dos sitios y no son intercambiables:

1. **`js/translations.js`** — textos **comunes** a todas las sedes (navegación,
   etiquetas de formulario, mensajes de WhatsApp, botones…). Tres idiomas:
   `es`, `en`, `nl`.
2. **Bloque `i18n` del manifest del club** — textos **propios de esa sede**:
   ciudad, horario real, claim, bio de su monitor/a, descripción de sus pools,
   texto de sus patrocinadores… Lo que no debe heredar otra sede.

El motor resuelve en este orden:

```
window.__ELEVA__.i18n[idioma][clave]  →  translations[idioma][clave]  →  translations.es[clave]
```

Forma del bloque (las claves se declaran **planas**, con puntos, y el manifest
las expande también a objetos anidados, de modo que funcionan los dos accesos):

```js
i18n: expand({
  es: {
    'hero.kicker':        'PADEL CLUB · 4 PISTAS OUTDOOR · MARBELLA · MÁLAGA',
    'marquee.location':   'Marbella, Málaga',
    'club.scheduleValue': 'L–D · 9:00–00:00',
    'team.role1':         'Monitor · …',
    // …
  },
  en: { /* las mismas claves */ },
  nl: { /* las mismas claves */ }
}),
```

Reglas prácticas:

- Declara **las mismas claves en los tres idiomas**. Si falta una, cae al
  archivo común y puede acabar mostrando el texto de Pizarra.
- Si una clave solo existe en el manifest (no en `js/translations.js`),
  declárala igualmente en los tres idiomas: no hay dónde caer.
- Textos con `<br>` o `<em>` se enganchan en el HTML con `data-i18n-html`, no
  con `data-i18n`.
- En los datos repetibles puedes usar la variante `*Key` (`roleKey`, `bioKey`,
  `labelKey`, `titleKey`, `badgeKey`) para apuntar a una clave i18n, o el campo
  en texto plano si esa sede no necesita traducirlo.

---

## Convenciones clave

- **Rutas siempre con `../`** (nunca `/assets/…`): funciona en `file://` y en
  Vercel con y sin barra final. El manifest y el HTML del club resuelven contra
  `…/<slug>/index.html`.
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

  El `31` va en `phoneRegex` y en `phoneDisplayPrefix`; `phoneCountry` es el
  código ISO de dos letras (`NL`), no el prefijo telefónico.
- **Sin CDN**: no añadas `<script>` ni `<link>` a dominios externos. La
  política de seguridad de contenido de `vercel.json` está limitada a este
  propio dominio (más las teselas del mapa) y los bloquearía. Si de verdad
  hace falta un tercero nuevo, hay que actualizar el CSP **y** `/privacidad`.
- **`/privacidad` es común a toda la red.** Está escrita para la marca y para
  el club de Pizarra. Al abrir una sede nueva hay que revisar esa página
  (domicilio, actividad, canales de contacto) antes de publicarla.
