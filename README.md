# Eleva Pádel — web

Web estática: HTML, CSS y JavaScript sin dependencias, sin build y sin `npm` en la
raíz. Se publica en Vercel desde la rama `main`.

| URL           | Archivo                                   | Qué es                                   |
|---------------|-------------------------------------------|------------------------------------------|
| `/`           | `index.html`                              | Web de la marca Eleva Pádel              |
| `/pizarra`    | `pizarra/index.html` (generado) + `pizarra/manifest.js` | Web del club Eleva Pádel Pizarra |
| `/privacidad` | `privacidad.html`                         | Aviso legal, privacidad y cookies        |
| *(404)*       | `404.html`                                | Página de «no encontrado»                |

Nada se carga desde internet: fuentes, iconos e imágenes están en el propio sitio.
Si algún día se añade un servicio externo, hay que actualizar la CSP de
`vercel.json` **y** `privacidad.html`.

---

## Ver la web en tu ordenador

Con Node 22 o superior, desde la raíz del repo:

```sh
node tools/servidor-local.js
```

y abre <http://localhost:3000> y <http://localhost:3000/pizarra>. El servidor imita
a Vercel: URLs sin `.html` y sin barra final, cabeceras y CSP de `vercel.json`, lo
excluido en `.vercelignore`, la página 404 y el modo mantenimiento.

> No previsualices con doble clic ni con `python3 -m http.server`: tratan
> `/pizarra` como `/pizarra/` y esconden errores de rutas. Por eso todas las rutas
> de la página del club llevan `../`.

## Generar y validar

El HTML de cada club se **genera** desde su manifest, para que todo lo confirmado
se vea también sin JavaScript (y lo lean los buscadores). Vercel no ejecuta nada:
el HTML generado se versiona.

```sh
node tools/generar.js    # pinta el HTML de cada club desde su manifest
node tools/validar.js    # pendientes, fechas, avisos, i18n, cache-buster y HTML al día
```

Con los hooks activados lo hace Git solo en cada commit:

```sh
git config core.hooksPath tools/hooks
```

Convención de commits y normas de trabajo: **[CONTRIBUTING.md](CONTRIBUTING.md)**.

---

## Modo mantenimiento

Lo gestiona `middleware.js`: con el modo activo, todas las rutas responden **503**
con `Retry-After` y `noindex` y muestran una página con los canales de contacto.

- **Activar:** en Vercel → Settings → Environment Variables, `MANTENIMIENTO` = `1`
  (Production) y **Redeploy** del último despliegue.
- **Desactivar:** borra la variable (o ponla a `0`) y haz **Redeploy**.
- **Saltártelo:** abre cualquier URL con `?acceso=<clave>`, donde `<clave>` es la
  variable `MANTENIMIENTO_CLAVE` (nunca en el repo: es público). Deja la cookie
  `eleva-acceso` durante 30 días.

En local: `MANTENIMIENTO=1 MANTENIMIENTO_CLAVE=prueba node tools/servidor-local.js`.

---

## Publicar

Cada `push` a `main` publica en producción. Se trabaja en ramas: cada rama tiene
su preview en Vercel. Publica siempre desde Git, nunca arrastrando la carpeta a
Vercel: la carpeta local tiene material interno (`CONFIRMAR.md`, capturas,
borradores) que está fuera de Git y de `.vercelignore`.

---

## Cambiar los datos del club

Todo lo del club está en `pizarra/manifest.js`: contacto, coordenadas, instalaciones,
clases y tarifas, pools, otros servicios, cancelaciones, equipo, patrocinadores,
galería y avisos. Después de cambiarlo, `node tools/generar.js`.

- **Solo datos confirmados por el club.** Lo pendiente se marca `PENDIENTE_CLUB`
  y no se pinta; su valor propuesto se apunta en `CONFIRMAR.md`, nunca en el repo.
- Los datos que pueden cambiar llevan `verificado` (fecha de la confirmación) y
  `fuente`. Al reconfirmarlos, actualiza la fecha.
