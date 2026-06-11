/* =========================================================
   ELEVA PADEL CLUB — Datos editables
   =========================================================
   Edita este archivo para actualizar contenido sin tocar HTML.
   Tras cualquier cambio: actualiza el ?v= de este <script> en index.html.
   ========================================================= */
(function () {
  window.__ELEVA__ = {

    brand: {
      name:          'Eleva Padel Club',
      short:         'Eleva',
      tagline:       'Pádel elevado a otro nivel.',
      claim:         'El club de referencia del Valle.',
      /* ▼ CAMBIAR antes de entregar ▼ */
      phone:         '34659143103',   // número sin + ni espacios, ej: 34612345678
      address:       'Pasaje de Jerez S/N · 29560 Pizarra, Málaga',
      schedule:      'L–D · 9:00–00:00',
      mapEmbed:      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3466.5479952632068!2d-4.709363!3d36.769390699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72e988115878b1%3A0xe1dba9f0bb89d181!2sEleva%20Padel%20Pizarra!5e1!3m2!1ses!2ses!4v1781217402367!5m2!1ses!2ses',
      mapLat:        36.769391,
      mapLng:        -4.709363,
      /* ▲ CAMBIAR antes de entregar ▲ */
      communityWA:   'https://chat.whatsapp.com/EpKyuxIv74E2NWW1aBmPKE',
      instagram:     'elevapadelpizarra',
      reservas:      'https://vola.plus/app-link/club/1498',
      municipality:  'Pizarra, Málaga',
      year:          '2026',
      courts:        '4',
    },

    pools: [
      {
        id: 'snp',
        name: 'POOL SNP',
        day: 'Viernes',
        time: '21:30–23:00',
        price: '8€',
        desc: 'Sin par absoluto. Para quienes quieren saber exactamente dónde están.',
        prize: 'Camiseta BullPadel con logo del club (ganadores) · Bolas nuevas · 1h30 de juego',
        registration: 'Inscripción por grupo de WhatsApp',
      },
      {
        id: '4m',
        name: 'POOL 4ª MASCULINA',
        day: 'Viernes',
        time: '20:20–21:50',
        price: '8€',
        desc: 'Cuarta categoría masculina. Nivel parejo, partido garantizado.',
        prize: 'Camiseta BullPadel con logo del club (ganadores) · Bolas nuevas · 1h30 de juego',
        registration: 'Inscripción por grupo de WhatsApp',
      },
      {
        id: 'mix',
        name: 'POOL MIXTA',
        day: 'Jueves',
        time: '20:00–21:30',
        price: '8€',
        desc: 'Mixta abierta. El mejor ambiente de la semana.',
        prize: 'Camiseta BullPadel con logo del club (ganadores) · Bolas nuevas · 1h30 de juego',
        registration: 'Inscripción por grupo de WhatsApp',
      },
      {
        id: 'rocha',
        name: 'POOL ROCHA',
        day: 'Martes',
        time: '20:00–21:30',
        price: '8€',
        desc: 'Categoría Rocha. Competición real, buen rollo también.',
        prize: 'Camiseta BullPadel con logo del club (ganadores) · Bolas nuevas · 1h30 de juego',
        registration: 'Inscripción por grupo de WhatsApp',
      },
    ],

    academy: [
      {
        level: 'Iniciación',
        icon: 'beginner',
        desc: 'Empieza desde cero con la técnica correcta desde el primer golpe.',
        includes: ['Fundamentos de técnica', 'Movimiento en pista', 'Reglas y puntuación'],
      },
      {
        level: 'Intermedio',
        icon: 'intermediate',
        desc: 'Consolida tu juego y desarrolla táctica real de partido.',
        includes: ['Técnica avanzada', 'Táctica de pareja', 'Situaciones reales de juego'],
      },
      {
        level: 'Avanzado / Competición',
        icon: 'advanced',
        desc: 'Para quienes ya juegan y quieren subir de categoría.',
        includes: ['Análisis de juego', 'Preparación para torneos', 'Estrategia de partido'],
      },
    ],

    team: [
      {
        name: 'Lorena Vano',
        role: 'Monitora · Jugadora Profesional',
        bio: 'Jugadora de pádel profesional de reconocido prestigio e imagen del club. Referente técnico de la academia de Eleva Padel Club.',
      },
      {
        name: 'Maripaz',
        role: 'Coordinadora de Pádel',
        bio: 'Coordinadora de todo lo relacionado con el pádel en el club. Alma organizativa de la competición y la academia.',
      },
    ],

    sponsors: [
      { name: 'Campoheltos', url: '#', logo: '' },
      { name: 'Cedrón',      url: '#', logo: '' },
      { name: 'Montajes Peyma', url: '#', logo: '' },
      { name: 'La Herradura',   url: '#', logo: '' },
      { name: 'Kocsa Obras y Servicios', url: '#', logo: '' },
      { name: 'Siraco',      url: '#', logo: '' },
      { name: 'Bar La Herradura', url: '#', logo: '' },
    ],

    pricing: {
      courts: [
        { duration: '1h',   slot: 'antes de 17h', price: '8€' },
        { duration: '1h30', slot: 'antes de 17h', price: '12€' },
        { duration: '1h',   slot: 'desde las 17h', price: '15€' },
        { duration: '1h30', slot: 'desde las 17h', price: '22€' },
      ],
      privateLessons: [
        { group: 'Individual',   price: '40€' },
        { group: '2 personas',   price: '25€/persona' },
        { group: '3 personas',   price: '20€/persona' },
      ],
      academyAdults: [
        { group: '4 personas', freq: '1 día/sem', price: '60€/mes' },
        { group: '3 personas', freq: '1 día/sem', price: '75€/mes' },
        { group: '2 personas', freq: '1 día/sem', price: '95€/mes' },
      ],
      academyJunior: [
        { age: '5–9 años', days: 1, price: '50€/mes' },
        { age: '5–9 años', days: 2, price: '80€/mes' },
        { age: '+10 años', days: 1, price: '60€/mes' },
        { age: '+10 años', days: 2, price: '90€/mes' },
      ],
    },

    torneo: {
      name: 'I Torneo Eleva Padel Pizarra',
      dates: '24–28 de Junio de 2026',
      inscription: '25€/jugador (2ª inscripción 15€ sin welcome pack adicional)',
      registrationUrl: 'https://vola.plus/app-link/club/1498',
      welcomePack: 'Saco gym · Botella acero inox · Refresco NOCCO · Fruta',
      categories: [
        { name: '2ª Masculina', champion: '250€', runnerUp: '120€' },
        { name: '3ª Masculina', champion: '180€ + Floky', runnerUp: '90€' },
        { name: '4ª Masculina', champion: '120€', runnerUp: 'Paletero BullPadel' },
        { name: '5ª Masculina', champion: '100€', runnerUp: 'Mochila BullPadel' },
        { name: '4ª Femenina',  champion: '120€ + Floky', runnerUp: 'Paletero BullPadel' },
        { name: '5ª Femenina',  champion: '100€', runnerUp: 'Mochila BullPadel' },
        { name: 'Mixto',        champion: '100€', runnerUp: 'Mochila BullPadel' },
      ],
      note: 'Premios sujetos a mínimo 12 parejas por categoría. Sorteo: palas, clases particulares, mochilas, Floky, pizzas, cortes de pelo, neceser.',
    },

    /* Rutas de imagen — sustituye con tus fotos reales */
    gallery: [
      'assets/img/gallery-01.jpg',
      'assets/img/gallery-02.jpg',
      'assets/img/gallery-03.jpg',
      'assets/img/gallery-04.jpg',
      'assets/img/gallery-05.jpg',
      'assets/img/gallery-06.jpg',
      'assets/img/gallery-07.jpg',
      'assets/img/gallery-08.jpg',
      'assets/img/gallery-09.jpg',
      'assets/img/gallery-10.jpg',
      'assets/img/gallery-11.jpg',
      'assets/img/gallery-12.jpg',
      'assets/img/gallery-13.jpg',
      'assets/img/gallery-14.jpg',
      'assets/img/gallery-15.jpg',
      'assets/img/gallery-16.jpg',
    ],

  };
})();
