/* =========================================================
   ELEVA PÁDEL — MANIFEST DE CLUB · PLANTILLA (esquema comentado)
   =========================================================
   Esta carpeta NO se publica (está en .vercelignore) y NO es una página
   que funcione: es solo el esquema de referencia. Para dar de alta una
   sede nueva, sigue el README de esta carpeta. En resumen:

     1. Copia /pizarra/ a una carpeta de PRIMER NIVEL con el slug del club
        (p. ej. /marbella/): su index.html y su manifest.js.
     2. Edita el SEO estático del <head> de ese index.html.
     3. Ajusta el <script src="../<slug>/manifest.js?v=…"> del index
        (el prefijo "../<slug>/" es obligatorio: ver más abajo).
     4. Rellena este manifest con los datos reales, incluido el bloque i18n.
     5. Añade la sede a HOME_CLUBS en js/main.js y la URL a sitemap.xml.

   RUTAS DE ASSETS: se resuelven contra el DOCUMENTO del club
   (…/<slug>/index.html), por eso llevan el prefijo "../" para llegar a los
   assets compartidos de la raíz. Ese prefijo funciona en file:// y en Vercel
   con y sin barra final. NO uses rutas absolutas "/assets/…": rompen en
   file://. Y ojo con el <script> del manifest: "manifest.js" a secas se
   resuelve como "/manifest.js" cuando Vercel sirve la página en /<slug>
   (sin barra final), así que SIEMPRE "../<slug>/manifest.js".

   i18n POR SEDE (bloque `i18n` al final): las cadenas propias del club
   (ciudad, horario, claim, bio de su monitor/a…) viven aquí, NO en
   js/translations.js, para que una sede nueva no herede los textos de
   Pizarra. Orden de resolución en el motor:
       i18n[idioma][clave] → translations[idioma][clave]
                           → i18n.es[clave] → translations.es[clave]
   Las claves se declaran planas ("hero.kicker").

   CLAVES i18n EN LOS DATOS: para los textos traducibles usa la variante
   "*Key" y el motor resolverá la clave de traducción. Implementadas hoy en
   js/main.js: roleKey, bioKey, badgeKey, labelKey, titleKey, unitKey.
   NO existen altKey ni courtLabelKey: `alt` y `courtLabel` son texto plano.

   ── ESQUEMA ──────────────────────────────────────────────
   brand:    { name, legalName, phone, phoneCountry, phoneRegex,
               phoneDisplayPrefix, address, geo:{lat,lng},
               instagram:{url,handle}, whatsappCommunity, volaReservas,
               mapsUrl, schedule }
   pools:    [ { cat, img, alt } ]
   team:     [ { name, photo?, roleKey|role, bioKey|bio } ]
   sponsors: [ { court, name, badgeKey|badge }        // fila con pista propia
               | { name, courtLabel, badgeKey|badge } // colaborador sin pista
               | { soon:true } ]                      // fila "¿Tu empresa aquí?"
   pricing:  { courts:  [ { labelKey|label, price } ],
               academy: [ { titleKey|title,
                            rows:[ { labelKey|label, value, unitKey, unit } ] } ] }
   i18n:     { es:{…}, en:{…}, nl:{…} }
   gallery:  [ "../assets/img/…" ]     // el índice corresponde a .gi-N del HTML

   CAMPOS QUE HOY NO LEE NADIE (puramente documentales): brand.name,
   brand.legalName, brand.phoneCountry y `torneo`. Si algún día hace falta
   un banner de evento, hay que implementarlo en js/main.js primero.
   ========================================================= */
