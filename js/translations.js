/* =========================================================
   ELEVA PADEL CLUB — Traducciones / Translations / Vertalingen
   Idiomas / Languages: ES · EN · NL
   ========================================================= */
(function () {
  'use strict';

  window.__ELEVA_I18N__ = {

    /* ──────────────────────────────────────────────────────
       ESPAÑOL
    ────────────────────────────────────────────────────── */
    es: {
      skip:    { link: 'Saltar al contenido principal' },
      nav: {
        club: 'El Club', services: 'Servicios', academy: 'Academia',
        team: 'Equipo', pools: 'Pools', gallery: 'Galería',
        contact: 'Contacto', book: 'Reservar', bookCourt: 'Reservar pista', network: 'Volver a Eleva',
        ariaLabel: 'Navegación principal', overlayLabel: 'Menú de navegación',
        menuOpen: 'Abrir menú', menuClose: 'Cerrar menú', langLabel: 'Idioma',
        logoLabel: 'Eleva Padel Club — inicio'
      },
      hero: {
        /* club-agnóstica: Pizarra la sobrescribe en pizarra/manifest.js (i18n) */
        kicker: 'CLUB DE PÁDEL · PISTAS OUTDOOR',
        tagline: 'Pádel elevado a otro nivel.',
        ctaPrimary: 'Reservar pista', ctaSecondary: 'Descubrir el club',
        scroll: 'Scroll'
      },
      marquee: {
        courts: '4 Pistas Outdoor', academy: 'Academia & Clases',
        pools: 'Pools y Torneos', chill: 'Zona Chill-Out',
        /* location/tag: valores por sede en el manifest del club */
        location: 'Eleva Pádel', tag: 'High Performance & Social Club'
      },
      club: {
        label: 'El Club', aside: 'ELEVA · PADEL CLUB',
        headingHtml: 'Un club con más futuro<br>que presente.',
        courts: 'Pistas', courtsDesc: '4 outdoor panorámicas con iluminación LED',
        schedule: 'Horario', scheduleValue: 'Consultar horario', bookings: 'Reservas',
        community: 'Comunidad', communityLink: 'Grupo WhatsApp activo',
        tournaments: 'Torneos',
        tournamentsDesc: 'Pools y torneos por categoría<br>Horarios variables — plazas por WhatsApp'
      },
      services: {
        srHeading: 'Servicios de Eleva Padel Club',
        cat1: 'Instalaciones', title1: 'Pistas', sub1: 'Juega. A cualquier hora.',
        desc1: '4 pistas outdoor de cristal panorámico con iluminación LED de última generación. Reserva online en Vola o por teléfono.',
        rate1dt: '1h antes de 17h', rate2dt: '1h30 antes de 17h',
        rate3dt: '1h desde 17h',    rate4dt: '1h30 desde 17h',
        cta1: 'Reservar pista',
        cat2: 'Formación', title2: 'Academia', sub2: 'Sube de nivel de verdad.',
        desc2: 'Grupos de 2 a 4 personas y 1h de técnica real. Clases para todos los niveles, desde iniciación hasta competición.',
        cta2: 'Consultar plazas',
        cat3: 'Competición', title3: 'Pools', sub3: 'Compite toda la semana.',
        desc3: 'Pools por categoría, con precio fijo y buen rollo garantizado. Los horarios varían: consulta el próximo por WhatsApp.',
        cta3: 'Unirse al grupo',
        cat4: 'Ambiente', title4: 'Chill-Out', sub4: 'El partido acaba, la tarde no.',
        desc4: 'Zona de descanso con barra de refrigerios y bebidas frías después del partido. Donde se fraguan los próximos equipos y las mejores conversaciones.',
        cta4: 'Cómo llegar'
      },
      academy: {
        label: 'Academia',
        headingHtml: 'Entrena en serio.<br><em>Mejora de verdad.</em>',
        level1: 'Iniciación', card1Title: 'Empieza bien desde cero.',
        card1Desc: 'Aprende la técnica correcta desde el primer golpe. Sin vicios, con base.',
        inc1a: 'Fundamentos de técnica', inc1b: 'Movimiento y posicionamiento', inc1c: 'Reglas y puntuación',
        level2: 'Intermedio', card2Title: 'Consolida la técnica y la táctica.',
        card2Desc: 'Ya golpeas bien. Ahora aprende a pensar el partido y a jugar en pareja.',
        inc2a: 'Técnica avanzada', inc2b: 'Táctica de pareja', inc2c: 'Situaciones reales de juego',
        level3: 'Avanzado / Competición', card3Title: 'Sube de categoría.',
        card3Desc: 'Para los que ya juegan y quieren resultados. Análisis, estrategia, competición.',
        inc3a: 'Análisis de juego', inc3b: 'Preparación para torneos', inc3c: 'Estrategia de partido',
        ratesLabel: 'Tarifas de Academia',
        pricingAdultsTitle: 'Escuela Adultos',
        pricingJuniorTitle: 'Escuela Junior',
        pricingPrivateTitle: 'Clases Particulares',
        adults1dt: 'Grupo 4 personas · 1 día/sem', adults2dt: 'Grupo 3 personas · 1 día/sem', adults3dt: 'Grupo 2 personas · 1 día/sem',
        junior1dt: '5–9 años · 1 día/sem', junior2dt: '5–9 años · 2 días/sem',
        junior3dt: '+10 años · 1 día/sem',  junior4dt: '+10 años · 2 días/sem',
        private1dt: 'Individual', private2dt: '2 personas', private3dt: '3 personas',
        ctaNoteHtml: 'Grupos organizados por nivel y disponibilidad.<br><strong>Plazas limitadas</strong> · Todos los niveles',
        ctaBtn: 'Consultar plazas'
      },
      team: {
        label: 'El Equipo',
        headingHtml: 'Las personas<br><em>detrás del club.</em>',
        /* role1/bio1: por sede en el manifest del club (aquí, valor neutro) */
        role1: 'Monitora',
        bio1: 'Monitora del club y referente técnico de la academia.',
        role2: 'Coordinadora de Pádel',
        bio2: 'Coordinadora de todo lo relacionado con el pádel en el club. Alma organizativa de la competición y la academia.'
      },
      pools: {
        label: 'Pools & Torneos',
        headingHtml: 'Compite<br>toda la semana.',
        perksLabel: 'Todos los pools incluyen',
        include: '8€ por jugador · Bolas nuevas · 1h30 · Horario a consultar por WhatsApp',
        prizeLabel: 'Premio ganadores',
        prize: 'Camiseta BullPadel con el logo del club',
        quote: '«Hay lugares con más futuro que presente.»',
        cta:   'Consultar horario del próximo pool',
        join:  'Consultar horario',
        swipe: 'Desliza · {n} insignias'
      },
      sponsors: {
        label: 'Patrocinadores',
        ariaLabel: 'Patrocinadores principales',
        headlineHtml: 'Sin ellos,<br><em>no hay pistas.</em>',
        sub: 'Las empresas que hacen posible el club. Sin ellas, no hay pistas.',
        badge: 'Patrocinador Principal',
        soon: 'Próximamente',
        soonBadge: '¿Tu empresa aquí?',
        collab: 'Colaborador',
      },
      gallery: {
        heading: 'El club.', subtitle: 'Nuestras instalaciones',
        ariaLabel: 'Galería de imágenes del club',
        img1: 'Pistas al atardecer', img2: 'Detalle de cristal y malla',
        img3: 'Pelota en acción', img4: 'Pala de pádel',
        img5: 'Zona chill-out', img6: 'Iluminación LED nocturna',
        img7: 'Jugadores en partido', img8: 'Logo del club',
        img9: 'Vista de pistas', img10: 'Entrada al club', img11: 'Red central',
        img12: 'Jugadoras en partido', img13: 'Pala Bullpadel',
        img14: 'Pista con reflejos LED', img15: 'Grupo de jugadores',
        img16: 'Atardecer sobre las pistas'
      },
      contact: {
        headingHtml: 'Reserva<br><em>tu pista.</em>',
        ctaPrimary: 'Reservar pista',
        ctaWA: 'Únete a la comunidad WhatsApp',
        ctaEvent: 'Reservar el club para evento privado',
        formTitle: 'Info sobre la academia',
        labelName: 'Nombre', labelPhone: 'Teléfono',
        labelLevel: 'Nivel', labelMessage: 'Mensaje', optional: '(opcional)',
        phName: 'Tu nombre', phPhone: '600 000 000',
        phLevel: 'Selecciona tu nivel', phMessage: '¿Algo que quieras añadir?',
        levelBeginner: 'Iniciación', levelIntermediate: 'Intermedio',
        levelAdvanced: 'Avanzado', levelCompetition: 'Competición',
        submitBtn: 'Enviar por WhatsApp',
        formNote: 'Te redirige a WhatsApp con los datos ya rellenados. Te contestamos lo antes posible.',
        infoPhone: 'Teléfono', infoInstagram: 'Instagram',
        infoAddress: 'Dirección', infoSchedule: 'Horario'
      },
      footer: {
        claim: 'Pádel elevado a otro nivel.',
        mapTitle: 'Cómo llegar', mapLink: 'Ver en Google Maps',
        contactTitle: 'Contacto',
        phoneLabel: 'Teléfono / WhatsApp',
        reservasLabel: 'Reservas', reservasLink: 'App Vola Plus',
        communityLabel: 'Comunidad', communityLink: 'Grupo WhatsApp',
        navTitle: 'El Club',
        navClub: 'El Club', navServices: 'Servicios', navAcademy: 'Academia',
        navPools: 'Pools & Torneos', navGallery: 'Galería',
        navContact: 'Contacto', navBook: 'Reservar pista',
        designCredit: 'Diseño web por',
        legalLink: 'Aviso Legal &amp; Privacidad',
        ariaLabel: 'Pie de página'
      },
      fab: { tooltip: 'Reservar pista', ariaLabel: 'Reservar pista en Eleva Padel Club' },
      /* ── LANDING B2B (raíz /) ── */
      home: {
        waB2B: 'Hola, tengo un club/academia de pádel y me gustaría saber más sobre unirme a Eleva Pádel.',
        nav: {
          logoLabel: 'Eleva Pádel — inicio',
          manifesto: 'Manifiesto', about: 'Qué es', join: 'Unirse',
          benefits: 'Beneficios', network: 'La Red', contact: 'Contacto',
          cta: 'Únete'
        },
        hero: {
          kicker: 'MARCA DE CLUBES DE PÁDEL · NACE EN PIZARRA',
          index: 'La Red',
          rot1: 'tu club.', rot2: 'tu marca.', rot3: 'tu comunidad.', rot4: 'tu pádel.',
          titleSr: 'Eleva tu club, tu marca, tu comunidad y tu pádel.',
          anchorCity: 'Pizarra · Málaga',
          anchorStatus: 'Sede activa',
          tagline: 'Una marca. Una experiencia. Todas tus pistas, elevadas.',
          ctaPrimary: 'Lleva Eleva a tu club',
          ctaSecondary: 'Ver una sede'
        },
        marquee: {
          brand: 'Marca premium', multilang: 'Web multiidioma ES · EN · NL',
          booking: 'Reservas online', tournaments: 'Torneos & Pools',
          community: 'Comunidad', expansion: 'Red en construcción'
        },
        manifesto: {
          label: 'Manifiesto',
          headingHtml: 'El pádel no necesita más pistas.<br>Necesita más <em>criterio</em>.',
          text: 'Creemos en clubes con alma: bien diseñados, bien contados, bien gestionados. Eleva es la marca que convierte tu club en un destino —y a tus jugadores, en comunidad.'
        },
        value: {
          label: 'Qué es Eleva',
          headingHtml: 'Una red,<br>no una franquicia rígida.',
          p1: 'Eleva es una marca de pádel que empieza en Pizarra. Aportamos identidad, tecnología y una web propia multiidioma; tú mantienes tu club, tu equipo y tu esencia.',
          p2: 'Juntos elevamos el estándar: la experiencia que vive el jugador, la imagen que proyecta tu club y la comunidad que lo sostiene.',
          stat1: 'Sede activa', stat2: 'Idiomas de serie', stat3: 'Año de fundación'
        },
        steps: {
          label: 'Cómo unir tu club',
          headingHtml: 'De tu club a la red<br><em>en cuatro pasos.</em>',
          s1Title: 'Hablamos',   s1Desc: 'Nos cuentas cómo es tu club y qué buscas. Sin compromiso.',
          s2Title: 'Diseñamos',  s2Desc: 'Adaptamos la identidad Eleva a tu sede: web, marca y presencia digital.',
          s3Title: 'Lanzamos',   s3Desc: 'Publicamos tu club en la red con reservas, comunidad y multiidioma.',
          s4Title: 'Crecemos',   s4Desc: 'Torneos, captación y una marca que trabaja para ti cada día.'
        },
        benefits: {
          label: 'Beneficios de la red',
          headingHtml: 'Todo lo que un club necesita<br>para <em>destacar</em>.',
          b1Title: 'Identidad cuidada',       b1Desc: 'Una identidad coherente en web, redes y pista que diferencia tu club desde el primer vistazo.',
          b2Title: 'Web propia multiidioma',  b2Desc: 'Tu sede con página propia en ES · EN · NL, lista para captar a cualquier jugador.',
          b3Title: 'Captación y comunidad',   b3Desc: 'Te acompañamos para dar a conocer tu club y convertir jugadores sueltos en comunidad.',
          b4Title: 'Tecnología y reservas',   b4Desc: 'Enlazamos tu plataforma de reservas online y cuidamos la experiencia digital de principio a fin.',
          b5Title: 'Torneos y eventos',       b5Desc: 'Formatos de torneo y pools listos para activar, con el respaldo y la comunicación de la marca.'
        },
        network: {
          label: 'La Red', heading: 'Donde ya se juega distinto.',
          sub: 'Empezamos en Pizarra. Tu club puede ser el próximo.',
          statusLive: 'Primera sede', statusSoon: 'Próximamente',
          visit: 'Ver sede',
          ctaTitle: 'Tu club aquí', ctaLink: 'Hablar con nosotros'
        },
        cta: {
          label: 'Contacto',
          headingHtml: '¿Listo para elevar<br><em>tu club?</em>',
          text: 'Cuéntanos tu proyecto. Te contestamos por WhatsApp lo antes posible.',
          ctaPrimary: 'Hablar por WhatsApp', ctaSecondary: 'Ver una sede'
        },
        footer: {
          claim: 'Elevando el pádel, un club cada vez.',
          sedeLabel: 'Primera sede', navTitle: 'Explorar'
        },
        fab: { tooltip: 'Unir mi club', ariaLabel: 'Unir mi club a Eleva Pádel' }
      },
      wa: {
        academia: 'Hola, me interesa consultar plazas de la academia de Eleva Padel Club.',
        prueba:   'Hola, me gustaría información sobre las clases de la academia de Eleva Padel Club: grupos, niveles y horarios.',
        pool:     '¡Hola! ¿Me podéis decir el horario del próximo pool de Eleva Padel Club y si quedan plazas? 🎾',
        contact:  'Hola, me interesa información sobre la academia de Eleva Padel Club.',
        event:    'Hola, me gustaría información para reservar Eleva Padel Club para un evento privado.',
      },
      /* Unidades y etiquetas que inyecta el render desde el manifest */
      unit:   { month: '€/mes', pp: '€/pp' },
      label:  { court: 'Pista' },
      /* Etiquetas del cursor personalizado (data-cursor) */
      cursor: {
        book: 'reservar', view: 'ver', signup: 'consultar', soon: 'próximamente',
        call: 'llamar', look: 'mirar', send: 'enviar', read: 'leer', join: 'unirse', back: 'volver'
      }
    },

    /* ──────────────────────────────────────────────────────
       ENGLISH
    ────────────────────────────────────────────────────── */
    en: {
      skip:    { link: 'Skip to main content' },
      nav: {
        club: 'The Club', services: 'Services', academy: 'Academy',
        team: 'Team', pools: 'Pools', gallery: 'Gallery',
        contact: 'Contact', book: 'Book', bookCourt: 'Book a court', network: 'Back to Eleva',
        ariaLabel: 'Main navigation', overlayLabel: 'Navigation menu',
        menuOpen: 'Open menu', menuClose: 'Close menu', langLabel: 'Language',
        logoLabel: 'Eleva Padel Club — home'
      },
      hero: {
        /* club-agnostic: Pizarra overrides it in pizarra/manifest.js (i18n) */
        kicker: 'PADEL CLUB · OUTDOOR COURTS',
        tagline: 'Padel elevated to another level.',
        ctaPrimary: 'Book a court', ctaSecondary: 'Discover the club',
        scroll: 'Scroll'
      },
      marquee: {
        courts: '4 Outdoor Courts', academy: 'Academy & Classes',
        pools: 'Pools & Tournaments', chill: 'Chill-Out Zone',
        /* location/tag: per-venue values in the club manifest */
        location: 'Eleva Pádel', tag: 'High Performance & Social Club'
      },
      club: {
        label: 'The Club', aside: 'ELEVA · PADEL CLUB',
        headingHtml: 'A club with more future<br>than present.',
        courts: 'Courts', courtsDesc: '4 panoramic outdoor courts with LED lighting',
        schedule: 'Hours', scheduleValue: 'Check opening hours', bookings: 'Bookings',
        community: 'Community', communityLink: 'Active WhatsApp group',
        tournaments: 'Tournaments',
        tournamentsDesc: 'Pools and tournaments by category<br>Variable schedule — spots via WhatsApp'
      },
      services: {
        srHeading: 'Services at Eleva Padel Club',
        cat1: 'Facilities', title1: 'Courts', sub1: 'Play. Any time.',
        desc1: '4 panoramic glass outdoor courts with state-of-the-art LED lighting. Book online on Vola or by phone.',
        rate1dt: '1h before 5 PM', rate2dt: '1h30 before 5 PM',
        rate3dt: '1h from 5 PM',   rate4dt: '1h30 from 5 PM',
        cta1: 'Book a court',
        cat2: 'Training', title2: 'Academy', sub2: 'Level up for real.',
        desc2: 'Groups of 2 to 4 people and 1h of real technique. Classes for all levels, from beginner to competition.',
        cta2: 'Check availability',
        cat3: 'Competition', title3: 'Pools', sub3: 'Compete all week long.',
        desc3: 'Pools by category, with a fixed price and a great atmosphere guaranteed. Schedules vary: ask about the next one on WhatsApp.',
        cta3: 'Join the group',
        cat4: 'Atmosphere', title4: 'Chill-Out', sub4: 'The match ends, the evening doesn\'t.',
        desc4: 'Rest area with refreshments and cold drinks after the match. Where the next teams are formed and the best conversations happen.',
        cta4: 'How to get here'
      },
      academy: {
        label: 'Academy',
        headingHtml: 'Train seriously.<br><em>Improve for real.</em>',
        level1: 'Beginner', card1Title: 'Start right from scratch.',
        card1Desc: 'Learn the correct technique from the very first stroke. No bad habits, solid foundations.',
        inc1a: 'Technical fundamentals', inc1b: 'Movement and positioning', inc1c: 'Rules and scoring',
        level2: 'Intermediate', card2Title: 'Consolidate your technique and tactics.',
        card2Desc: 'You already hit well. Now learn to read the game and play as a pair.',
        inc2a: 'Advanced technique', inc2b: 'Pair tactics', inc2c: 'Real game situations',
        level3: 'Advanced / Competition', card3Title: 'Move up a category.',
        card3Desc: 'For those who already play and want results. Analysis, strategy, competition.',
        inc3a: 'Game analysis', inc3b: 'Tournament preparation', inc3c: 'Match strategy',
        ratesLabel: 'Academy Rates',
        pricingAdultsTitle: 'Adult Academy',
        pricingJuniorTitle: 'Junior Academy',
        pricingPrivateTitle: 'Private Lessons',
        adults1dt: 'Group of 4 · 1 day/week', adults2dt: 'Group of 3 · 1 day/week', adults3dt: 'Group of 2 · 1 day/week',
        junior1dt: 'Ages 5–9 · 1 day/week', junior2dt: 'Ages 5–9 · 2 days/week',
        junior3dt: 'Ages 10+ · 1 day/week',  junior4dt: 'Ages 10+ · 2 days/week',
        private1dt: 'Individual', private2dt: '2 people', private3dt: '3 people',
        ctaNoteHtml: 'Groups organised by level and availability.<br><strong>Limited spots</strong> · All levels',
        ctaBtn: 'Check availability'
      },
      team: {
        label: 'The Team',
        headingHtml: 'The people<br><em>behind the club.</em>',
        /* role1/bio1: per venue in the club manifest (neutral default here) */
        role1: 'Coach',
        bio1: 'Club coach and technical reference of the academy.',
        role2: 'Padel Coordinator',
        bio2: 'Coordinator of everything padel-related at the club. The organisational soul of the competition and academy.'
      },
      pools: {
        label: 'Pools & Tournaments',
        headingHtml: 'Compete<br>all week long.',
        perksLabel: 'All pools include',
        include: '€8 per player · New balls · 1h30 · Schedule to be confirmed via WhatsApp',
        prizeLabel: 'Winners’ prize',
        prize: 'BullPadel shirt with the club logo',
        quote: '«There are places with more future than present.»',
        cta:   'Ask about the next pool',
        join:  'Check the schedule',
        swipe: 'Swipe · {n} badges'
      },
      sponsors: {
        label: 'Sponsors',
        ariaLabel: 'Main sponsors',
        headlineHtml: 'Without them,<br><em>no courts.</em>',
        sub: 'The companies that make the club possible. Without them, there are no courts.',
        badge: 'Main Sponsor',
        soon: 'Coming Soon',
        soonBadge: 'Your company here?',
        collab: 'Partner',
      },
      gallery: {
        heading: 'The club.', subtitle: 'Our facilities',
        ariaLabel: 'Club photo gallery',
        img1: 'Courts at sunset', img2: 'Glass and mesh detail',
        img3: 'Ball in action', img4: 'Padel racket',
        img5: 'Chill-out area', img6: 'Night LED lighting',
        img7: 'Players in a match', img8: 'Club logo',
        img9: 'Court overview', img10: 'Club entrance', img11: 'Centre net',
        img12: 'Female players in a match', img13: 'Bullpadel racket',
        img14: 'Court with LED reflections', img15: 'Group of players',
        img16: 'Sunset over the courts'
      },
      contact: {
        headingHtml: 'Book<br><em>your court.</em>',
        ctaPrimary: 'Book a court',
        ctaWA: 'Join the WhatsApp community',
        ctaEvent: 'Book the club for a private event',
        formTitle: 'Academy information',
        labelName: 'Name', labelPhone: 'Phone',
        labelLevel: 'Level', labelMessage: 'Message', optional: '(optional)',
        phName: 'Your name', phPhone: '600 000 000',
        phLevel: 'Select your level', phMessage: 'Anything you\'d like to add?',
        levelBeginner: 'Beginner', levelIntermediate: 'Intermediate',
        levelAdvanced: 'Advanced', levelCompetition: 'Competition',
        submitBtn: 'Send via WhatsApp',
        formNote: 'Redirects you to WhatsApp with your details pre-filled. We reply as soon as we can.',
        infoPhone: 'Phone', infoInstagram: 'Instagram',
        infoAddress: 'Address', infoSchedule: 'Hours'
      },
      footer: {
        claim: 'Padel elevated to another level.',
        mapTitle: 'How to get here', mapLink: 'View on Google Maps',
        contactTitle: 'Contact',
        phoneLabel: 'Phone / WhatsApp',
        reservasLabel: 'Bookings', reservasLink: 'Vola Plus App',
        communityLabel: 'Community', communityLink: 'WhatsApp Group',
        navTitle: 'The Club',
        navClub: 'The Club', navServices: 'Services', navAcademy: 'Academy',
        navPools: 'Pools & Tournaments', navGallery: 'Gallery',
        navContact: 'Contact', navBook: 'Book a court',
        designCredit: 'Web design by',
        legalLink: 'Legal Notice &amp; Privacy',
        ariaLabel: 'Page footer'
      },
      fab: { tooltip: 'Book a court', ariaLabel: 'Book a court at Eleva Padel Club' },
      /* ── LANDING B2B (root /) ── */
      home: {
        waB2B: 'Hi, I run a padel club/academy and I would like to know more about joining Eleva Pádel.',
        nav: {
          logoLabel: 'Eleva Pádel — home',
          manifesto: 'Manifesto', about: 'What it is', join: 'Join',
          benefits: 'Benefits', network: 'The Network', contact: 'Contact',
          cta: 'Join us'
        },
        hero: {
          kicker: 'A PADEL CLUB BRAND · BORN IN PIZARRA',
          index: 'The Network',
          rot1: 'your club.', rot2: 'your brand.', rot3: 'your community.', rot4: 'your padel.',
          titleSr: 'Eleva your club, your brand, your community and your padel.',
          anchorCity: 'Pizarra · Málaga',
          anchorStatus: 'Active location',
          tagline: 'One brand. One experience. All your courts, elevated.',
          ctaPrimary: 'Bring Eleva to your club',
          ctaSecondary: 'See a location'
        },
        marquee: {
          brand: 'Premium brand', multilang: 'Multilingual site ES · EN · NL',
          booking: 'Online booking', tournaments: 'Tournaments & Pools',
          community: 'Community', expansion: 'A network in the making'
        },
        manifesto: {
          label: 'Manifesto',
          headingHtml: 'Padel doesn’t need more courts.<br>It needs more <em>vision</em>.',
          text: 'We believe in clubs with soul: well designed, well told, well run. Eleva is the brand that turns your club into a destination —and your players into a community.'
        },
        value: {
          label: 'What Eleva is',
          headingHtml: 'A network,<br>not a rigid franchise.',
          p1: 'Eleva is a padel brand starting out in Pizarra. We bring identity, technology and a dedicated multilingual website; you keep your club, your team and your essence.',
          p2: 'Together we raise the standard: the experience your players live, the image your club projects and the community that sustains it.',
          stat1: 'Active location', stat2: 'Languages built in', stat3: 'Founded'
        },
        steps: {
          label: 'How to join',
          headingHtml: 'From your club to the network<br><em>in four steps.</em>',
          s1Title: 'We talk',    s1Desc: 'Tell us about your club and what you’re looking for. No commitment.',
          s2Title: 'We design',  s2Desc: 'We adapt the Eleva identity to your venue: website, brand and digital presence.',
          s3Title: 'We launch',  s3Desc: 'We publish your club in the network with booking, community and multilingual support.',
          s4Title: 'We grow',    s4Desc: 'Tournaments, player acquisition and a brand that works for you every day.'
        },
        benefits: {
          label: 'Network benefits',
          headingHtml: 'Everything a club needs<br>to <em>stand out</em>.',
          b1Title: 'A considered identity', b1Desc: 'One coherent identity across web, social and court that sets your club apart at first glance.',
          b2Title: 'Your own multilingual site', b2Desc: 'Your venue with its own page in ES · EN · NL, ready to reach any player.',
          b3Title: 'Reach & community',      b3Desc: 'We help you get your club known and turn one-off players into a community.',
          b4Title: 'Technology & booking',   b4Desc: 'We link your online booking platform and look after the digital experience end to end.',
          b5Title: 'Tournaments & events',   b5Desc: 'Tournament and pool formats ready to activate, backed by the brand’s support and comms.'
        },
        network: {
          label: 'The Network', heading: 'Where the game already feels different.',
          sub: 'We started in Pizarra. Your club could be next.',
          statusLive: 'First location', statusSoon: 'Coming soon',
          visit: 'View location',
          ctaTitle: 'Your club here', ctaLink: 'Talk to us'
        },
        cta: {
          label: 'Contact',
          headingHtml: 'Ready to elevate<br><em>your club?</em>',
          text: 'Tell us about your project. We reply on WhatsApp as soon as we can.',
          ctaPrimary: 'Chat on WhatsApp', ctaSecondary: 'See a location'
        },
        footer: {
          claim: 'Elevating padel, one club at a time.',
          sedeLabel: 'First location', navTitle: 'Explore'
        },
        fab: { tooltip: 'Add my club', ariaLabel: 'Add my club to Eleva Pádel' }
      },
      wa: {
        academia: 'Hello, I\'m interested in checking availability at Eleva Padel Club Academy.',
        prueba:   'Hello, I\'d like information about the Eleva Padel Club Academy classes: groups, levels and schedules.',
        pool:     'Hello! Could you tell me the schedule of the next pool at Eleva Padel Club and whether there are spots left? 🎾',
        contact:  'Hello, I\'m interested in information about Eleva Padel Club Academy.',
        event:    'Hello, I\'d like information about booking Eleva Padel Club for a private event.',
      },
      /* Units and labels injected by the render from the manifest */
      unit:   { month: '€/month', pp: '€/pp' },
      label:  { court: 'Court' },
      /* Custom cursor labels (data-cursor) */
      cursor: {
        book: 'book', view: 'view', signup: 'ask', soon: 'coming soon',
        call: 'call', look: 'look', send: 'send', read: 'read', join: 'join', back: 'back'
      }
    },

    /* ──────────────────────────────────────────────────────
       NEDERLANDS
    ────────────────────────────────────────────────────── */
    nl: {
      skip:    { link: 'Naar hoofdinhoud springen' },
      nav: {
        club: 'De Club', services: 'Diensten', academy: 'Academie',
        team: 'Team', pools: 'Pools', gallery: 'Galerij',
        contact: 'Contact', book: 'Boeken', bookCourt: 'Baan boeken', network: 'Terug naar Eleva',
        ariaLabel: 'Hoofdnavigatie', overlayLabel: 'Navigatiemenu',
        menuOpen: 'Menu openen', menuClose: 'Menu sluiten', langLabel: 'Taal',
        logoLabel: 'Eleva Padel Club — startpagina'
      },
      hero: {
        /* clubneutraal: Pizarra overschrijft dit in pizarra/manifest.js (i18n) */
        kicker: 'PADELCLUB · BUITENBANEN',
        tagline: 'Padel naar een hoger niveau.',
        ctaPrimary: 'Baan boeken', ctaSecondary: 'Ontdek de club',
        scroll: 'Scroll'
      },
      marquee: {
        courts: '4 Buitenbanen', academy: 'Academie & Lessen',
        pools: 'Pools en Toernooien', chill: 'Chill-out Zone',
        /* location/tag: waarden per locatie in het clubmanifest */
        location: 'Eleva Pádel', tag: 'High Performance & Social Club'
      },
      club: {
        label: 'De Club', aside: 'ELEVA · PADEL CLUB',
        headingHtml: 'Een club met meer toekomst<br>dan heden.',
        courts: 'Banen', courtsDesc: '4 panoramische buitenbanen met LED-verlichting',
        schedule: 'Openingstijden', scheduleValue: 'Openingstijden op aanvraag', bookings: 'Reserveringen',
        community: 'Community', communityLink: 'Actieve WhatsApp-groep',
        tournaments: 'Toernooien',
        tournamentsDesc: 'Pools en toernooien per categorie<br>Wisselende tijden — plaatsen via WhatsApp'
      },
      services: {
        srHeading: 'Diensten van Eleva Padel Club',
        cat1: 'Faciliteiten', title1: 'Banen', sub1: 'Spelen. Op elk moment.',
        desc1: '4 panoramische glazen buitenbanen met geavanceerde LED-verlichting. Reserveer online via Vola of telefonisch.',
        rate1dt: '1u voor 17u', rate2dt: '1u30 voor 17u',
        rate3dt: '1u vanaf 17u', rate4dt: '1u30 vanaf 17u',
        cta1: 'Baan boeken',
        cat2: 'Training', title2: 'Academie', sub2: 'Echt een niveau hoger.',
        desc2: 'Groepen van 2 tot 4 personen en 1u echte techniek. Lessen voor alle niveaus, van beginners tot competitie.',
        cta2: 'Beschikbaarheid checken',
        cat3: 'Competitie', title3: 'Pools', sub3: 'Speel competitie, de hele week.',
        desc3: 'Pools per categorie, met een vaste prijs en een goede sfeer gegarandeerd. De tijden wisselen: vraag de volgende op via WhatsApp.',
        cta3: 'Deelnemen aan de groep',
        cat4: 'Sfeer', title4: 'Chill-Out', sub4: 'Het spel stopt, de avond niet.',
        desc4: 'Ontspanningszone met verfrissingen en koude drankjes na het spel. Waar de volgende teams worden gevormd en de beste gesprekken plaatsvinden.',
        cta4: 'Route'
      },
      academy: {
        label: 'Academie',
        headingHtml: 'Train serieus.<br><em>Verbeter echt.</em>',
        level1: 'Beginners', card1Title: 'Begin goed vanaf nul.',
        card1Desc: 'Leer de juiste techniek vanaf de eerste slag. Geen slechte gewoonten, solide basis.',
        inc1a: 'Technische grondslagen', inc1b: 'Beweging en positionering', inc1c: 'Regels en scoring',
        level2: 'Halfgevorderd', card2Title: 'Consolideer techniek en tactiek.',
        card2Desc: 'Je slaat al goed. Leer nu het spel te lezen en samen te spelen.',
        inc2a: 'Gevorderde techniek', inc2b: 'Paartactiek', inc2c: 'Echte speelsituaties',
        level3: 'Gevorderd / Competitie', card3Title: 'Een categorie hoger.',
        card3Desc: 'Voor degenen die al spelen en resultaten willen. Analyse, strategie, competitie.',
        inc3a: 'Spelanalyse', inc3b: 'Toernooivoorbereiding', inc3c: 'Wedstrijdstrategie',
        ratesLabel: 'Tarieven Academie',
        pricingAdultsTitle: 'Volwassenen Academie',
        pricingJuniorTitle: 'Junior Academie',
        pricingPrivateTitle: 'Privélessen',
        adults1dt: 'Groep van 4 · 1 dag/week', adults2dt: 'Groep van 3 · 1 dag/week', adults3dt: 'Groep van 2 · 1 dag/week',
        junior1dt: '5–9 jaar · 1 dag/week', junior2dt: '5–9 jaar · 2 dagen/week',
        junior3dt: '10+ jaar · 1 dag/week',  junior4dt: '10+ jaar · 2 dagen/week',
        private1dt: 'Individueel', private2dt: '2 personen', private3dt: '3 personen',
        ctaNoteHtml: 'Groepen ingedeeld op niveau en beschikbaarheid.<br><strong>Beperkte plaatsen</strong> · Alle niveaus',
        ctaBtn: 'Beschikbaarheid checken'
      },
      team: {
        label: 'Het Team',
        headingHtml: 'De mensen<br><em>achter de club.</em>',
        /* role1/bio1: per locatie in het clubmanifest (hier een neutrale waarde) */
        role1: 'Coach',
        bio1: 'Clubcoach en technisch referentiepunt van de academie.',
        role2: 'Padelcoördinator',
        bio2: 'Coördinator van alles wat met padel te maken heeft bij de club. De organisatorische ziel van de competitie en academie.'
      },
      pools: {
        label: 'Pools & Toernooien',
        headingHtml: 'Speel competitie<br>de hele week.',
        perksLabel: 'Alle pools omvatten',
        include: '€8 per speler · Nieuwe ballen · 1u30 · Tijden op aanvraag via WhatsApp',
        prizeLabel: 'Prijs voor de winnaars',
        prize: 'BullPadel-shirt met het clublogo',
        quote: '«Er zijn plaatsen met meer toekomst dan heden.»',
        cta:   'Vraag de tijden van de volgende pool',
        join:  'Tijden opvragen',
        swipe: 'Veeg · {n} badges'
      },
      sponsors: {
        label: 'Sponsors',
        ariaLabel: 'Hoofdsponsors',
        headlineHtml: 'Zonder hen,<br><em>geen banen.</em>',
        sub: 'De bedrijven die de club mogelijk maken. Zonder hen geen banen.',
        badge: 'Hoofdsponsor',
        soon: 'Binnenkort',
        soonBadge: 'Jouw bedrijf hier?',
        collab: 'Partner',
      },
      gallery: {
        heading: 'De club.', subtitle: 'Onze faciliteiten',
        ariaLabel: 'Fotogalerij van de club',
        img1: 'Banen bij zonsondergang', img2: 'Detail van glas en gaas',
        img3: 'Bal in actie', img4: 'Padelracket',
        img5: 'Chill-out zone', img6: 'Nachtelijke LED-verlichting',
        img7: 'Spelers in een wedstrijd', img8: 'Clublogo',
        img9: 'Baanoverzicht', img10: 'Ingang van de club', img11: 'Middennet',
        img12: 'Speelsters in een wedstrijd', img13: 'Bullpadel racket',
        img14: 'Baan met LED-reflecties', img15: 'Groep spelers',
        img16: 'Zonsondergang over de banen'
      },
      contact: {
        headingHtml: 'Boek<br><em>jouw baan.</em>',
        ctaPrimary: 'Baan boeken',
        ctaWA: 'Sluit je aan bij de WhatsApp-community',
        ctaEvent: 'De club boeken voor een privé-evenement',
        formTitle: 'Informatie over de academie',
        labelName: 'Naam', labelPhone: 'Telefoon',
        labelLevel: 'Niveau', labelMessage: 'Bericht', optional: '(optioneel)',
        phName: 'Jouw naam', phPhone: '600 000 000',
        phLevel: 'Selecteer je niveau', phMessage: 'Wil je iets toevoegen?',
        levelBeginner: 'Beginner', levelIntermediate: 'Halfgevorderd',
        levelAdvanced: 'Gevorderd', levelCompetition: 'Competitie',
        submitBtn: 'Verzenden via WhatsApp',
        formNote: 'Je wordt doorgestuurd naar WhatsApp met je gegevens al ingevuld. We reageren zo snel mogelijk.',
        infoPhone: 'Telefoon', infoInstagram: 'Instagram',
        infoAddress: 'Adres', infoSchedule: 'Openingstijden'
      },
      footer: {
        claim: 'Padel naar een hoger niveau.',
        mapTitle: 'Route', mapLink: 'Bekijken op Google Maps',
        contactTitle: 'Contact',
        phoneLabel: 'Telefoon / WhatsApp',
        reservasLabel: 'Reserveringen', reservasLink: 'Vola Plus App',
        communityLabel: 'Community', communityLink: 'WhatsApp-groep',
        navTitle: 'De Club',
        navClub: 'De Club', navServices: 'Diensten', navAcademy: 'Academie',
        navPools: 'Pools & Toernooien', navGallery: 'Galerij',
        navContact: 'Contact', navBook: 'Baan boeken',
        designCredit: 'Webdesign door',
        legalLink: 'Juridische kennisgeving &amp; Privacy',
        ariaLabel: 'Paginavoettekst'
      },
      fab: { tooltip: 'Baan boeken', ariaLabel: 'Baan boeken bij Eleva Padel Club' },
      /* ── LANDING B2B (root /) ── */
      home: {
        waB2B: 'Hallo, ik heb een padelclub/academie en ik wil graag meer weten over aansluiten bij Eleva Pádel.',
        nav: {
          logoLabel: 'Eleva Pádel — home',
          manifesto: 'Manifest', about: 'Wat is het', join: 'Aansluiten',
          benefits: 'Voordelen', network: 'Het Netwerk', contact: 'Contact',
          cta: 'Sluit je aan'
        },
        hero: {
          kicker: 'EEN PADELCLUBMERK · ONTSTAAN IN PIZARRA',
          index: 'Het Netwerk',
          rot1: 'je club.', rot2: 'je merk.', rot3: 'je community.', rot4: 'je padel.',
          titleSr: 'Eleva je club, je merk, je community en je padel.',
          anchorCity: 'Pizarra · Málaga',
          anchorStatus: 'Actieve locatie',
          tagline: 'Eén merk. Eén beleving. Al je banen, naar een hoger niveau.',
          ctaPrimary: 'Breng Eleva naar je club',
          ctaSecondary: 'Bekijk een locatie'
        },
        marquee: {
          brand: 'Premium merk', multilang: 'Meertalige site ES · EN · NL',
          booking: 'Online reserveren', tournaments: 'Toernooien & Pools',
          community: 'Community', expansion: 'Netwerk in opbouw'
        },
        manifesto: {
          label: 'Manifest',
          headingHtml: 'Padel heeft niet méér banen nodig.<br>Het heeft meer <em>visie</em> nodig.',
          text: 'Wij geloven in clubs met ziel: goed ontworpen, goed verteld, goed gerund. Eleva is het merk dat jouw club tot een bestemming maakt —en je spelers tot een community.'
        },
        value: {
          label: 'Wat is Eleva',
          headingHtml: 'Een netwerk,<br>geen starre franchise.',
          p1: 'Eleva is een padelmerk dat begint in Pizarra. Wij leveren identiteit, technologie en een eigen meertalige website; jij behoudt je club, je team en je eigenheid.',
          p2: 'Samen verhogen we de standaard: de beleving van de speler, de uitstraling van je club en de community die het draagt.',
          stat1: 'Actieve locatie', stat2: 'Talen standaard', stat3: 'Opgericht'
        },
        steps: {
          label: 'Hoe je aansluit',
          headingHtml: 'Van jouw club naar het netwerk<br><em>in vier stappen.</em>',
          s1Title: 'We praten',    s1Desc: 'Vertel ons over je club en wat je zoekt. Vrijblijvend.',
          s2Title: 'We ontwerpen', s2Desc: 'We passen de Eleva-identiteit aan op jouw locatie: website, merk en digitale aanwezigheid.',
          s3Title: 'We lanceren',  s3Desc: 'We publiceren je club in het netwerk met reserveringen, community en meertaligheid.',
          s4Title: 'We groeien',   s4Desc: 'Toernooien, ledenwerving en een merk dat elke dag voor je werkt.'
        },
        benefits: {
          label: 'Voordelen van het netwerk',
          headingHtml: 'Alles wat een club nodig heeft<br>om op te <em>vallen</em>.',
          b1Title: 'Een verzorgde identiteit', b1Desc: 'Eén samenhangende identiteit op web, social en baan die je club meteen onderscheidt.',
          b2Title: 'Eigen meertalige site',  b2Desc: 'Je locatie met een eigen pagina in ES · EN · NL, klaar om elke speler te bereiken.',
          b3Title: 'Bereik & community',     b3Desc: 'We helpen je je club bekend te maken en losse spelers om te zetten in een community.',
          b4Title: 'Technologie & reserveren', b4Desc: 'We koppelen je online reserveringsplatform en verzorgen de digitale beleving van begin tot eind.',
          b5Title: 'Toernooien & events',    b5Desc: 'Toernooi- en poolformats klaar om te activeren, met de steun en communicatie van het merk.'
        },
        network: {
          label: 'Het Netwerk', heading: 'Waar het spel al anders voelt.',
          sub: 'We begonnen in Pizarra. Jouw club kan de volgende zijn.',
          statusLive: 'Eerste locatie', statusSoon: 'Binnenkort',
          visit: 'Bekijk locatie',
          ctaTitle: 'Jouw club hier', ctaLink: 'Neem contact op'
        },
        cta: {
          label: 'Contact',
          headingHtml: 'Klaar om je club<br><em>te laten stijgen?</em>',
          text: 'Vertel ons over je project. We reageren zo snel mogelijk via WhatsApp.',
          ctaPrimary: 'Chat via WhatsApp', ctaSecondary: 'Bekijk een locatie'
        },
        footer: {
          claim: 'Padel naar een hoger niveau, één club per keer.',
          sedeLabel: 'Eerste locatie', navTitle: 'Ontdek'
        },
        fab: { tooltip: 'Mijn club aanmelden', ariaLabel: 'Mijn club aanmelden bij Eleva Pádel' }
      },
      wa: {
        academia: 'Hallo, ik heb interesse in de beschikbare plaatsen bij Eleva Padel Club Academy.',
        prueba:   'Hallo, ik wil graag informatie over de lessen van Eleva Padel Club Academy: groepen, niveaus en tijden.',
        pool:     'Hallo! Kunnen jullie me de tijden van de volgende pool bij Eleva Padel Club doorgeven en of er nog plaatsen zijn? 🎾',
        contact:  'Hallo, ik heb interesse in informatie over Eleva Padel Club Academy.',
        event:    'Hallo, ik wil graag informatie over het boeken van Eleva Padel Club voor een privé-evenement.',
      },
      /* Eenheden en labels die de render uit het manifest injecteert */
      unit:   { month: '€/maand', pp: '€/pp' },
      label:  { court: 'Baan' },
      /* Labels voor de aangepaste cursor (data-cursor) */
      cursor: {
        book: 'boeken', view: 'bekijken', signup: 'vragen', soon: 'binnenkort',
        call: 'bellen', look: 'bekijken', send: 'versturen', read: 'lezen', join: 'meedoen', back: 'terug'
      }
    }

  };

})();
