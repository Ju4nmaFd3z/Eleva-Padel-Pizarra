/* =========================================================
   ELEVA PÁDEL — MANIFEST DE CLUB · PIZARRA
   =========================================================
   Fuente única de los DATOS REPETIBLES de esta sede (pools, equipo,
   patrocinadores, precios, enlaces). Lo crítico para SEO (title, meta,
   OG, JSON-LD, H1, copy del hero) vive ESTÁTICO en index.html.

   Cada club tiene su propio manifest colocado junto a su index.html
   (p. ej. /pizarra/manifest.js). El motor de render (js/main.js) lee
   window.__ELEVA__ y rellena el DOM.

   RUTAS DE ASSETS: se resuelven contra el DOCUMENTO (…/pizarra/index.html),
   por eso usan el prefijo "../" para llegar a los assets compartidos de la
   raíz. Este mismo prefijo funciona en file://, en Vercel con y sin barra
   final. NO uses rutas absolutas "/assets/…" (rompen en file://).

   i18n: cuando un texto es traducible reutiliza su clave de
   js/translations.js mediante "*Key" (roleKey, bioKey, labelKey, badgeKey…).
   Si en su lugar das un texto plano ("role", "bio", "label", "badge"),
   el render lo pinta tal cual (útil para un club sin traducciones propias).

   i18n POR SEDE (bloque `i18n` al final de este archivo): las cadenas que
   son PROPIAS de este club (ciudad, horario, claim, bio de su monitora…)
   viven aquí, no en js/translations.js. Orden de resolución en el motor:
       i18n del club[lang] → translations[lang] → i18n del club.es → translations.es
   Así una segunda sede no hereda "PIZARRA · MÁLAGA". Las claves se declaran
   planas ("hero.kicker") y se expanden también a objetos anidados, de modo
   que ambos accesos funcionan: i18n.es['hero.kicker'] y i18n.es.hero.kicker.

   Tras cualquier cambio: sube el ?v= de este <script> en index.html.

   ── ESQUEMA (resumen) ────────────────────────────────────
   brand: {
     name, legalName,
     phone,               // solo dígitos con prefijo país, ej '34659143103'
     phoneCountry,        // ISO country, ej 'ES' / 'NL'
     phoneRegex,          // string de RegExp de validación, ej '^34\\d{9}$'
     phoneDisplayPrefix,  // ej '+34'
     address, geo:{lat,lng},
     instagram:{url,handle},
     whatsappCommunity,   // URL invitación grupo/comunidad WhatsApp
     volaReservas,        // URL de reservas (Vola u otra plataforma)
     mapsUrl,             // URL "cómo llegar"
     schedule             // string legible del horario
   }
   pools:   [ { cat, img, alt } ]              // cat = clave de --pool-accent en CSS
                                              // (alt: texto plano; no hay altKey)
   team:    [ { name, photo?, roleKey|role, bioKey|bio } ]
   sponsors:[ { court, name, badgeKey|badge }          // fila con pista propia
              | { name, courtLabel, badgeKey|badge }    // sin pista (courtLabel: texto plano)
              | { soon:true } ]                        // fila "¿Tu empresa aquí?"
   pricing: {
     courts:  [ { labelKey|label, price } ],
     academy: [ { titleKey|title, rows:[ { labelKey|label, value, unitKey + unit } ] } ]
                 // unitKey = clave i18n; unit = mismo texto en ES como red de seguridad
   }
   i18n:    { es:{clave:valor}, en:{…}, nl:{…} }   // cadenas propias de la sede
   torneo:  { flagKey|flag, textKey|text, ctaKey|cta, url } | null  (opcional)
   gallery: [ "../assets/img/…" ]              // índice = .gi-N en el HTML
   ========================================================= */
