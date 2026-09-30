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
        courts: 'Pistas de pádel', academy: 'Academia & Clases',
        pools: 'Pools por categoría', chill: 'Zona Chill-Out',
        /* location/tag: valores por sede en el manifest del club */
        location: 'Eleva Pádel', tag: 'High Performance & Social Club'
      },
      club: {
        label: 'El Club', aside: 'ELEVA · PADEL CLUB',
        headingHtml: 'Un club con más futuro<br>que presente.',
        courts: 'Pistas', courtsDesc: 'Pistas de pádel con reserva online',
        schedule: 'Horario', scheduleValue: 'Consultar horario', bookings: 'Reservas',
        community: 'Comunidad', communityLink: 'Grupo WhatsApp activo',
        tournaments: 'Competición',
        tournamentsDesc: 'Pools por categoría<br>Horarios variables — plazas por WhatsApp'
      },
      services: {
        srHeading: 'Servicios de Eleva Padel Club',
        cat1: 'Instalaciones', title1: 'Pistas', sub1: 'Juega. Reserva en un minuto.',
        desc1: 'Reserva online en Vola o por teléfono.',
        rate1dt: '1h antes de 17h', rate2dt: '1h30 antes de 17h',
        rate3dt: '1h desde 17h',    rate4dt: '1h30 desde 17h',
        cta1: 'Reservar pista',
        cat2: 'Formación', title2: 'Academia', sub2: 'Sube de nivel de verdad.',
        desc2: 'Grupos de 2 a 4 personas y 1h de técnica real. Clases para todos los niveles, desde iniciación hasta competición.',
        cta2: 'Consultar plazas',
        cat3: 'Competición', title3: 'Pools', sub3: 'Compite en tu categoría.',
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
        role2: 'Coordinación',
        bio2: 'Coordinación del pádel en el club: competición y academia.'
      },
      pools: {
        label: 'Pools',
        headingHtml: 'Compite<br>en tu categoría.',
        perksLabel: 'Todos los pools incluyen',
        include: 'Bolas nuevas · Horario a consultar por WhatsApp',
        prizeLabel: 'Premio ganadores',
        prize: 'Consultar en el club',
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
        heading: 'El club.', subtitle: 'Imágenes ilustrativas', pause: 'Pausar', play: 'Reanudar',
        ariaLabel: 'Galería de imágenes',
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
        infoAddress: 'Dirección', infoSchedule: 'Horario',
        errRequired: 'Rellena este campo.',
        errLevel: 'Selecciona tu nivel.',
        errPhone: 'Escribe un teléfono válido (solo números, espacios o +).',
        privacyNoteHtml: 'Responsable: Eleva Padel Club. Finalidad: responder a tu consulta por WhatsApp. Tus derechos y el resto de información, en el <a href="../privacidad.html">aviso legal y privacidad</a>.',
        dataNoticeHtml: 'No se han podido cargar las tarifas, los pools ni el equipo. Escríbenos por WhatsApp y te informamos.'
      },
      footer: {
        claim: 'Pádel elevado a otro nivel.',
        mapTitle: 'Cómo llegar', mapLink: 'Ver en Google Maps', mapAria: 'Ver la ubicación en Google Maps',
        contactTitle: 'Contacto',
        phoneLabel: 'Teléfono / WhatsApp',
        reservasLabel: 'Reservas', reservasLink: 'App Vola Plus',
        communityLabel: 'Comunidad', communityLink: 'Grupo WhatsApp',
        navTitle: 'El Club',
        navClub: 'El Club', navServices: 'Servicios', navAcademy: 'Academia',
        navPools: 'Pools', navGallery: 'Galería',
        navContact: 'Contacto', navBook: 'Reservar pista',
        credit: 'Desarrollado por',
        legalLink: 'Aviso Legal &amp; Privacidad',
        ariaLabel: 'Pie de página'
      },
      fab: { tooltip: 'Reservar pista', ariaLabel: 'Reservar pista en Eleva Padel Club' },
      splash: { label: 'Cargando Eleva Padel Club' },
      meta:   { title: 'Eleva Padel Club' },
      /* ── LANDING B2B (raíz /) ── */
      home: {
        metaTitle: 'Eleva Pádel · Marca de clubes de pádel',
        splashLabel: 'Cargando Eleva Pádel',
        brandMark: 'ELEVA · PÁDEL · NACE EN PIZARRA',
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
          ariaLabel: 'Eleva Pádel — red de clubes de pádel',
          rot1: 'tu club.', rot2: 'tu marca.', rot3: 'tu comunidad.', rot4: 'tu pádel.',
          titleSr: 'Eleva tu club, tu marca, tu comunidad y tu pádel.',
          anchorCity: 'Pizarra · Málaga',
          anchorStatus: 'Sede activa',
          tagline: 'Una marca. Una experiencia. Todas tus pistas, elevadas.',
          ctaPrimary: 'Lleva Eleva a tu club',
          ctaSecondary: 'Ver una sede'
        },
        marquee: {
          brand: 'Marca propia', multilang: 'Web multiidioma ES · EN · NL',
          booking: 'Reservas online', tournaments: 'Pools por categoría',
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
          p1: 'Eleva es una marca de pádel que empieza en Pizarra. Aportamos identidad, una web propia multiidioma y el enlace con tu plataforma de reservas; tú mantienes tu club, tu equipo y tu esencia.',
          p2: 'Juntos elevamos el estándar: la experiencia que vive el jugador, la imagen que proyecta tu club y la comunidad que lo sostiene.',
          stat1: 'Sede activa', stat2: 'Idiomas de serie', stat3: 'Año de fundación'
        },
        steps: {
          label: 'Cómo unir tu club',
          headingHtml: 'De tu club a la red<br><em>en cuatro pasos.</em>',
          s1Title: 'Hablamos',   s1Desc: 'Nos cuentas cómo es tu club y qué buscas. Sin compromiso.',
          s2Title: 'Diseñamos',  s2Desc: 'Adaptamos la identidad Eleva a tu sede: web, marca y presencia digital.',
          s3Title: 'Lanzamos',   s3Desc: 'Publicamos tu club en la red con reservas, comunidad y multiidioma.',
          s4Title: 'Crecemos',   s4Desc: 'Te ayudamos a arrancar con lo que ya funciona en Pizarra: pools, comunidad y comunicación.'
        },
        benefits: {
          label: 'Beneficios de la red',
          headingHtml: 'Todo lo que un club necesita<br>para <em>destacar</em>.',
          b1Title: 'Identidad cuidada',       b1Desc: 'Una identidad coherente en web, redes y pista que diferencia tu club desde el primer vistazo.',
          b2Title: 'Web propia multiidioma',  b2Desc: 'Tu sede con página propia en ES · EN · NL, lista para captar a cualquier jugador.',
          b3Title: 'Comunidad',               b3Desc: 'Te ayudamos a convertir jugadores sueltos en comunidad: grupo de WhatsApp, pools y comunicación.',
          b4Title: 'Tecnología y reservas',   b4Desc: 'Enlazamos tu plataforma de reservas online y cuidamos la experiencia digital de principio a fin.',
          b5Title: 'Pools y eventos',         b5Desc: 'El formato de pools que ya funciona en Pizarra, adaptado a tu club.'
        },
        network: {
          label: 'La Red', heading: 'Donde ya se juega Eleva.',
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
        tagline: 'Padel taken to the next level.',
        ctaPrimary: 'Book a court', ctaSecondary: 'Discover the club',
        scroll: 'Scroll'
      },
      marquee: {
        courts: 'Padel courts', academy: 'Academy & Classes',
        pools: 'Pools by category', chill: 'Chill-Out Zone',
        /* location/tag: per-venue values in the club manifest */
        location: 'Eleva Pádel', tag: 'High Performance & Social Club'
      },
      club: {
        label: 'The Club', aside: 'ELEVA · PADEL CLUB',
        headingHtml: 'A club with more future<br>than present.',
        courts: 'Courts', courtsDesc: 'Padel courts with online booking',
        schedule: 'Hours', scheduleValue: 'Check opening hours', bookings: 'Bookings',
        community: 'Community', communityLink: 'Active WhatsApp group',
        tournaments: 'Competition',
        tournamentsDesc: 'Pools by category<br>Variable schedule — spots via WhatsApp'
      },
      services: {
        srHeading: 'Services at Eleva Padel Club',
        cat1: 'Facilities', title1: 'Courts', sub1: 'Play. Book in a minute.',
        desc1: 'Book online on Vola or by phone.',
        rate1dt: '60 min before 5 pm', rate2dt: '90 min before 5 pm',
        rate3dt: '60 min from 5 pm',   rate4dt: '90 min from 5 pm',
        cta1: 'Book a court',
        cat2: 'Training', title2: 'Academy', sub2: 'Level up for real.',
        desc2: 'Groups of 2 to 4 people, in 1-hour sessions focused on real technique. Classes for all levels, from beginner to competition.',
        cta2: 'Check availability',
        cat3: 'Competition', title3: 'Pools', sub3: 'Compete in your category.',
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
        bio1: 'Club coach and technical lead of the academy.',
        role2: 'Coordination',
        bio2: 'Padel coordination at the club: competition and academy.'
      },
      pools: {
        label: 'Pools',
        headingHtml: 'Compete<br>in your category.',
        perksLabel: 'All pools include',
        include: 'New balls · Schedule to be confirmed via WhatsApp',
        prizeLabel: 'Winners’ prize',
        prize: 'Ask at the club',
        quote: '“There are places with more future than present.”',
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
        heading: 'The club.', subtitle: 'Illustrative images', pause: 'Pause', play: 'Play',
        ariaLabel: 'Image gallery',
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
        infoAddress: 'Address', infoSchedule: 'Hours',
        errRequired: 'Please fill in this field.',
        errLevel: 'Please select your level.',
        errPhone: 'Enter a valid phone number (digits, spaces or + only).',
        privacyNoteHtml: 'Controller: Eleva Padel Club. Purpose: to answer your enquiry on WhatsApp. Your rights and further information are in the <a href="../privacidad.html">legal notice and privacy policy</a> (in Spanish).',
        dataNoticeHtml: 'The club’s rates, pools and team could not be loaded. Message us on WhatsApp and we will tell you.'
      },
      footer: {
        claim: 'Padel taken to the next level.',
        mapTitle: 'How to get here', mapLink: 'View on Google Maps', mapAria: 'See the location on Google Maps',
        contactTitle: 'Contact',
        phoneLabel: 'Phone / WhatsApp',
        reservasLabel: 'Bookings', reservasLink: 'Vola Plus App',
        communityLabel: 'Community', communityLink: 'WhatsApp Group',
        navTitle: 'The Club',
        navClub: 'The Club', navServices: 'Services', navAcademy: 'Academy',
        navPools: 'Pools', navGallery: 'Gallery',
        navContact: 'Contact', navBook: 'Book a court',
        credit: 'Developed by',
        legalLink: 'Legal Notice &amp; Privacy',
        ariaLabel: 'Page footer'
      },
      fab: { tooltip: 'Book a court', ariaLabel: 'Book a court at Eleva Padel Club' },
      splash: { label: 'Loading Eleva Padel Club' },
      meta:   { title: 'Eleva Padel Club' },
      /* ── LANDING B2B (root /) ── */
      home: {
        metaTitle: 'Eleva Pádel · A padel club brand',
        splashLabel: 'Loading Eleva Pádel',
        brandMark: 'ELEVA · PADEL · BORN IN PIZARRA',
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
          ariaLabel: 'Eleva Pádel — a network of padel clubs',
          rot1: 'your club.', rot2: 'your brand.', rot3: 'your community.', rot4: 'your padel.',
          titleSr: 'Eleva your club, your brand, your community and your padel.',
          anchorCity: 'Pizarra · Málaga',
          anchorStatus: 'Active location',
          tagline: 'One brand. One experience. All your courts, elevated.',
          ctaPrimary: 'Bring Eleva to your club',
          ctaSecondary: 'See a location'
        },
        marquee: {
          brand: 'Own brand', multilang: 'Multilingual site ES · EN · NL',
          booking: 'Online booking', tournaments: 'Pools by category',
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
          p1: 'Eleva is a padel brand starting out in Pizarra. We bring identity, a dedicated multilingual website and the link to your booking platform; you keep your club, your team and your essence.',
          p2: 'Together we raise the standard: the experience your players live, the image your club projects and the community that sustains it.',
          stat1: 'Active location', stat2: 'Languages built in', stat3: 'Founded'
        },
        steps: {
          label: 'How to join',
          headingHtml: 'From your club to the network<br><em>in four steps.</em>',
          s1Title: 'We talk',    s1Desc: 'Tell us about your club and what you’re looking for. No commitment.',
          s2Title: 'We design',  s2Desc: 'We adapt the Eleva identity to your venue: website, brand and digital presence.',
          s3Title: 'We launch',  s3Desc: 'We publish your club in the network with booking, community and multilingual support.',
          s4Title: 'We grow',    s4Desc: 'We help you get going with what already works in Pizarra: pools, community and communication.'
        },
        benefits: {
          label: 'Network benefits',
          headingHtml: 'Everything a club needs<br>to <em>stand out</em>.',
          b1Title: 'A considered identity', b1Desc: 'One coherent identity across web, social and court that sets your club apart at first glance.',
          b2Title: 'Your own multilingual site', b2Desc: 'Your venue with its own page in ES · EN · NL, ready to reach any player.',
          b3Title: 'Community',              b3Desc: 'We help you turn one-off players into a community: WhatsApp group, pools and communication.',
          b4Title: 'Technology & booking',   b4Desc: 'We link your online booking platform and look after the digital experience end to end.',
          b5Title: 'Pools & events',         b5Desc: 'The pool format that already works in Pizarra, adapted to your club.'
        },
        network: {
          label: 'The Network', heading: 'Where Eleva is already played.',
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
        courts: 'Padelbanen', academy: 'Academie & Lessen',
        pools: 'Pools per categorie', chill: 'Chill-out Zone',
        /* location/tag: waarden per locatie in het clubmanifest */
        location: 'Eleva Pádel', tag: 'High Performance & Social Club'
      },
      club: {
        label: 'De Club', aside: 'ELEVA · PADEL CLUB',
        headingHtml: 'Een club met meer toekomst<br>dan heden.',
        courts: 'Banen', courtsDesc: 'Padelbanen met online reserveren',
        schedule: 'Openingstijden', scheduleValue: 'Openingstijden op aanvraag', bookings: 'Reserveringen',
        community: 'Community', communityLink: 'Actieve WhatsApp-groep',
        tournaments: 'Competitie',
        tournamentsDesc: 'Pools per categorie<br>Wisselende tijden — plaatsen via WhatsApp'
      },
      services: {
        srHeading: 'Diensten van Eleva Padel Club',
        cat1: 'Faciliteiten', title1: 'Banen', sub1: 'Spelen. In een minuut geboekt.',
        desc1: 'Reserveer online via Vola of telefonisch.',
        rate1dt: '60 min vóór 17.00 uur', rate2dt: '90 min vóór 17.00 uur',
        rate3dt: '60 min vanaf 17.00 uur', rate4dt: '90 min vanaf 17.00 uur',
        cta1: 'Baan boeken',
        cat2: 'Training', title2: 'Academie', sub2: 'Echt een niveau hoger.',
        desc2: 'Groepen van 2 tot 4 personen, in lessen van 1 uur gericht op echte techniek. Lessen voor alle niveaus, van beginner tot competitie.',
        cta2: 'Beschikbaarheid checken',
        cat3: 'Competitie', title3: 'Pools', sub3: 'Speel in je eigen categorie.',
        desc3: 'Pools per categorie, met een vaste prijs en een goede sfeer gegarandeerd. De tijden wisselen: vraag de volgende op via WhatsApp.',
        cta3: 'Word lid van de groep',
        cat4: 'Sfeer', title4: 'Chill-Out', sub4: 'Het spel stopt, de avond niet.',
        desc4: 'Ontspanningszone met verfrissingen en koude drankjes na het spel. Waar de volgende teams worden gevormd en de beste gesprekken plaatsvinden.',
        cta4: 'Route'
      },
      academy: {
        label: 'Academie',
        headingHtml: 'Train serieus.<br><em>Verbeter echt.</em>',
        level1: 'Beginner', card1Title: 'Begin goed vanaf nul.',
        card1Desc: 'Leer de juiste techniek vanaf de eerste slag. Geen slechte gewoonten, solide basis.',
        inc1a: 'Technische grondslagen', inc1b: 'Beweging en positionering', inc1c: 'Regels en scoring',
        level2: 'Halfgevorderd', card2Title: 'Consolideer techniek en tactiek.',
        card2Desc: 'Je slaat al goed. Leer nu het spel te lezen en samen te spelen.',
        inc2a: 'Gevorderde techniek', inc2b: 'Paartactiek', inc2c: 'Echte speelsituaties',
        level3: 'Gevorderd / Competitie', card3Title: 'Een categorie hoger.',
        card3Desc: 'Voor degenen die al spelen en resultaten willen. Analyse, strategie, competitie.',
        inc3a: 'Spelanalyse', inc3b: 'Toernooivoorbereiding', inc3c: 'Wedstrijdstrategie',
        ratesLabel: 'Tarieven Academie',
        pricingAdultsTitle: 'Volwassenenacademie',
        pricingJuniorTitle: 'Jeugdacademie',
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
        bio1: 'Clubcoach en technisch boegbeeld van de academie.',
        role2: 'Coördinatie',
        bio2: 'Coördinatie van het padel in de club: competitie en academie.'
      },
      pools: {
        label: 'Pools',
        headingHtml: 'Speel in je<br>eigen categorie.',
        perksLabel: 'Bij elke pool inbegrepen',
        include: 'Nieuwe ballen · Tijden op aanvraag via WhatsApp',
        prizeLabel: 'Prijs voor de winnaars',
        prize: 'Vraag het bij de club',
        quote: '„Er zijn plaatsen met meer toekomst dan heden.”',
        cta:   'Vraag de volgende pool aan',
        join:  'Tijden opvragen',
        swipe: 'Swipe · {n} badges'
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
        heading: 'De club.', subtitle: 'Illustratieve beelden', pause: 'Pauzeren', play: 'Afspelen',
        ariaLabel: 'Fotogalerij',
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
        infoAddress: 'Adres', infoSchedule: 'Openingstijden',
        errRequired: 'Vul dit veld in.',
        errLevel: 'Selecteer je niveau.',
        errPhone: 'Vul een geldig telefoonnummer in (alleen cijfers, spaties of +).',
        privacyNoteHtml: 'Verwerkingsverantwoordelijke: Eleva Padel Club. Doel: je vraag via WhatsApp beantwoorden. Je rechten en meer informatie staan in de <a href="../privacidad.html">juridische kennisgeving en privacyverklaring</a> (in het Spaans).',
        dataNoticeHtml: 'De tarieven, pools en het team van de club konden niet worden geladen. Stuur ons een WhatsApp-bericht, dan vertellen we het je.'
      },
      footer: {
        claim: 'Padel naar een hoger niveau.',
        mapTitle: 'Route', mapLink: 'Bekijken op Google Maps', mapAria: 'Bekijk de locatie op Google Maps',
        contactTitle: 'Contact',
        phoneLabel: 'Telefoon / WhatsApp',
        reservasLabel: 'Reserveringen', reservasLink: 'Vola Plus App',
        communityLabel: 'Community', communityLink: 'WhatsApp-groep',
        navTitle: 'De Club',
        navClub: 'De Club', navServices: 'Diensten', navAcademy: 'Academie',
        navPools: 'Pools', navGallery: 'Galerij',
        navContact: 'Contact', navBook: 'Baan boeken',
        credit: 'Ontwikkeld door',
        legalLink: 'Juridische kennisgeving &amp; Privacy',
        ariaLabel: 'Paginavoettekst'
      },
      fab: { tooltip: 'Baan boeken', ariaLabel: 'Baan boeken bij Eleva Padel Club' },
      splash: { label: 'Eleva Padel Club wordt geladen' },
      meta:   { title: 'Eleva Padel Club' },
      /* ── LANDING B2B (root /) ── */
      home: {
        metaTitle: 'Eleva Pádel · Een padelclubmerk',
        splashLabel: 'Eleva Pádel wordt geladen',
        brandMark: 'ELEVA · PADEL · ONTSTAAN IN PIZARRA',
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
          ariaLabel: 'Eleva Pádel — een netwerk van padelclubs',
          rot1: 'je club.', rot2: 'je merk.', rot3: 'je community.', rot4: 'je padel.',
          titleSr: 'Eleva je club, je merk, je community en je padel.',
          anchorCity: 'Pizarra · Málaga',
          anchorStatus: 'Actieve locatie',
          tagline: 'Eén merk. Eén beleving. Al je banen, naar een hoger niveau.',
          ctaPrimary: 'Breng Eleva naar je club',
          ctaSecondary: 'Bekijk een locatie'
        },
        marquee: {
          brand: 'Eigen merk', multilang: 'Meertalige site ES · EN · NL',
          booking: 'Online reserveren', tournaments: 'Pools per categorie',
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
          p1: 'Eleva is een padelmerk dat begint in Pizarra. Wij leveren identiteit, een eigen meertalige website en de koppeling met je reserveringsplatform; jij behoudt je club, je team en je eigenheid.',
          p2: 'Samen verhogen we de standaard: de beleving van de speler, de uitstraling van je club en de community die het draagt.',
          stat1: 'Actieve locatie', stat2: 'Talen standaard', stat3: 'Opgericht'
        },
        steps: {
          label: 'Hoe je aansluit',
          headingHtml: 'Van jouw club naar het netwerk<br><em>in vier stappen.</em>',
          s1Title: 'We praten',    s1Desc: 'Vertel ons over je club en wat je zoekt. Vrijblijvend.',
          s2Title: 'We ontwerpen', s2Desc: 'We passen de Eleva-identiteit aan op jouw locatie: website, merk en digitale aanwezigheid.',
          s3Title: 'We lanceren',  s3Desc: 'We publiceren je club in het netwerk met reserveringen, community en meertaligheid.',
          s4Title: 'We groeien',   s4Desc: 'We helpen je op weg met wat in Pizarra al werkt: pools, community en communicatie.'
        },
        benefits: {
          label: 'Voordelen van het netwerk',
          headingHtml: 'Alles wat een club nodig heeft<br>om op te <em>vallen</em>.',
          b1Title: 'Een verzorgde identiteit', b1Desc: 'Eén samenhangende identiteit op web, social en baan die je club meteen onderscheidt.',
          b2Title: 'Eigen meertalige site',  b2Desc: 'Je locatie met een eigen pagina in ES · EN · NL, klaar om elke speler te bereiken.',
          b3Title: 'Community',              b3Desc: 'We helpen je losse spelers om te zetten in een community: WhatsApp-groep, pools en communicatie.',
          b4Title: 'Technologie & reserveren', b4Desc: 'We koppelen je online reserveringsplatform en verzorgen de digitale beleving van begin tot eind.',
          b5Title: 'Pools & events',         b5Desc: 'Het poolformat dat in Pizarra al werkt, aangepast aan jouw club.'
        },
        network: {
          label: 'Het Netwerk', heading: 'Waar Eleva al gespeeld wordt.',
          sub: 'We begonnen in Pizarra. Jouw club kan de volgende zijn.',
          statusLive: 'Eerste locatie', statusSoon: 'Binnenkort',
          visit: 'Bekijk locatie',
          ctaTitle: 'Jouw club hier', ctaLink: 'Neem contact op'
        },
        cta: {
          label: 'Contact',
          headingHtml: 'Klaar om je club<br><em>naar een hoger niveau te tillen?</em>',
          text: 'Vertel ons over je project. We reageren zo snel mogelijk via WhatsApp.',
          ctaPrimary: 'Chat via WhatsApp', ctaSecondary: 'Bekijk een locatie'
        },
        footer: {
          claim: 'Padel naar een hoger niveau, club voor club.',
          sedeLabel: 'Eerste locatie', navTitle: 'Ontdek'
        },
        fab: { tooltip: 'Mijn club aanmelden', ariaLabel: 'Mijn club aanmelden bij Eleva Pádel' }
      },
      wa: {
        academia: 'Hallo, ik heb interesse in de beschikbare plaatsen bij de academie van Eleva Padel Club.',
        prueba:   'Hallo, ik wil graag informatie over de lessen van de academie van Eleva Padel Club: groepen, niveaus en tijden.',
        pool:     'Hallo! Kunnen jullie me de tijden van de volgende pool bij Eleva Padel Club doorgeven en of er nog plaatsen zijn? 🎾',
        contact:  'Hallo, ik heb interesse in informatie over de academie van Eleva Padel Club.',
        event:    'Hallo, ik wil graag informatie over het boeken van Eleva Padel Club voor een privé-evenement.',
      },
      /* Eenheden en labels die de render uit het manifest injecteert */
      unit:   { month: '€/maand', pp: '€ p.p.' },
      label:  { court: 'Baan' },
      /* Labels voor de aangepaste cursor (data-cursor) */
      cursor: {
        book: 'boeken', view: 'bekijken', signup: 'vragen', soon: 'binnenkort',
        call: 'bellen', look: 'bekijken', send: 'versturen', read: 'lezen', join: 'meedoen', back: 'terug'
      }
    }

  };

})();
