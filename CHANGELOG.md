# Historial de cambios

Web estática de Eleva Pádel (la marca, en `/`) y de su club Eleva Pádel Pizarra
(`/pizarra`), desarrollada por Biznaga Consulting. Este documento resume, por etapas y de
la más reciente a la más antigua, todo lo hecho desde el primer commit (09/06/2026). Cuando el
historial de Git se sustituya por un único commit, este documento será su único resumen.

Solo describe qué se hizo. Los datos que la web publicó en etapas anteriores y luego se
retiraron por no estar confirmados no se repiten aquí.

---

## Tramo de cierre (del 7 de octubre al 25 de noviembre de 2026, en curso)

Empieza el 07/10/2026, con la integración «web viva» aprobada por el propietario.

### 7 de octubre: copia, historial y batería de QA

- Copia completa del repositorio (`git clone --mirror`) fuera de cualquier repo, antes de
  tocar el historial.
- Borradas las ramas de exploración `propuesta-a` y `propuesta-c`, cuya mezcla ya está en
  `rediseno`. Sus despliegues de Vercel se borran en la limpieza final.
- Revisión de todos los commits de todas las ramas, leyendo el diff de cada uno, para
  redactar este historial y localizar lo que no debe seguir en el historial público.
- Batería permanente de pruebas en `tools/qa` (Playwright y axe-core, con su propio
  `package.json`): tamaños de 320 a 2560 px, las cinco páginas, tres idiomas, sin JS,
  movimiento reducido y zoom al 200 %. Compara los fallos conocidos por elemento y medida,
  fija la CSP esperada y se pasa completa antes de cada commit.

### 8 y 18 de octubre, y 8 de noviembre: el hero que se rompía a trozos

- Causa encontrada: cuando las capas compuestas del hero no caben en la memoria de GPU, el
  navegador deja teselas sin pintar (bloques negros, pista fuera del logo, barra del logo
  separada). Arreglo de fondo: una sola capa enmascarada con la geometría del logo, tinte y
  penumbra como colores planos, capas solo mientras hay movimiento, la pista 3D congelada en
  una imagen en reposo, el texto del hero en su propia capa, y sin pintar la imagen fija ni el
  velo mientras no se ven.
- La pista 3D se recupera si se pierde el contexto WebGL (mientras tanto, la imagen fija); el
  progreso del hero se calcula bien aunque la página se cargue muy abajo.
- Regresión en la batería (módulo `hero`): los escenarios del encargo repetidos muchas
  veces, con memoria de GPU justa, compartida y en movimiento, sin reintentos. El riesgo que
  queda está descrito en `CLAUDE.md`.

### 8 de noviembre: datos de los carteles, arreglos de diseño e idiomas

- **Datos de los carteles del club**, tal cual y con su fecha de verificación y fuente:
  tarifas de pista (IVA incluido) dentro de «El club», horario semanal de los pools (día,
  hora, pool y pistas) y la sección «Colaborar con el club» con sus opciones, la
  disponibilidad de pistas y el contacto por WhatsApp. `tools/validar.js` exige `verificado`
  y `fuente` a todo bloque que caduca y avisa a los 90 días.
- `tools/generar.js` alterna las superficies (tinta y negro) entre las secciones visibles.
- El cursor del sistema se ve siempre bajo el punto que lo acompaña (respeta cursores
  grandes o de alto contraste), con su prueba en la batería.
- Por debajo de 408 px el nombre del club junto al logo se oculta también sin JS.
- El titular del hero de `/` ya no parte «Eleva» ni «Pádel», y «Reservas» ya no se parte en
  los títulos.
- En «Colaborar con el club», el número de WhatsApp va unido a la palabra anterior y la
  línea de contacto ya no se parte a 320 px. Salió en el mismo commit que la nota del README
  sobre `verificado` y `fuente` (30c56a3), cuyo mensaje solo cita la nota.
