/* =========================================================
   ELEVA PÁDEL — MANIFEST DE CLUB · PLANTILLA (esquema comentado)
   =========================================================
   Esta carpeta NO se publica (está en .vercelignore) y NO es una página
   que funcione: es solo el esquema de referencia. Para dar de alta una
   sede nueva, sigue el README de esta carpeta. En resumen:

     1. Copia /pizarra/ a una carpeta de PRIMER NIVEL con el slug del club
        (p. ej. /marbella/): su index.html y su manifest.js.
     2. Ajusta el <script src="../<slug>/manifest.js?v=…"> del index
        (el prefijo "../<slug>/" es obligatorio: ver más abajo).
     3. Edita lo estático de ese index.html (SEO, splash, marca lateral, pie…).
     4. Rellena este manifest con los datos reales, incluido el bloque i18n.
     5. Genera el plano del pie: clubs/_plantilla/generar-mapa.js.
     6. Añade la sede a HOME_CLUBS en js/main.js y la URL a sitemap.xml.

   RUTAS DE ASSETS: se resuelven contra el DOCUMENTO del club
   (…/<slug>/index.html), por eso llevan el prefijo "../" para llegar a los
   assets compartidos de la raíz. Ese prefijo funciona en local y en Vercel
   con y sin barra final. NO uses rutas absolutas "/assets/…": rompen al
   abrir el HTML en local. Y ojo con el <script> del manifest: "manifest.js" a secas se
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
               mapsUrl, schedule, mapImage }
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
   brand.legalName, brand.phoneCountry, brand.geo (coordenadas para generar
   el plano) y `torneo`. Si algún día hace falta
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
      geo:                { lat: 36.700000, lng: -4.400000 },  // para generar-mapa.js
      instagram:          { url: 'https://instagram.com/tu_club', handle: '@tu_club' },
      whatsappCommunity:  'https://chat.whatsapp.com/XXXXXXXXXXXXXXX',
      volaReservas:       'https://vola.plus/app-link/club/0000',
      mapsUrl:            'https://maps.app.goo.gl/XXXXXXXX',
      // Se usa si el club no define club.scheduleValue en su bloque i18n.
      // Con i18n propio es mejor allí, para que se traduzca.
      schedule:           'L–D · 9:00–00:00',
      // Plano del pie: node clubs/_plantilla/generar-mapa.js <lat> <lng> assets/maps/<slug>.svg
      mapImage:           '../assets/maps/tu-club.svg',
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
      // Sin foto (photo:null) se pinta un monograma con la inicial.
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

    /* Cadenas PROPIAS de esta sede, en los tres idiomas. La lista completa
       de claves que hay que sobrescribir está en el README de esta carpeta
       («Claves que una sede debe sobrescribir siempre»). */
    i18n: {
      es: {
        'meta.title':         'Eleva Padel Club · Ciudad, Provincia',
        'hero.kicker':        'PADEL CLUB · N PISTAS · CIUDAD · PROVINCIA',
        'marquee.courts':     'N Pistas',
        'marquee.location':   'Ciudad, Provincia',
        'club.courtsDesc':    'N pistas …',
        'club.scheduleValue': 'L–D · 9:00–00:00',
        'services.desc1':     'N pistas … Reserva online en Vola o por teléfono.',
        'pools.include':      '8€ por jugador · Bolas nuevas · 1h30 · Horario a consultar por WhatsApp',
        'pools.prize':        'Premio del club',
        'gallery.subtitle':   'Imágenes ilustrativas · Ciudad, Provincia',
        'gallery.img1':       'Descripción de lo que se ve en la foto 1',
        'footer.claim':       'Claim propio del club.',
        'team.role1':         'Monitor · Coordinador',
        'team.bio1':          'Breve biografía.',
        'sponsors.sub':       'Texto sobre los patrocinadores del club.',
      },
      en: {
        'meta.title':         'Eleva Padel Club · City, Province',
        'hero.kicker':        'PADEL CLUB · N COURTS · CITY · PROVINCE',
        'marquee.courts':     'N Courts',
        'marquee.location':   'City, Province',
        'club.courtsDesc':    'N courts …',
        'club.scheduleValue': 'Mon–Sun · 9 am–midnight',
        'services.desc1':     'N courts … Book online on Vola or by phone.',
        'pools.include':      '€8 per player · New balls · 90 min · Schedule to be confirmed via WhatsApp',
        'pools.prize':        'Club prize',
        'gallery.subtitle':   'Illustrative images · City, Province',
        'gallery.img1':       'Description of what photo 1 shows',
        'footer.claim':       'Club claim.',
        'team.role1':         'Coach · Coordinator',
        'team.bio1':          'Short bio.',
        'sponsors.sub':       'About the club sponsors.',
      },
      nl: {
        'meta.title':         'Eleva Padel Club · Stad, Provincie',
        'hero.kicker':        'PADELCLUB · N BANEN · STAD · PROVINCIE',
        'marquee.courts':     'N Banen',
        'marquee.location':   'Stad, Provincie',
        'club.courtsDesc':    'N banen …',
        'club.scheduleValue': 'Ma–Zo · 9.00–24.00 uur',
        'services.desc1':     'N banen … Reserveer online via Vola of telefonisch.',
        'pools.include':      '€ 8 per speler · Nieuwe ballen · 90 min · Tijden op aanvraag via WhatsApp',
        'pools.prize':        'Clubprijs',
        'gallery.subtitle':   'Illustratieve beelden · Stad, Provincie',
        'gallery.img1':       'Beschrijving van wat foto 1 laat zien',
        'footer.claim':       'Claim van de club.',
        'team.role1':         'Trainer · Coördinator',
        'team.bio1':          'Korte biografie.',
        'sponsors.sub':       'Over de sponsors van de club.',
      },
    },

    gallery: [
      '../assets/img/tu-club-galeria-01.jpg',
      // … una entrada por foto; el índice corresponde a .gi-N del HTML
    ],

  };
})();