- **Avisos con fecha** (`eventos`): `hasta` es obligatorio y se ocultan solos al
  pasar esa fecha. Nunca se ponen en el HTML fijo.
- El JSON-LD y los enlaces de reservas y WhatsApp los escribe el generador. El
  `title`, la `description` y el Open Graph de `pizarra/index.html` se editan a mano.
- Patrocinadores: la sección solo se muestra con la lista completa confirmada.

## Cambiar los textos

- Textos de interfaz (menú, botones, rótulos): `js/translations.js`, con las
  mismas claves en español, inglés y neerlandés.
- Textos del club: en su manifest, como `{ es, en, nl }`.

## Logo y tipografía

- Logo oficial: `assets/img/favicon.svg` (aprobado por el club). Es el único origen:
  la web lo usa como imagen y `favicon.ico` y `apple-touch-icon.png` se renderizan
  desde él. No se redibuja.
- Fuentes: Barlow Condensed y Barlow (OFL, `assets/fonts/OFL-Barlow.txt`).
- Iconos: Lucide 1.49.0 en `assets/icons/lucide.svg` (sprite, sin modificar; licencia
  en `assets/icons/LICENSE-lucide.txt`). Se usan solo donde ayudan: menú, ubicación,
  enlaces externos y flechas. Para añadir uno, se copia su `<symbol>` tal cual del
  repositorio de Lucide.
- WhatsApp e Instagram: glifos oficiales de Meta en `assets/marcas/`, sin modificar
  (blanco sobre fondo negro, negro sobre botón beige), siempre junto al nombre escrito.

## Fotos

- `assets/img/hero.jpg`: foto del inicio del club (y de su tarjeta en `/`).
- `assets/img/og-pizarra.jpg`: imagen para redes (1200×630), recortada del hero.
- `assets/img/team-lorena.jpg`: equipo.
- `assets/pools/opt/`: insignias de los pools (AVIF 240/480/720 y JPEG 480).
- `assets/maps/pizarra.svg`: plano del pie (© OpenStreetMap contributors, ODbL).
- Galería: vacía hasta que haya fotos reales (ver `clubs/_plantilla/README.md`).

Procedencia y licencias en `assets/credits.json` (interno). Si sustituyes una
imagen, usa un nombre nuevo: la caché del navegador guarda las imágenes hasta 37 días.

## Cache-buster

Cada `<link>` y `<script>` lleva `?v=YYYYMMDD[letra]` (hoy `20261001c`), igual en todos
los HTML. Súbelo al cambiar CSS, JS o manifest. `tools/validar.js` comprueba que
coincide.

## Añadir un club

Paso a paso en `clubs/_plantilla/README.md`, con `clubs/_plantilla/manifest.js`
como plantilla vacía.

---

## Estructura

```
├── index.html · privacidad.html · 404.html
├── middleware.js        ← modo mantenimiento
├── pizarra/             ← web del club (index.html + manifest.js)
├── css/                 ← main.css y fonts.css
├── js/                  ← main.js, render.js (manifest → HTML) y translations.js
├── assets/              ← fuentes, imágenes, insignias, credits.json (interno)
├── clubs/_plantilla/    ← alta de clubes (no se publica)
├── tools/               ← servidor local, generar, validar y hooks (no se publica)
├── CONTRIBUTING.md      ← convención de commits
├── robots.txt · sitemap.xml · vercel.json · .vercelignore
```

## Preguntas frecuentes

**¿La web usa cookies o analítica?** No hay analítica. El navegador guarda el idioma
solo si el usuario lo elige (`eleva-lang`). La única cookie es `eleva-acceso`, que
solo recibe quien usa la clave del modo mantenimiento.

**¿Dónde van los datos del formulario?** A ningún servidor: el formulario compone
un mensaje de WhatsApp y lo envía el propio usuario. Sin JavaScript, el botón está
desactivado.

**El club no tiene email, ¿es un olvido?** No: es una decisión. Canales:
WhatsApp +34 659 14 31 03 e Instagram @elevapadelpizarra.

---

*Desarrollado por [Biznaga Consulting](https://biznagaconsulting.es/)*
