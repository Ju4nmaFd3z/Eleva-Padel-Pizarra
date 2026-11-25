/* =========================================================
   URL DEL SITIO (herramienta local; tools/ no se publica)
   ---------------------------------------------------------
   Única fuente de la URL absoluta del sitio. De aquí salen, al
   ejecutar node tools/generar.js: las canónicas, hreflang, og:url y
   og:image (elementos con data-sitio="/ruta"), el JSON-LD de / y de
   cada club, sitemap.xml y la línea Sitemap de robots.txt.
   tools/validar.js falla si la URL del sitio (esta o la de
   *.vercel.app) aparece escrita a mano en cualquier otro archivo.

   El dominio tiene que servir HTTPS antes de que esto llegue a main
   y se quite el mantenimiento (si no, las canónicas apuntarían a un
   dominio muerto): plan en CLAUDE.md, «Dominio».
   ========================================================= */
'use strict';

const SITIO = 'https://elevapadel.com';

module.exports = { SITIO };
