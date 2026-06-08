# Eleva Padel Club — Web Oficial

Web estática lista para publicar. Sin instalaciones, sin programas especiales.

---

## Ver la web en tu ordenador

Abre el archivo `index.html` haciendo doble clic. Se abrirá directamente en tu navegador. Funciona sin conexión a internet (solo las fuentes de texto y el fondo del hero requieren conexión la primera vez).

---

## Publicar en Vercel (gratis, 30 segundos)

1. Ve a **vercel.com** y crea una cuenta gratuita (puedes entrar con Google o GitHub).
2. Una vez dentro, haz clic en **"Add New → Project"**.
3. Selecciona **"Upload"** (o arrastra toda la carpeta `Eleva-Padel-Pizarra`).
4. Haz clic en **Deploy**.
5. En menos de un minuto tendrás una URL pública tipo `https://eleva-padel.vercel.app`.
6. Puedes conectar tu dominio propio desde el panel de Vercel.

---

## Cambiar el número de WhatsApp y los datos del club

Abre el archivo `lib/manifest.js` con cualquier editor de texto (Bloc de notas, TextEdit, etc.).

Busca estas líneas y cámbialas:

```
phone:    '34600000000',   // ← pon el número del club sin + ni espacios
address:  'C/ Ejemplo 1, Pizarra, Málaga',  // ← dirección real
schedule: 'Mañanas 9:00–12:00 · Tardes y noches 17:00–00:00', // ← horario si cambia
```

El número debe empezar por `34` (prefijo de España) sin el `+`. Por ejemplo, si el teléfono es `612 345 678`, escribe `34612345678`.

---

## Añadir el mapa de Google

1. Ve a **Google Maps** y busca la dirección del club.
2. Haz clic en **Compartir → Insertar un mapa**.
3. Copia solo la parte `src="..."` del código que te da Google.
4. Abre `lib/manifest.js` y pega ese enlace en:
   ```
   mapEmbed: 'PEGA_AQUÍ_EL_SRC_DE_GOOGLE_MAPS',
   ```

---

## Cambiar las fotos

Las fotos van en la carpeta `assets/img/`. Los nombres que la web espera son:

| Archivo         | Dónde aparece                    |
|-----------------|----------------------------------|
| `hero.jpg`      | Fondo del inicio (pantalla completa) |
| `club-01.jpg`   | Collage de "El Club" — foto izquierda |
| `club-02.jpg`   | Collage de "El Club" — foto derecha |
| `club-03.jpg`   | Collage de "El Club" — foto central |
| `gallery-01.jpg` hasta `gallery-16.jpg` | Galería de imágenes |
| `og.jpg`        | Vista previa al compartir en redes (1200×630 px) |

**Consejo:** las fotos deberían pesar menos de 500 KB cada una para que carguen rápido. Puedes comprimir gratis en [squoosh.app](https://squoosh.app).

---

## Actualizar el cache (tras cualquier cambio)

Cuando cambies cualquier archivo (fotos, textos, colores…), los navegadores a veces guardan la versión antigua. Para forzar la actualización, abre `index.html` y cambia la fecha en estos tres sitios:

```html
<link rel="stylesheet" href="css/main.css?v=20260609">   ← cambia la fecha
<script src="lib/manifest.js?v=20260609" defer></script>  ← cambia la fecha
<script src="js/main.js?v=20260609"     defer></script>  ← cambia la fecha
```

Pon la fecha de hoy en formato YYYYMMDD (por ejemplo, `20260715`).

---

## Añadir el Instagram en el header

El Instagram ya está enlazado como `@elevapadelpizarra` en el footer y en la sección de contacto. Para cambiar el usuario, busca `elevapadelpizarra` en `index.html` y sustitúyelo.

---

## Estructura de archivos

```
Eleva-Padel-Pizarra/
├── index.html          ← la web completa
├── css/
│   └── main.css        ← todos los estilos
├── js/
│   └── main.js         ← interactividad
├── lib/
│   ├── manifest.js     ← datos editables del club
│   ├── gsap.min.js     ← animaciones (local, sin CDN)
│   └── ScrollTrigger.min.js
├── assets/
│   ├── img/            ← aquí van las fotos
│   └── credits.json    ← créditos de imágenes
└── vercel.json         ← configuración de despliegue
```

---

## Preguntas frecuentes

**¿Necesito un servidor para verla?**
No. Abre `index.html` directamente con doble clic.

**¿Qué navegadores son compatibles?**
Todos los modernos: Chrome, Firefox, Safari, Edge. Internet Explorer no está soportado (está descontinuado).

**¿Puedo editar los textos directamente?**
Sí, en `index.html` con cualquier editor de texto. Los textos de los pools, la academia y los servicios también se pueden editar en `lib/manifest.js`.

**El mapa no aparece en local, ¿es normal?**
Sí. Google Maps solo funciona cuando la web está en un servidor (Vercel). En local aparece un enlace "Ver en Google Maps".

---

*Diseño web por Juanma Fernández · [juanma-dev-portfolio.vercel.app](https://juanma-dev-portfolio.vercel.app)*
