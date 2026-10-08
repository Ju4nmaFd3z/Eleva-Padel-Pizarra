# Batería de QA (`tools/qa`)

Pruebas de navegador del sitio con Playwright (Chromium) y axe-core. Es una
herramienta de desarrollo: no se publica (`tools/` está en `.vercelignore`) y
sus dependencias viven solo aquí, nunca en la raíz del repo.

**Se pasa completa antes de cada commit** que toque HTML, CSS, JS, manifest o
la configuración del sitio, y en la QA final. `--rapido` es solo una ayuda
mientras se trabaja: nunca da un commit por bueno. Ningún commit se sube con
fallos nuevos.

## Instalar (una vez, y cuando cambie `package-lock.json`)

```sh
cd tools/qa
npm ci
npx playwright install chromium
```

Versiones fijadas en `package.json`: Playwright 1.63.0 y axe-core 4.13.0.
Node 22 o superior.

## Ejecutar (desde la raíz del repo)

```sh
node tools/qa/bateria.js            # todo: antes de cada commit (~80 s con 8 a la vez)
node tools/qa/bateria.js --rapido   # subconjunto, solo como ayuda mientras se trabaja
```

La batería arranca su propio `tools/servidor-local.js` (dos instancias: la
normal y otra con `MANTENIMIENTO=1`) en puertos libres, ejecuta los casos y
los para al terminar. Sale con código 0 si todo está bien, 1 si hay fallos y
2 si no ha podido ejecutarse.

| Opción | Qué hace |
|---|---|
| `--rapido` | solo los casos marcados como rápidos |
| `--modulo a,b` | solo esos módulos (`responsive`, `interaccion`, `servidor`, `accesibilidad`, `hero`) |
| `--pagina a,b` | solo esas páginas (`marca`, `pizarra`, `privacidad`, `404`, `mantenimiento`) |
| `--caso texto` | casos cuyo id contiene el texto; `--caso "/regex/"` para una expresión |
| `--lista` | muestra los casos que se ejecutarían y sale |
| `--puerto N` | puerto del servidor normal (el de mantenimiento, el siguiente libre) |
| `--paralelo N` | casos a la vez (por defecto los núcleos menos dos, entre 2 y 8) |

Resultados en `tools/qa/resultados/` (fuera de Git): `resultado.json` con
todos los casos y `capturas/` con una captura de página completa de cada caso
que falla.

## Qué comprueba

- **responsive**: 21 tamaños (320 a 2560 px, apaisados, tabletas y zoom 200 %
  = 640×400 px CSS), las cinco páginas (`/`, `/pizarra`, `/privacidad`, 404 y
  mantenimiento), ES/EN/NL, sin JS y con movimiento reducido. Recorre cada
  página pantalla a pantalla y en cada parada revisa: desborde horizontal,
  contenido fuera de la vista, texto recortado, objetivos de menos de 44 px en
  táctil (24 px con ratón, con la excepción de espaciado de WCAG 2.5.8; los
  enlaces dentro de un texto quedan exentos), campos con letra de menos de
  16 px, cajas sin texto (fondo o borde) que salen de la vista, y contenido
  que debería verse y no se ve (opacidad 0 o `visibility: hidden` en
  pantalla; `display: none` en cualquier sitio), con o sin JS. Solo dos
  ocultaciones están previstas: el selector de idioma sin JS y el menú móvil
  cerrado. Un contenedor con scroll horizontal solo vale si es una región
  accesible (`tabindex="0"` y nombre, como las tablas de `/privacidad`); la cabecera sin solapes ni segunda línea; el nombre del club oculto
  por debajo de 408 px (con y sin JS); el menú y el selector de idioma
  abiertos; y en cada carga, errores y avisos de consola, errores de página,
  peticiones fallidas o con error, peticiones a terceros, CSP (cabecera y
  violaciones) y estado HTTP.
- **interaccion**: selector de idioma con teclado y ratón, menú móvil (foco
  en ciclo, Escape, paso a escritorio), orden e indicador del foco, giro de
  las insignias, abanico de los pools dentro de su celda, idioma recordado
  solo al elegirlo, sin JS (menú desplegado, selector oculto) y que la pista
  3D no se pide al entrar por un ancla ni sin GPU.