- **Idiomas rehechos (fase A del punto 7)**: una sola fuente por texto con sus tres idiomas
  y la huella del español del que sale cada traducción (`js/translations.js` y el manifest);
  `tools/validar.js` falla con una traducción desfasada, un texto visible sin clave, una
  clave sin uso o una lista de nombres propios distinta de la de `CLAUDE.md`. El idioma se
  decide antes de la primera pintura (`js/idioma.js`, sin destello en español), se recuerda
  solo cuando el usuario lo elige y, si no, se toma del navegador. Lo pendiente de traducir
  se pinta en español marcado `lang="es"`. Cambiar de idioma lo alcanza todo (textos,
  atributos, `<title>`, metas, WhatsApp, formulario y lo pintado después) y la ida y vuelta
  deja el DOM igual. Módulo `idiomas` en la batería.
- **404 y mantenimiento en tres idiomas**: salen en el idioma guardado o del navegador, con
  el mismo selector arriba a la derecha; sin JS, en español. Sus textos los escribe
  `tools/generar.js`.

### 24 y 25 de noviembre: superficies, cancelaciones, tarifas y correcciones

- **Sin destello marrón con el scroll** (propuesta M1, elegida por el usuario): el corte de
  sección (telón y logo que crece) queda solo en las secciones de tinta; las negras entran
  tal cual. Antes, su telón era tinta y se veía hasta una pantalla marrón que volvía a negro.
- El pie sigue la alternancia de superficies: si la última sección visible es negra, el pie
  es tinta (en `/pizarra`, Contacto ya no se pega al pie).
- **Política de cancelaciones como paneles de cristal de pista** (propuesta C2, elegida por
  el usuario): canto LED que se enciende al entrar, reflejo que cruza el panel con el scroll
  y el rótulo de cada norma destacado. El texto es el del cartel, sin cambios, y se lee
  desde el primer fotograma, sin JS y con movimiento reducido. Sustituye al formato de filas
  (`.filas > .fila`), que deja de usarse y se borra.
- Tarifas de pista: «Lunes a viernes» en lugar de «L–V» (legibilidad); se publica que los
  precios son por pista y que la tarifa de 15 € y 22 € es de lunes a viernes desde las
  17:00 h y todo el día los fines de semana y festivos (confirmado por el propietario). La
  hora no se separa de su «h» a 320 px.
- Correcciones de la revisión de idiomas: en mantenimiento, la lista de idiomas cerrada ya
  no se ve; cambiar de idioma a media página no mueve el scroll; con la red muy lenta no se
  ve el español antes del idioma elegido (el seguro de `js/idioma.js` espera a que la página
  termine de leerse, con un tope de 8 s). La batería lo comprueba, y también que cada enlace
  de WhatsApp lleve su mensaje en el idioma de la página.
- Hero de `/pizarra` con memoria de GPU justa: el tinte y el velo ya no se pintan nunca a la
  vez (el velo empieza en 0,4, cuando el tinte ya es transparente). Las tomas rotas en
  movimiento bajan de 15 de 90 a 3 de 90, sin empeorar los fotogramas por segundo.
- Cancelaciones: los títulos de los paneles ya no cambian de escala con el scroll (el texto
  no se mueve; solo se anima la luz), y sin `:has()` el rótulo de cada norma conserva su
  separación.
- Repositorio: fin de línea LF fijado en `.gitattributes` (con `core.autocrlf=true`,
  `validar.js` daba errores falsos en un clon nuevo), `.editorconfig`, `.vercelignore` más
  preciso, código muerto fuera y documentación al día.

### 25 de noviembre: página legal, traducciones y QA final

- **Página legal rehecha con solo lo confirmado** (`/privacidad`): sin enlaces `tel:`, sin
  normas del club ni prácticas fuera de la web que el club no ha confirmado; lo que la web
  guarda en el navegador, sacado del código (`eleva-lang` en `localStorage`, solo al elegir
  idioma, y la cookie `eleva-acceso` del mantenimiento, más la de seguridad de Vercel); el
  formulario descrito como es. La política de cancelaciones sale del manifest del club, la
  misma fuente que `/pizarra`. Textos propios en `js/legal-textos.js`, con marcado en línea
  (negrita, `código` y enlaces) que `generar.js` y el navegador pintan con la misma función.
  Titular y NIF siguen sin publicarse.
- Correcciones de la revisión legal, en los tres idiomas: el derecho de limitación con los
  supuestos del art. 18.1 del RGPD, WhatsApp Ireland Limited como responsable en el EEE y,
  en Vola, solo la cuenta y la reserva.
- El nombre del único patrocinador conocido sale de lo servido (la sección solo se pinta con
  la lista completa confirmada).
