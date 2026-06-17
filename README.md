# Eleva Padel Club — Web Oficial

Web estática lista para publicar. Sin instalaciones, sin programas especiales.

---

## Ver la web en tu ordenador

Abre el archivo `index.html` haciendo doble clic. Se abrirá directamente en tu navegador. Funciona sin conexión a internet (solo las fuentes de texto, el fondo del hero y el mapa requieren conexión la primera vez).

---

## Publicar en Vercel (gratis, 30 segundos)

1. Ve a **vercel.com** y crea una cuenta gratuita (puedes entrar con Google o GitHub).
2. Una vez dentro, haz clic en **"Add New → Project"**.
3. Selecciona **"Upload"** (o arrastra toda la carpeta `Eleva-Padel-Pizarra`).
4. Haz clic en **Deploy**.
5. En menos de un minuto tendrás una URL pública tipo `https://eleva-padel-pizarra.vercel.app`.
6. Puedes conectar tu dominio propio desde el panel de Vercel.

---

## Cambiar el número de WhatsApp, la dirección y el mapa

Abre el archivo `lib/manifest.js` con cualquier editor de texto (Bloc de notas, TextEdit, etc.).

Busca estas líneas y cámbialas:

```
phone:   '34659143103',   // ← número del club sin + ni espacios
address: 'Pasaje de Jerez S/N · 29560 Pizarra, Málaga',  // ← dirección real
mapLat:  36.769391,        // ← latitud (la usa el mapa del footer)
mapLng:  -4.709363,        // ← longitud
```

El número debe empezar por `34` (prefijo de España) sin el `+`. Por ejemplo, si el teléfono es `612 345 678`, escribe `34612345678`.

Para obtener `mapLat`/`mapLng`: en Google Maps, haz clic derecho sobre la ubicación del club y copia las dos coordenadas que aparecen arriba del menú (latitud, longitud). El mapa del footer (Leaflet + OpenStreetMap/CARTO) se dibuja solo con esas coordenadas; no hace falta ningún código de Google.

---

## Cambiar los textos

- Los textos visibles de la web (secciones, precios, torneo, equipo, etc.) están en `index.html`.
- Las **traducciones** (Español / Inglés / Neerlandés) están en `lib/translations.js`. Cada texto traducible lleva un atributo `data-i18n` en el HTML; su traducción vive en `translations.js` bajo la misma clave para los tres idiomas. Si añades o cambias un texto traducible, actualízalo en los tres idiomas.

---

## Cambiar las fotos

Las fotos van en la carpeta `assets/img/`. Los nombres que la web espera son:

| Archivo         | Dónde aparece                    |
|-----------------|----------------------------------|
| `hero.jpg`      | Fondo del inicio (pantalla completa) |
| `club-01.jpg`   | Collage de "El Club" — foto izquierda |
| `club-02.jpg`   | Collage de "El Club" — foto derecha |
| `club-03.jpg`   | Collage de "El Club" — foto central |
| `team-lorena.jpg` | Foto del equipo (Lorena Vano) |
| `gallery-01.jpg` … `gallery-16.jpg` | Galería de imágenes |
| `og.jpg`        | Vista previa al compartir en redes (1200×630 px) |

Las imágenes de los pools están en `assets/pools/opt/` ya optimizadas en varios tamaños (AVIF + JPEG de respaldo). Si las regeneras, mantén esa estructura.

**Consejo:** las fotos deberían pesar menos de 500 KB cada una para que carguen rápido. Puedes comprimir gratis en [squoosh.app](https://squoosh.app).

---

## Actualizar el cache (tras cualquier cambio)

Cuando cambies cualquier archivo (fotos, textos, colores…), los navegadores a veces guardan la versión antigua. Para forzar la actualización, abre `index.html` y cambia la versión en el `?v=` de los archivos:

```html
<link rel="stylesheet" href="css/main.css?v=20260617">   ← cambia la versión
<script src="lib/manifest.js?v=20260617" defer></script>  ← cambia la versión
<script src="js/main.js?v=20260617"     defer></script>  ← cambia la versión
```

Usa la fecha de hoy en formato YYYYMMDD (por ejemplo, `20260715`).

---

## Cambiar el Instagram

El Instagram está enlazado como `@elevapadelpizarra` en el footer y en la sección de contacto. Para cambiar el usuario, busca `elevapadelpizarra` en `index.html` y sustitúyelo.

---

## Estructura de archivos

```
Eleva-Padel-Pizarra/
├── index.html          ← la web completa
├── privacidad.html     ← aviso legal, privacidad y normas (noindex)
├── css/
│   └── main.css        ← todos los estilos
├── js/
│   └── main.js         ← interactividad
├── lib/
│   ├── manifest.js     ← datos editables (teléfono, dirección, mapa, galería)
│   ├── translations.js ← traducciones ES / EN / NL
│   ├── gsap.min.js     ← animaciones (local, sin CDN)
│   └── ScrollTrigger.min.js
├── assets/
│   ├── img/            ← fotos del club y galería
│   ├── pools/opt/      ← imágenes de pools optimizadas (AVIF + JPEG)
│   └── credits.json    ← créditos de imágenes
├── robots.txt
├── sitemap.xml
└── vercel.json         ← configuración de despliegue
```

---

## Preguntas frecuentes

**¿Necesito un servidor para verla?**
No. Abre `index.html` directamente con doble clic.

**¿Qué navegadores son compatibles?**
Todos los modernos: Chrome, Firefox, Safari, Edge. Internet Explorer no está soportado (está descontinuado).

**¿Puedo editar los textos directamente?**
Sí, en `index.html` con cualquier editor de texto. Recuerda que las traducciones a inglés y neerlandés están en `lib/translations.js`.

**El mapa no aparece, ¿es normal?**
El mapa del footer usa OpenStreetMap/CARTO y necesita conexión a internet la primera vez. Si por algún motivo no carga, se muestra automáticamente un enlace "Ver en Google Maps" como alternativa.

---

*Diseño web por Juanma Fernández · [juanma-dev-portfolio.vercel.app](https://juanma-dev-portfolio.vercel.app)*