- **servidor**: CSP fijada en el módulo (la de `vercel.json` y la del
  mantenimiento tienen que ser exactamente esas, sin orígenes externos, comodines,
  eval ni scripts inline), cabeceras de seguridad, URLs limpias, 404,
  excluidos de `.vercelignore` y el modo mantenimiento (503, `Retry-After`,
  noindex, clave y cookie).
- **accesibilidad**: axe-core, WCAG 2.2 A/AA, infracciones graves y críticas.
- **hero**: el hero de /pizarra en 14 escenarios × 5 dispositivos (1920,
  1440 y 1280 con ratón; 390 y 360 táctiles) con GPU real (ANGLE): carga en
  frío, recarga a mitad de página, atrás/adelante con bfcache (ventana fuera
  de la pantalla), cambio de tamaño u orientación y de densidad durante la
  entrada, pestaña oculta antes de los 6 s del 3D, primer gesto, scroll
  rápido mientras se crea la escena, fuentes lentas, CPU y red lentas,
  contexto WebGL perdido y recuperado, sin WebGL, movimiento reducido y
  GPU con poca memoria (`gpu-justa`: `--force-gpu-mem-available-mb`
  proporcional a los píxeles de la pantalla; se comprueba en reposo). En
  cada momento comprueba (`lib/hero.js`) que la caja del logo es la que
  dicta el CSS (`--L`, `--mx`, `--my`, escala del progreso) y muestrea la
  captura: fuera del logo solo negro, dentro el tinte; y al final, o la
  pista 3D a la vista o la imagen fija, nunca nada a medias. Los tiempos
  salen de una semilla por repetición (aparece en el fallo). Una repetición
  por caso; la QA final, 50:
  `QA_HERO_REP=50 node tools/qa/bateria.js --modulo hero` (más de una hora).

La espera es siempre por condición (fuentes, imágenes de la pantalla y
animaciones con fin terminadas), nunca por tiempo fijo, y sin reintentos: si
un caso falla una vez, es un fallo.

## Fallos conocidos

`lib/conocidos.js` lista los fallos reales del sitio ya apuntados y pendientes
de arreglo, uno a uno, con tipo, elemento y medida exactos (se comparan como
texto): un fallo nuevo en el mismo elemento o con otra medida no queda tapado.
La batería los imprime en su propio bloque en cada ejecución y no cambian el
código de salida mientras sigan ocurriendo igual. Si uno deja de ocurrir, la
batería falla hasta que se quita su línea: quien lo arregla la quita en el
mismo commit. Nunca se añade una entrada para silenciar un fallo
nuevo: los fallos se arreglan.

## Añadir un módulo

1. Crea `modulos/<nombre>.js` que exporte:

   ```js
   module.exports = {
     nombre: 'hero',
     descripcion: 'escenarios de carga del hero',
     casos: () => [{
       id: 'hero · carga en frío · 1920x1080',   // único; empieza por el nombre del módulo
       pagina: 'pizarra',                      // para --pagina
       rapido: false,                          // entra en --rapido
       limiteMs: 180000,                       // opcional
       async ejecutar(entorno) {               // devuelve una lista de fallos
         // entorno: navegador, lanzar(clave, opcionesDeLaunch), base,
         //          baseMantenimiento, claveMantenimiento, capturar(p, id)
         return [{ tipo: 'hero', clave: 'máscara desalineada', detalle: '12 px' }];
       }
     }]
   };
   ```

2. Regístralo en la lista `MODULOS` de `bateria.js`.
3. Usa `lib/pagina.js` (`abrir`, `estabilizar`, `recorrer`,
   `problemasDeRegistro`) y `lib/vistas.js` para no repetir código, y
   `entorno.capturar(p, id)` cuando un caso falle.
4. Si necesitas GPU u otras opciones de Chromium, pide un navegador propio con
   `await entorno.lanzar('gpu', { args: [...] })`; la batería lo cierra al final.
5. Ejecuta el módulo tres veces seguidas: los tres resultados tienen que ser
   idénticos antes de subirlo.