- **Traducciones al inglés británico y al neerlandés de los Países Bajos integradas** (fase B
  del punto 7): toda la web y la página legal, cada idioma con traductor y revisor y con la
  huella del español del que sale. La legal en EN/NL avisa de que solo vale la española.
  Desde entonces no queda ningún texto pendiente: `PERMITIR_PENDIENTES` pasa a `false` y un
  texto nuevo entra en el mismo commit que sus traducciones revisadas. Una traducción idéntica
  al español solo vale si es neutra o va marcada `igual` en la fuente.
- Batería: `/privacidad` también en inglés y neerlandés; la prueba de que no queda español en
  EN/NL solo acepta invariables de una lista explícita (nombres propios, navegadores, dominios,
  rutas y `código`); cambiar de idioma a media página mide lo que se está leyendo, también a
  390 px táctil. El servidor local ya no sirve `vercel.json` ni `middleware.js`, como Vercel.
- Títulos de pestaña con un único separador « | » (404 y legal).
- **Arreglos de la QA final** (agente distinto, batería completa con 50 repeticiones del hero):
  - `/privacidad` sin salto de la cabecera al cargar (CLS en móvil de 0,139 a 0): precarga de
    Barlow Condensed y enlaces de vuelta siempre en columna en móvil. La batería mide el CLS
    con las fuentes servidas 3 s tarde.
  - **URL del sitio en una sola constante** (`SITIO` de `tools/sitio.js`, `elevapadel.com`):
    de ella salen canónicas, og:url, og:image, JSON-LD, `sitemap.xml` y `robots.txt`, y
    `validar.js` falla si aparece escrita a mano. El dominio aún no está activo: tiene que
    servir HTTPS antes de llevarlo a `main` y de quitar el mantenimiento.
  - La cookie `eleva-acceso` guarda un HMAC de la clave de mantenimiento, no la clave.
  - Sin JS, el formulario de contacto (que necesita JS) no se muestra.
  - `validar.js` exige en cada traducción los mismos fragmentos `código` que en el español.
  - Fuentes Barlow registradas en `credits.json`, sin código en comentarios y documentación
    con las mismas cifras.

Pendiente (a 25/11/2026):
- Aprobar los textos nuevos en español (`/`, `/pizarra`, 404, mantenimiento y legal) y, al
  integrarlos, retraducir al inglés y al neerlandés los que cambien.
- Titular y NIF de la web (los exige la ley a la vista en la página legal) y las preguntas
  abiertas de la legal; revisión jurídica recomendada antes de publicar.
- Dominio elevapadel.com: compra o propiedad, alta en Vercel, `www` y `vercel.app` con
  redirección 301, HTTPS y, después, salida del mantenimiento (nada sin OK del propietario).
- Procedencia y licencia de la foto ilustrativa y de la imagen para redes, o fotos reales.
- Pruebas en el iPhone (Safari iOS), que la batería no puede cubrir.
- Reconfirmar con el club los datos verificados el 30/09/2026 antes del 29/12/2026.
- Borrador de la marca solo en local, aún fuera del sistema de idiomas.
- Sustitución del historial de Git por un único commit documentado aquí.
- El rediseño visual (paleta clara) llegará después y rehará el hero y la composición,
  también el protagonismo de la pista 3D.

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
  punto que acompaña al cursor del sistema, que se ve siempre.
- **Logo sin fondo** (`assets/img/logo-sin-fondo.svg`, el logo oficial sin su rectángulo) en
  cabecera, pie, `/`, 404, mantenimiento y máscaras.
- **Pools**: color propio de cada insignia, muestreado de su imagen, como único marcador de
  categoría; giro, inclinación y abanico, siempre dentro de su celda.
- **Selector de idioma** en la cabecera, fuera del menú, manejable por teclado.
- Formato de filas (`.filas > .fila`), estrenado en Cancelaciones (sustituido el 24/11/2026
  por los paneles de cristal de pista).
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
  `Retry-After` y `noindex` (salvo el favicon, los iconos de la web y `robots.txt`; después, también el logo y
  los glifos que usa la página), con una página propia con logo y canales de contacto. Desde el
  08/11/2026 sale en tres idiomas, con selector, y se sirven también los JS del idioma. Acceso con
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