(function () {
  window.__ELEVA__ = {

    /* ── MARCA / CONTACTO ────────────────────────────────── */
    brand: {
      name:               'Eleva Padel Club',
      legalName:          'Eleva Padel Club',
      phone:              '34659143103',      // sin + ni espacios
      phoneCountry:       'ES',
      phoneRegex:         '^34\\d{9}$',       // validación E.164 nacional
      phoneDisplayPrefix: '+34',
      address:            'Pasaje de Jerez S/N · 29560 Pizarra, Málaga',
      geo:                { lat: 36.769391, lng: -4.709363 },
      instagram:          { url: 'https://instagram.com/elevapadelpizarra', handle: '@elevapadelpizarra' },
      whatsappCommunity:  'https://chat.whatsapp.com/EpKyuxIv74E2NWW1aBmPKE',
      volaReservas:       'https://vola.plus/app-link/club/1498',
      mapsUrl:            'https://maps.app.goo.gl/Up8sTtpszHeQTqwJ7',
      schedule:           'L–D · 9:00–00:00',
      /* Plano estático del pie, generado con:
         node clubs/_plantilla/generar-mapa.js 36.769391 -4.709363 assets/maps/pizarra.svg */
      mapImage:           '../assets/maps/pizarra.svg',
    },

    /* ── POOLS (9) ───────────────────────────────────────────
       cat  → controla el color: --pool-accent en css/main.css
       img  → nombre base en ../assets/pools/opt/ (sin talla ni extensión)
       alt  → texto alternativo NEUTRO de idioma (nombre de la pool + club):
              se lee igual en ES/EN/NL, sin adjetivos traducibles.
       Los horarios NO son fijos: no se publica día/hora por pool.        */
    pools: [
      { cat: 'masculina', img: 'pool_snp_masculina', alt: 'Pool SNP · M · Eleva Pádel Pizarra' },
      { cat: 'femenina',  img: 'pool_snp_femenina',  alt: 'Pool SNP · F · Eleva Pádel Pizarra' },
      { cat: 'masculina', img: 'pool_3a_masculina',  alt: 'Pool 3ª · M · Eleva Pádel Pizarra' },
      { cat: 'masculina', img: 'pool_4a_masculina',  alt: 'Pool 4ª · M · Eleva Pádel Pizarra' },
      { cat: 'femenina',  img: 'pool_4a_femenina',   alt: 'Pool 4ª · F · Eleva Pádel Pizarra' },
      { cat: 'masculina', img: 'pool_5a_masculina',  alt: 'Pool 5ª · M · Eleva Pádel Pizarra' },
      { cat: 'femenina',  img: 'pool_5a_femenina',   alt: 'Pool 5ª · F · Eleva Pádel Pizarra' },
      { cat: 'mixta',     img: 'pool_mixta',         alt: 'Pool Mixta · Eleva Pádel Pizarra' },
      { cat: 'rocha',     img: 'pool_rocha',         alt: 'Pool Rocha · Eleva Pádel Pizarra' },
    ],

    /* ── EQUIPO ───────────────────────────────────────────── */
    team: [
      {
        name:    'Lorena Vano',
        photo:   '../assets/img/team-lorena.jpg',
        roleKey: 'team.role1',
        bioKey:  'team.bio1',
      },
      {
        name:    'Maripaz',
        photo:   null,                 // sin foto → monograma con la inicial
        roleKey: 'team.role2',
        bioKey:  'team.bio2',
      },
    ],

    /* ── PATROCINADORES (7) ───────────────────────────────────
       Sólo 4 pistas llevan nombre de patrocinador: esas filas traen
       `court`. El resto son colaboradores SIN pista: en lugar de `court`
       traen `courtLabel` (texto neutro de idioma, aquí un guion) y su
       insignia es sponsors.collab ("Colaborador"). Nunca se inventa una
       pista para cuadrar la lista.
       El objeto { soon:true } (fila "¿Tu empresa aquí?") se ha retirado:
       las 4 pistas ya tienen nombre, así que anunciar un hueco libre no
       sería cierto. Para reactivarlo basta volver a añadir { soon:true }.  */
    sponsors: [
      { court: '01', name: 'Campoheltos',             badgeKey: 'sponsors.badge' },
      { court: '02', name: 'Cedrón',                  badgeKey: 'sponsors.badge' },
      { court: '03', name: 'Montajes Peyma',          badgeKey: 'sponsors.badge' },
      { court: '04', name: 'Kocsa Obras y Servicios', badgeKey: 'sponsors.badge' },
      { name: 'La Herradura',     courtLabel: '—', badgeKey: 'sponsors.collab' },
      { name: 'Bar La Herradura', courtLabel: '—', badgeKey: 'sponsors.collab' },
      { name: 'Siraco',           courtLabel: '—', badgeKey: 'sponsors.collab' },
    ],

    /* ── PRECIOS ──────────────────────────────────────────────
       courts  → dl .service-rates de la card "Pistas" (4 valores)
       academy → grid .academy-rates-grid (3 bloques, 10 valores)       */
    pricing: {
      courts: [
        { labelKey: 'services.rate1dt', price: '8€' },
        { labelKey: 'services.rate2dt', price: '12€' },
        { labelKey: 'services.rate3dt', price: '15€' },
        { labelKey: 'services.rate4dt', price: '22€' },
      ],
      academy: [
        {
          titleKey: 'academy.pricingAdultsTitle',
          rows: [
            { labelKey: 'academy.adults1dt', value: '60', unitKey: 'unit.month', unit: '€/mes' },
            { labelKey: 'academy.adults2dt', value: '75', unitKey: 'unit.month', unit: '€/mes' },
            { labelKey: 'academy.adults3dt', value: '95', unitKey: 'unit.month', unit: '€/mes' },
          ],
        },
        {
          titleKey: 'academy.pricingJuniorTitle',
          rows: [
            { labelKey: 'academy.junior1dt', value: '50', unitKey: 'unit.month', unit: '€/mes' },
            { labelKey: 'academy.junior2dt', value: '80', unitKey: 'unit.month', unit: '€/mes' },
            { labelKey: 'academy.junior3dt', value: '60', unitKey: 'unit.month', unit: '€/mes' },
            { labelKey: 'academy.junior4dt', value: '90', unitKey: 'unit.month', unit: '€/mes' },
          ],
        },
        {
          titleKey: 'academy.pricingPrivateTitle',
          rows: [
            { labelKey: 'academy.private1dt', value: '40', unit: '€' },          /* símbolo: igual en ES/EN/NL */
            { labelKey: 'academy.private2dt', value: '25', unitKey: 'unit.pp', unit: '€/pp' },
            { labelKey: 'academy.private3dt', value: '20', unitKey: 'unit.pp', unit: '€/pp' },
          ],
        },
      ],
    },

    /* ── EVENTO DESTACADO (opcional por club) ─────────────────
       null = la sede no tiene ningún evento vigente que anunciar.
       Sólo se rellena con un evento FUTURO y confirmado (nunca pasado),
       porque de él dependen banner, CTA y datos estructurados.         */
    torneo: null,

    /* ── GALERÍA (índice = .gi-N en el HTML) ───────────────────
       Fotos ILUSTRATIVAS de banco (ver assets/credits.json), no del club:
       la galería lo dice en su subtítulo. Descripciones (gallery.imgN) en
       el bloque i18n: describen lo que se ve, sin atribuirlo al club.
       Se retiraron gallery-04 (pista cubierta: contradecía «4 pistas
       outdoor»), gallery-09 (casi idéntica a la 02) y gallery-12/13
       (marca de terceros en primer plano).                              */
    gallery: [
      '../assets/img/gallery-01.jpg',
      '../assets/img/gallery-02.jpg',
      '../assets/img/gallery-03.jpg',
      '../assets/img/gallery-05.jpg',
      '../assets/img/gallery-06.jpg',
      '../assets/img/gallery-07.jpg',
      '../assets/img/gallery-08.jpg',
      '../assets/img/gallery-10.jpg',
      '../assets/img/gallery-11.jpg',
      '../assets/img/gallery-14.jpg',
      '../assets/img/gallery-15.jpg',
      '../assets/img/gallery-16.jpg',
    ],

    /* ── I18N PROPIA DE ESTA SEDE ─────────────────────────────
       Cadenas que NO deben vivir en js/translations.js porque son de
       Pizarra (ciudad, horario real, claim, bio de su monitora, sus
       categorías de pool, sus patrocinadores). El motor las busca aquí
       primero; si falta la clave, cae al valor neutro del archivo global.
       Claves planas → se expanden abajo también a objetos anidados.     */
    i18n: expand({

      es: {
        'meta.title':           'Eleva Padel Club · Pizarra, Málaga',
        'hero.kicker':          'PADEL CLUB\u00a0· 4 PISTAS OUTDOOR\u00a0· PIZARRA\u00a0· MÁLAGA',
        'marquee.courts':       '4 Pistas Outdoor',
        'marquee.location':     'Pizarra, Málaga',
        'marquee.tag':          'High Performance & Social Club',
        'club.aside':           'EST · 2026 · PIZARRA · MÁLAGA',
        'club.courtsDesc':      '4 outdoor panorámicas con iluminación LED',
        'club.scheduleValue':   'L–D · 9:00–00:00',
        'club.tournamentsDesc': 'Pools por categoría: SNP · 3ª · 4ª · 5ª · Mixta · Rocha<br>Horarios variables — plazas por WhatsApp',
        'services.desc1':       '4 pistas outdoor de cristal panorámico con iluminación LED. Reserva online en Vola o por teléfono.',
        'services.desc3':       'Pools por categoría: SNP, 3ª, 4ª, 5ª, Mixta y Rocha. 8€ por jugador, buen rollo garantizado. Los horarios varían: consulta el próximo por WhatsApp.',
        'pools.include':        '8€ por jugador · Bolas nuevas · 1h30 · Horario a consultar por WhatsApp',
        'pools.prize':          'Camiseta BullPadel',
        'gallery.subtitle':     'Imágenes ilustrativas · Pizarra, Málaga',
        'gallery.img1':         'Palas y bolas sobre una pista azul',
        'gallery.img2':         'Palas de pádel rodeadas de bolas',
        'gallery.img3':         'Jugador golpeando de revés',
        'gallery.img4':         'Jugador en posición de espera',
        'gallery.img5':         'Jugadora devolviendo una bola baja',
        'gallery.img6':         'Pareja preparada para jugar',
        'gallery.img7':         'Dos palas sobre la pista',
        'gallery.img8':         'Pala y bola junto a la red',
        'gallery.img9':         'Saludo antes del partido',
        'gallery.img10':        'Jugador preparando la volea',
        'gallery.img11':        'Bola sobre una pala, en blanco y negro',
        'gallery.img12':        'Jugadora en pleno golpe',
        'footer.claim':         'Pádel elevado a otro nivel · Pizarra, Málaga.',
        'team.role1':           'Monitora · Jugadora Profesional',
        'team.bio1':            'Jugadora de pádel profesional e imagen del club. Referente técnico de la academia de Eleva Padel Club.',
        'team.role2':           'Coordinadora de Pádel',
        'team.bio2':            'Coordinadora de todo lo relacionado con el pádel en el club. Alma organizativa de la competición y la academia.',
        'sponsors.sub':         'Estas empresas apostaron por el proyecto cuando era solo una idea. Son los cimientos reales del club, y cuatro de ellas dan nombre a nuestras pistas.'
      },

      en: {
        'meta.title':           'Eleva Padel Club · Pizarra, Málaga',
        'hero.kicker':          'PADEL CLUB\u00a0· 4 OUTDOOR COURTS\u00a0· PIZARRA\u00a0· MÁLAGA',
        'marquee.courts':       '4 Outdoor Courts',
        'marquee.location':     'Pizarra, Málaga',
        'marquee.tag':          'High Performance & Social Club',
        'club.aside':           'EST · 2026 · PIZARRA · MÁLAGA',
        'club.courtsDesc':      '4 panoramic outdoor courts with LED lighting',
        'club.scheduleValue':   'Mon–Sun · 9 am–midnight',
        'club.tournamentsDesc': 'Pools by category: SNP · 3rd · 4th · 5th · Mixed · Rocha<br>Variable schedule — spots via WhatsApp',
        'services.desc1':       '4 panoramic glass outdoor courts with LED lighting. Book online on Vola or by phone.',
        'services.desc3':       'Pools by category: SNP, 3rd, 4th, 5th, Mixed and Rocha. €8 per player, great atmosphere guaranteed. Schedules vary: ask about the next one on WhatsApp.',
        'pools.include':        '€8 per player · New balls · 90 min · Schedule to be confirmed via WhatsApp',
        'pools.prize':          'BullPadel shirt',
        'gallery.subtitle':     'Illustrative images · Pizarra, Málaga',
        'gallery.img1':         'Rackets and balls on a blue court',
        'gallery.img2':         'Padel rackets surrounded by balls',
        'gallery.img3':         'Player hitting a backhand',
        'gallery.img4':         'Player in the ready position',
        'gallery.img5':         'Player returning a low ball',
        'gallery.img6':         'A pair getting ready to play',
        'gallery.img7':         'Two rackets on the court',
        'gallery.img8':         'Racket and ball by the net',
        'gallery.img9':         'Handshake before the match',
        'gallery.img10':        'Player preparing a volley',
        'gallery.img11':        'Ball on a racket, in black and white',
        'gallery.img12':        'Player mid-shot',
        'footer.claim':         'Padel taken to the next level · Pizarra, Málaga.',
        'team.role1':           'Coach · Professional Player',
        'team.bio1':            'Professional padel player and the face of the club. Technical lead of the Eleva Padel Club academy.',
        'team.role2':           'Padel Coordinator',
        'team.bio2':            'Coordinates everything padel-related at the club. The organisational soul of the competition and the academy.',
        'sponsors.sub':         'These companies backed the project when it was just an idea. They are the real foundations of the club, and four of them give their names to our courts.'
      },

      nl: {
        'meta.title':           'Eleva Padel Club · Pizarra, Málaga',
        'hero.kicker':          'PADEL CLUB\u00a0· 4 BUITENBANEN\u00a0· PIZARRA\u00a0· MÁLAGA',
        'marquee.courts':       '4 Buitenbanen',
        'marquee.location':     'Pizarra, Málaga',
        'marquee.tag':          'High Performance & Social Club',
        'club.aside':           'OPGERICHT · 2026 · PIZARRA · MÁLAGA',
        'club.courtsDesc':      '4 panoramische buitenbanen met LED-verlichting',
        'club.scheduleValue':   'Ma–Zo · 9.00–24.00 uur',
        'club.tournamentsDesc': 'Pools per categorie: SNP · 3e · 4e · 5e · Gemengd · Rocha<br>Wisselende tijden — plaatsen via WhatsApp',
        'services.desc1':       '4 panoramische glazen buitenbanen met LED-verlichting. Reserveer online via Vola of telefonisch.',
        'services.desc3':       'Pools per categorie: SNP, 3e, 4e, 5e, Gemengd en Rocha. € 8 per speler, een goede sfeer gegarandeerd. De tijden wisselen: vraag de volgende op via WhatsApp.',
        'pools.include':        '€ 8 per speler · Nieuwe ballen · 90 min · Tijden op aanvraag via WhatsApp',
        'pools.prize':          'BullPadel-shirt',
        'gallery.subtitle':     'Illustratieve beelden · Pizarra, Málaga',
        'gallery.img1':         'Rackets en ballen op een blauwe baan',
        'gallery.img2':         'Padelrackets omringd door ballen',
        'gallery.img3':         'Speler slaat een backhand',
        'gallery.img4':         'Speler in wachthouding',
        'gallery.img5':         'Speelster retourneert een lage bal',
        'gallery.img6':         'Een koppel klaar om te spelen',
        'gallery.img7':         'Twee rackets op de baan',
        'gallery.img8':         'Racket en bal bij het net',
        'gallery.img9':         'Handdruk voor de wedstrijd',
        'gallery.img10':        'Speler bereidt een volley voor',
        'gallery.img11':        'Bal op een racket, in zwart-wit',
        'gallery.img12':        'Speelster midden in een slag',
        'footer.claim':         'Padel naar een hoger niveau · Pizarra, Málaga.',
        'team.role1':           'Coach · Professionele Speelster',
        'team.bio1':            'Professionele padelspeelster en het gezicht van de club. Technisch boegbeeld van de academie van Eleva Padel Club.',
        'team.role2':           'Padelcoördinator',
        'team.bio2':            'Coördineert alles wat met padel te maken heeft in de club. De organisatorische ziel van de competitie en de academie.',
        'sponsors.sub':         'Deze bedrijven geloofden in het project toen het nog een idee was. Zij zijn het echte fundament van de club, en vier van hen geven hun naam aan onze banen.'
      }

    }),

  };

  /* Expande { 'a.b': v } a { 'a.b': v, a: { b: v } } para que el motor
     pueda leer la clave tanto plana como anidada (resolveKey con puntos). */
  function expand(byLang) {
    var out = {};
    Object.keys(byLang).forEach(function (lang) {
      var flat = byLang[lang], dict = {};
      Object.keys(flat).forEach(function (key) {
        dict[key] = flat[key];                 /* acceso plano: dict['a.b'] */
        var parts = dict, seg = key.split('.');
        for (var i = 0; i < seg.length - 1; i++) {
          if (typeof parts[seg[i]] !== 'object' || parts[seg[i]] === null) parts[seg[i]] = {};
          parts = parts[seg[i]];
        }
        parts[seg[seg.length - 1]] = flat[key];  /* acceso anidado: dict.a.b */
      });
      out[lang] = dict;
    });
    return out;
  }
})();
