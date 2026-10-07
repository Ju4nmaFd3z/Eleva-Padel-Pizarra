# Historial de cambios

Web estática de Eleva Pádel (la marca, en `/`) y de su club Eleva Pádel Pizarra
(`/pizarra`), desarrollada por Biznaga Consulting. Este documento resume, por etapas y de
la más reciente a la más antigua, todo lo hecho desde el primer commit (09/06/2026). Cuando el
historial de Git se sustituya por un único commit, este documento será su único resumen.

Solo describe qué se hizo. Los datos que la web publicó en etapas anteriores y luego se
retiraron por no estar confirmados no se repiten aquí.

---

## Tramo de cierre (octubre de 2026, en curso)

Empieza el 07/10/2026, con la integración «web viva» aprobada por el propietario.

Hecho a 07/10/2026:

- Copia completa del repositorio (`git clone --mirror`) fuera de cualquier repo, antes de
  tocar el historial.
- Borradas las ramas de exploración `propuesta-a` y `propuesta-c`, cuya mezcla ya está en
  `rediseno`. Sus despliegues de Vercel se borran en la limpieza final.
- Revisión de todos los commits de todas las ramas, leyendo el diff de cada uno, para
  redactar este historial y localizar lo que no debe seguir en el historial público.
- Batería permanente de pruebas en `tools/qa` (Playwright y axe-core, con su propio
  `package.json`): tamaños de 320 a 2560 px, las cinco páginas, tres idiomas, sin JS,
  movimiento reducido y zoom al 200 %.

Pendiente en este tramo: publicar los datos de los carteles que el club ha confirmado;
fallo intermitente del hero; más protagonismo para la pista 3D; rediseño de la sección de
cancelaciones; color de las superficies con el scroll; traducciones completas en ES, EN y
NL con comprobación automática; textos en español; página legal; borrador de la marca solo
en local; revisión del repositorio y su documentación; QA final con un agente distinto;
sustitución del historial de Git por un único commit; paso a elevapadel.com.

---

## Web viva: movimiento e integración de la pista 3D (4 y 5 de octubre de 2026)

Se exploraron varias propuestas de movimiento e interacción en ramas separadas y se integró
una mezcla de dos en `rediseno`.

- **Sistema de movimiento único** para `/` y `/pizarra`: tokens de duración, curvas,
  retardos, distancias y profundidad en `:root` de `css/main.css`, con versión reducida para
  `prefers-reduced-motion`; espejo en `js/movimiento/nucleo.js`, que gobierna cada módulo con
  la misma API (activar, pausar, reanudar, desactivar y reenganchar) ante movimiento
  reducido, pestaña oculta, fuera de pantalla, bfcache, cambio de tamaño y cambio de idioma.
  Módulos: `scroll.js`, `puntero.js`, `tacto.js` y `tres-d.js` + `pista.js`. Todo lo animado
  vive en `css/movimiento.css`; `main.css` es el estado estático, completo sin JS.
- Las animaciones ligadas al scroll pasan a moverse con un motor JS: las nativas bajaban a
  30 fps en móvil simulado (CPU ×4).
- **Pista 3D del hero** con three.js r186 autoalojado y reducido (`lib/three/`, licencia
  MIT), con las medidas del reglamento FIP («Rules of Padel», en vigor desde el 01/01/2026,
  laterales en la variante 1). Se ve a través del logo y se abre con el scroll. Se crea por
  pasos tras la carga, con el primer gesto o a los 6 s, solo si el hero está en pantalla (no
  al entrar por un ancla) y el equipo tiene GPU y no pide ahorro de datos; si no, queda una
  imagen fija de la misma escena y el 3D no se descarga.
- La foto ilustrativa sale del hero del club; en `/`, tarjeta del club que reacciona al ratón
  y al foco.
- Titular cinético en el hero, cortes de sección y transición entre `/` y `/pizarra` a través
  del logo, precios que se asientan al entrar y, solo con ratón, botones magnéticos y un
  puntero propio en forma de punto.
- **Logo sin fondo** (`assets/img/logo-sin-fondo.svg`, el logo oficial sin su rectángulo) en
  cabecera, pie, `/`, 404, mantenimiento y máscaras.
- **Pools**: color propio de cada insignia, muestreado de su imagen, como único marcador de
  categoría; giro, inclinación y abanico, siempre dentro de su celda.
- **Selector de idioma** en la cabecera, fuera del menú, manejable por teclado.
- Formato de filas reutilizable (`.filas > .fila`), estrenado en Cancelaciones.
- Borrador de la web de la marca solo en local (`/?borrador`), fuera de Git y de Vercel.
- Accesibilidad: orden del DOM de la cabecera igual al visual (WCAG 2.4.3).
- Hero adaptado a móvil en horizontal y a zoom del 200 %.
- Página legal: retirada una frase contradicha por el cartel de la escuela infantil.
- Iconos y glifos a un mismo tamaño (`--tam-icono`).