(function () {
  window.__ELEVA__ = {

    brand: {
      name:               'NOMBRE DEL CLUB',
      legalName:          'NOMBRE LEGAL S.L.',
      phone:              '34600000000',      // solo dígitos, con prefijo país
      phoneCountry:       'ES',               // ISO de 2 letras: 'ES', 'NL'…
      phoneRegex:         '^34\\d{9}$',       // validación. NL móvil: '^31\\d{9}$'
      phoneDisplayPrefix: '+34',              // NL → '+31'
      address:            'Calle Ejemplo 1 · 00000 Ciudad, Provincia',
      geo:                { lat: 36.700000, lng: -4.400000 },  // sin coords válidas no se pinta mapa
      instagram:          { url: 'https://instagram.com/tu_club', handle: '@tu_club' },
      whatsappCommunity:  'https://chat.whatsapp.com/XXXXXXXXXXXXXXX',
      volaReservas:       'https://vola.plus/app-link/club/0000',
      mapsUrl:            'https://maps.app.goo.gl/XXXXXXXX',
      // Se usa si el club no define club.scheduleValue en su bloque i18n.
      // Con i18n propio es mejor allí, para que se traduzca.
      schedule:           'L–D · 9:00–00:00',
    },

    /* cat controla el color (css/main.css → --pool-accent): 'masculina',
       'femenina', 'mixta' o 'rocha'.
       img = nombre base en ../assets/pools/opt/ (sin talla ni extensión);
       hacen falta -240/-480/-720.avif y -480.jpg de cada uno. */
    pools: [
      { cat: 'masculina', img: 'pool_ejemplo_masculina', alt: 'Pool 4ª · M · Nombre del Club' },
      // { cat: 'femenina', img: '…', alt: '…' },
      // { cat: 'mixta',    img: '…', alt: '…' },
      // { cat: 'rocha',    img: '…', alt: '…' },
    ],

    team: [
      // Con textos propios del club, mejor por i18n: roleKey/bioKey apuntando
      // a claves definidas en el bloque i18n de abajo.
      { name: 'Nombre Apellido', photo: '../assets/img/team-ejemplo.jpg',
        roleKey: 'team.role1', bioKey: 'team.bio1' },
      // Alternativa sin traducir: { name:'…', photo:null, role:'Monitor', bio:'…' },
    ],

    sponsors: [
      { court: '01', name: 'Patrocinador 1', badgeKey: 'sponsors.badge' },
      { court: '02', name: 'Patrocinador 2', badgeKey: 'sponsors.badge' },
      // Colaborador sin pista asignada (courtLabel es texto plano, neutro):
      { name: 'Colaborador 1', courtLabel: '—', badgeKey: 'sponsors.collab' },
      // { soon: true },   // fila "¿Tu empresa aquí?" — solo si queda pista libre
    ],

    pricing: {
      courts: [
        { labelKey: 'services.rate1dt', price: '8€' },
        { labelKey: 'services.rate3dt', price: '15€' },
      ],
      academy: [
        {
          titleKey: 'academy.pricingAdultsTitle',
          rows: [
            // unitKey = clave i18n; unit = mismo texto en ES como red de seguridad
            { labelKey: 'academy.adults1dt', value: '60', unitKey: 'unit.month', unit: '€/mes' },
            { labelKey: 'academy.adults2dt', value: '95', unitKey: 'unit.month', unit: '€/mes' },
          ],
        },
      ],
    },

    /* Cadenas PROPIAS de esta sede, en los tres idiomas. Copia de
       pizarra/manifest.js la lista completa de claves que conviene
       sobrescribir (ciudad, horario, claim, equipo…). */
    i18n: {
      es: {
        'hero.kicker':        'PADEL CLUB · N PISTAS · CIUDAD · PROVINCIA',
        'marquee.location':   'Ciudad, Provincia',
        'club.scheduleValue': 'L–D · 9:00–00:00',
        'footer.claim':       'Claim propio del club.',
        'team.role1':         'Monitor · Coordinador',
        'team.bio1':          'Breve biografía.',
      },
      en: {
        'hero.kicker':        'PADEL CLUB · N COURTS · CITY · PROVINCE',
        'marquee.location':   'City, Province',
        'club.scheduleValue': 'Mon–Sun · 9:00–midnight',
        'footer.claim':       'Club claim.',
        'team.role1':         'Coach · Coordinator',
        'team.bio1':          'Short bio.',
      },
      nl: {
        'hero.kicker':        'PADELCLUB · N BANEN · STAD · PROVINCIE',
        'marquee.location':   'Stad, Provincie',
        'club.scheduleValue': 'Ma–Zo · 9:00–00:00',
        'footer.claim':       'Claim van de club.',
        'team.role1':         'Trainer · Coördinator',
        'team.bio1':          'Korte biografie.',
      },
    },

    gallery: [
      '../assets/img/gallery-01.jpg',
      // … hasta 16 (el índice corresponde a .gi-N del HTML)
    ],

  };
})();