---

## Rediseño: limpieza, datos confirmados y base nueva (1 de octubre de 2026)

- **Material interno fuera del repo y del despliegue**: lista de datos por confirmar,
  borradores y capturas, en `.gitignore` y `.vercelignore`.
- **Limpieza**: fuera las fotos de banco, la galería, GSAP y los efectos decorativos (pantalla
  de presentación, cursor propio, grano, marquees, contadores y similares). La web de la marca
  queda con nombre, logo, enlace al club y pie.
- **Solo datos confirmados**: manifest del club rehecho con textos `{ es, en, nl }`,
  `PENDIENTE_CLUB` en lo no confirmado (no se pinta) y fecha de verificación y fuente en lo que
  caduca. Contenido de los carteles del club: clases, escuela infantil, otros servicios y
  política de cancelaciones. Coordenadas confirmadas y plano del contacto regenerado.
  Patrocinadores ocultos hasta tener la lista completa. Sin enlaces `tel:` en el club.
- **HTML generado**: `js/render.js` convierte el manifest en HTML; `tools/generar.js` lo
  escribe en español en `pizarra/index.html`, de modo que todo lo confirmado se ve sin JS.
- **Validación**: `tools/validar.js` (pendientes, fechas, eventos, claves de idioma,
  cache-buster, scripts en línea y HTML sincronizado) y hooks de Git `pre-commit` y
  `commit-msg`. Convención de commits en `CONTRIBUTING.md`.
- **Identidad visual**: tipografía Barlow Condensed y Barlow autoalojadas (OFL); logo oficial
  único en `assets/img/favicon.svg`, del que salen `favicon.ico` y `apple-touch-icon.png`;
  paleta muestreada de las insignias de los pools.
- **CSS mobile-first** con tres puntos de corte, zonas seguras de iOS, hover solo con puntero,
  objetivos táctiles de 44 px; «Reservar» siempre en la cabecera; sin salto de maquetación al
  cargar el JS.
- **Iconos**: Lucide 1.49.0 y glifos oficiales de WhatsApp e Instagram, con sus licencias.
- Servidor local con compresión, como Vercel.

---

## Modo mantenimiento y documentación del proyecto (30 de septiembre de 2026)

- `middleware.js`: con la variable de entorno activa, todas las rutas responden 503 con
  `Retry-After` y `noindex`, con una página propia con logo y canales de contacto. Acceso con
  una clave guardada solo en Vercel (cookie de 30 días). El servidor local usa el mismo
  middleware.
- Crédito del pie: «Desarrollado por Biznaga Consulting».
- `CLAUDE.md` con reglas, arquitectura y decisiones del proyecto.

---

## Plataforma de marca y club, y auditorías (26 y 27 de septiembre de 2026)

- `/` pasa a ser la web de la marca y el club se muda a `/pizarra`, con su propio manifest y
  una plantilla para dar de alta otros clubes (`clubs/_plantilla/`).
- Página 404 propia; `.vercelignore`; sin rewrite general.
- Tipografías y recursos autoalojados: CSP `'self'`, sin peticiones a terceros;
  `Permissions-Policy`, COOP y CORP.
- Mapa del pie como plano SVG propio con datos de OpenStreetMap, generado con
  `clubs/_plantilla/generar-mapa.js`, en lugar de un mapa de teselas de terceros.
- `tools/servidor-local.js` para previsualizar como en Vercel.
- Accesibilidad: región `<main>`, enlace para saltar al contenido, menú móvil inerte al
  cerrarse, ARIA corregido, contraste AA.
- Internacionalización con textos propios de cada club.
- Página legal reescrita según lo que hace la web.
- Logo de Eleva en `assets/img/favicon.svg`, con `favicon.ico` y `apple-touch-icon.png`; datos
  estructurados (JSON-LD).
- Rendimiento: carga diferida, imágenes recomprimidas, fuentes sin duplicar.

Parte del contenido de esta etapa (datos del club y fotos de banco) tampoco estaba confirmado
y se retiró el 1 de octubre de 2026.

---

## Primera web del club (9 al 17 de junio de 2026)

- Web estática de una sola página para el club, con secciones de presentación, servicios,
  clases, pools, galería y contacto, animaciones con GSAP y datos editables en un manifest.
- Despliegue en Vercel con caché y cabeceras de seguridad; `robots.txt`, `sitemap.xml`,
  canónica, Open Graph y datos estructurados.
- Interfaz en español, inglés y neerlandés y primera página de aviso legal y privacidad.
- Insignias reales de los pools optimizadas en AVIF y JPEG.
- Ajustes de móvil y táctil (objetivos de 44 px, zonas seguras, menú, carruseles) y de
  accesibilidad (foco visible, enlace para saltar al contenido).

Buena parte del contenido de esta etapa (textos, cifras, nombres y fotos de banco) no estaba
confirmado por el club y se retiró entre septiembre y octubre de 2026.
