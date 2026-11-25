/* =========================================================
   ELEVA PÁDEL — MANIFEST DE CLUB · PIZARRA
   ---------------------------------------------------------
   Datos de la sede que pinta js/main.js (window.__ELEVA__).

   Reglas:
   · Solo datos CONFIRMADOS. Lo pendiente se marca con PENDIENTE_CLUB
     y no se pinta. El valor propuesto vive en CONFIRMAR.md (local,
     fuera de Git): nunca aquí, ni oculto ni comentado. El repo es público.
   · Lo que puede cambiar (tarifas, condiciones…) lleva `verificado`
     (fecha AAAA-MM-DD de la última confirmación) y `fuente`.
     tools/validar.js avisa cuando pasan 90 días.
   · Textos traducibles: { es, en, nl, h: { en, nl } } (h: huella del
     español de cada traducción, tools/i18n.js). Sin en/nl: traducción
     pendiente; se pinta el español con lang="es" y validar.js lo avisa.
   · Rutas de assets con "../" (la página se sirve en /pizarra, sin barra).
   · Tras cualquier cambio, sube el ?v= en los HTML.
   ========================================================= */
(function () {
  var PENDIENTE_CLUB = 'PENDIENTE_CLUB';

  window.__ELEVA__ = {

    sede: {
      slug:   'pizarra',
      nombre: 'Eleva Pádel Pizarra',
      ciudad: 'Pizarra, Málaga'
    },

    /* Para el JSON-LD (tools/generar.js) */
    seo: {
      descripcion: 'Club de pádel con 4 pistas exteriores de cristal con iluminación LED y zona chill-out en Pizarra, Málaga.',
      imagen:      'assets/img/og-pizarra.jpg'
    },

    contacto: {
      whatsapp:        '34659143103',          /* solo dígitos, con prefijo */
      whatsappDisplay: '+34 659 14 31 03',
      llamadas:        PENDIENTE_CLUB,         /* ¿atienden llamadas? sin confirmar: no hay enlaces tel: */
      instagram:       { url: 'https://instagram.com/elevapadelpizarra', handle: '@elevapadelpizarra' },
      comunidad:       'https://chat.whatsapp.com/EpKyuxIv74E2NWW1aBmPKE',
      reservas:        'https://vola.plus/app-link/club/1498',
      direccion:       'Pasaje Jerez s/n · 29560 Pizarra, Málaga',
      direccionPostal: { streetAddress: 'Pasaje Jerez s/n', postalCode: '29560', addressLocality: 'Pizarra', addressRegion: 'Málaga', addressCountry: 'ES' },
      mapsUrl:         'https://maps.app.goo.gl/Zapc2bCKXtFfKwTw5',
      geo:             { lat: 36.76933415706922, lng: -4.709440122747979, verificado: '2026-09-30', fuente: 'propietario' },
      mapImage:        '../assets/maps/pizarra.svg',   /* generado con clubs/_plantilla/generar-mapa.js */
      horario:         PENDIENTE_CLUB
    },

    instalaciones: {
      verificado: '2026-09-30',
      fuente:     'cliente',
      items: [
        {
          es: '4 pistas exteriores de cristal',
          en: '4 outdoor glass courts',
          nl: '4 glazen buitenbanen',
          h: { en: 'c2a3d9b4', nl: 'c2a3d9b4' }
        },
        {
          es: 'Iluminación LED',
          en: 'LED lighting',
          nl: 'Ledverlichting',
          h: { en: '827df877', nl: '827df877' }
        },
        {
          es: 'Zona chill-out',
          en: 'Chill-out area',
          nl: 'Chill-outzone',
          h: { en: '5a15b1f9', nl: '5a15b1f9' }
        }
      ]
    },

    reservas: {
      verificado: '2026-09-30',
      fuente:     'cartel: Clases y servicios',
      canales:    {
        es: 'Por Vola, por WhatsApp o en recepción.',
        en: 'On Vola, on WhatsApp or at reception.',
        nl: 'Via Vola, via WhatsApp of bij de receptie.',
        h: { en: 'a8fbbf97', nl: 'a8fbbf97' }
      }
    },

    tarifas: {
      /* Precios y tramos del cartel; por pista y el horario del segundo
         tramo, confirmados después por el propietario */
      pistas: {
        verificado: '2026-10-06',
        fuente:     'carteles del club en Instagram, confirmados por el club',
        unidad: {
          verificado: '2026-11-24',
          fuente:     'confirmado por el propietario',
          porPista:   true
        },
        tramos: [
          { cuando: { es: 'Lunes a viernes hasta las 17:00 h', en: 'Monday to Friday until 17:00', nl: 'Maandag t/m vrijdag tot 17:00', h: { en: '46e189b2', nl: '46e189b2' } },
            precios: [ { duracion: '60 min', precio: '10 €' }, { duracion: '90 min', precio: '16 €' } ] },
          { verificado: '2026-11-24',
            fuente:     'confirmado por el propietario',
            cuando: {
              es: 'Lunes a viernes desde las 17:00 h; fines de semana y festivos, todo el día',
              en: 'Monday to Friday from 17:00; weekends and public holidays, all day',
              nl: 'Maandag t/m vrijdag vanaf 17:00; weekenden en feestdagen de hele dag',
              h: { en: '9fb2007b', nl: '9fb2007b' }
            },
            precios: [ { duracion: '60 min', precio: '15 €' }, { duracion: '90 min', precio: '22 €' } ] }
        ]
      },
      ivaIncluido: true,
      clases: {
        verificado: '2026-09-30',
        fuente:     'cartel: Clases y servicios',
        grupo: {
          titulo:  {
            es: 'Clases en grupo',
            en: 'Group lessons',
            nl: 'Groepslessen',
            h: { en: '6b5d980c', nl: '6b5d980c' }
          },
          precio:  '60 €',
          unidad:  {
            es: 'por persona al mes',
            en: 'per person per month',
            nl: 'per persoon per maand',
            h: { en: 'abe7e342', nl: 'abe7e342' }
          },
          detalle: [
            {
              es: 'Grupos de 4 personas.',
              en: 'Groups of 4 people.',
              nl: 'Groepen van 4 personen.',
              h: { en: 'ccf75512', nl: 'ccf75512' }
            },
            {
              es: 'Se organizan por nivel, según haya hueco y se pueda formar el grupo.',
              en: 'Organised by level, subject to space and enough players to form a group.',
              nl: 'Ingedeeld op niveau, als er plek is en er genoeg deelnemers voor een groep zijn.',
              h: { en: '2ad60240', nl: '2ad60240' }
            },
            {
              es: 'Plazas limitadas.',
              en: 'Limited places.',
              nl: 'Beperkt aantal plaatsen.',
              h: { en: '942e65ef', nl: '942e65ef' }
            },
            {
              es: 'También hay clases sueltas: pregúntanos.',
              en: 'You can also pay as you go: just ask.',
              nl: 'Er zijn ook losse lessen: vraag ernaar.',
              h: { en: '27b6db74', nl: '27b6db74' }
            }
          ]
        },
        otras: {
          titulo:  {
            es: 'Otras opciones',
            en: 'Other options',
            nl: 'Andere opties',
            h: { en: '58ce1392', nl: '58ce1392' }
          },
          detalle: [
            {
              es: 'Clases individuales o para 2 o 3 personas.',
              en: 'One-to-one lessons, or for 2 or 3 people.',
              nl: 'Individuele lessen of lessen voor 2 of 3 personen.',
              h: { en: 'ec001292', nl: 'ec001292' }
            },
            {
              es: 'Con cuota mensual o en clases sueltas.',
              en: 'Monthly fee or pay-as-you-go.',
              nl: 'Met maandelijks lesgeld of per losse les.',
              h: { en: 'ede4eb78', nl: 'ede4eb78' }
            },
            {
              es: 'Pregúntanos el precio y si hay hueco.',
              en: 'Ask us about prices and whether there\'s a slot.',
              nl: 'Vraag ons naar de prijs en of er plek is.',
              h: { en: '5cf7d6cf', nl: '5cf7d6cf' }
            }
          ]
        }
      },
      infantil: {
        verificado: '2026-09-30',
        fuente:     'cartel: Escuela infantil',
        titulo:  {
          es: 'Escuela infantil',
          en: 'Junior academy',
          nl: 'Kinderpadel',
          h: { en: '4c785545', nl: '4c785545' }
        },
        precio:  '40 €',
        unidad:  {
          es: 'por niño al mes',
          en: 'per child per month',
          nl: 'per kind per maand',
          h: { en: '310b274a', nl: '310b274a' }
        },
        detalle: [
          {
            es: 'Hasta los 12 años, incluidos.',
            en: 'Up to and including age 12.',
            nl: 'Tot en met 12 jaar.',
            h: { en: '6904ac08', nl: '6904ac08' }
          },
          {
            es: 'Una clase a la semana.',
            en: 'One lesson a week.',
            nl: 'Eén les per week.',
            h: { en: '2411c2c1', nl: '2411c2c1' }
          },
          {
            es: 'Máximo 6 niños por grupo.',
            en: 'Max. 6 children per group.',
            nl: 'Maximaal 6 kinderen per groep.',
            h: { en: '18f7892d', nl: '18f7892d' }
          }
        ]
      }
    },

    otrosServicios: {
      verificado: '2026-09-30',
      fuente:     'cartel: Clases y servicios',
      texto:      {
        es: 'Organizamos americanos, pools y eventos. El precio depende de cada evento.',
        en: 'We organise Americanos, pools and events. Prices vary by event.',
        nl: 'We organiseren americano\'s, pools en evenementen. De prijs verschilt per evenement.',
        h: { en: 'f275cdba', nl: 'f275cdba' }
      }
    },

    cancelaciones: {
      verificado: '2026-09-30',
      fuente:     'cartel: Política de cancelaciones; redacción nueva aprobada por el propietario el 2026-11-26',
      pistas: {
        titulo: { es: 'Reservas de pista', en: 'Court bookings', nl: 'Banen', h: { en: '67b2a51f', nl: '67b2a51f' } },
        items: [
          {
            es: 'Si tienes que cancelar, hazlo con 24 horas de antelación como mínimo.',
            en: 'If you need to cancel, please do so at least 24 hours in advance.',
            nl: 'Als je moet annuleren, doe dat dan minstens 24 uur van tevoren.',
            h: { en: '52c70235', nl: '52c70235' }
          },
          {
            es: 'Si cancelas más tarde, puede que no te devolvamos el dinero.',
            en: 'If you cancel later than that, you may not get a refund.',
            nl: 'Annuleer je later, dan krijg je je geld mogelijk niet terug.',
            h: { en: 'af88e81e', nl: 'af88e81e' }
          }
        ]
      },
      clases: {
        titulo: { es: 'Clases', en: 'Lessons', nl: 'Lessen', h: { en: '86bcee36', nl: '86bcee36' } },
        items: [
          {
            es: 'Clases particulares: si vas a cancelar, avisa con 24 horas de antelación.',
            en: 'Private lessons: if you need to cancel, please give us 24 hours\' notice.',
            nl: 'Privélessen: als je wilt annuleren, laat het dan 24 uur van tevoren weten.',
            h: { en: '1fb6e99b', nl: '1fb6e99b' }
          },
          {
            es: 'Clases en grupo y escuela infantil: la cuota mensual te guarda la plaza en tu grupo.',
            en: 'Group lessons and junior academy: the monthly fee holds your place in your group.',
            nl: 'Groepslessen en kinderpadel: met het maandelijkse lesgeld houd je je plek in je groep.',
            h: { en: '99939f9c', nl: '99939f9c' }
          },
          {
            es: 'Faltas a clase: si avisas con 24 horas y es tu única falta del mes, siempre intentaremos que la recuperes. Si faltas más veces, no te lo podemos asegurar.',
            en: 'Missed lessons: if you give us 24 hours\' notice and it\'s your only missed lesson that month, we\'ll always try to reschedule it. If you miss more, we can\'t promise this.',
            nl: 'Les missen: als je het 24 uur van tevoren laat weten en het je enige gemiste les van de maand is, proberen we altijd om die les in te halen. Mis je vaker, dan kunnen we dat niet beloven.',
            h: { en: '22d92f35', nl: '22d92f35' }
          },
          {
            es: 'Lluvia o clase suspendida por el club: la clase se recupera y, si no se puede, te la compensamos económicamente.',
            en: 'Rain or a lesson called off by the club: we\'ll reschedule it and, if we can\'t, we\'ll compensate you financially.',
            nl: 'Regen of les afgelast door de club: we halen de les in en als dat niet kan, krijg je een financiële vergoeding.',
            h: { en: '58ff2307', nl: '58ff2307' }
          },
          {
            es: 'Cambios de horario o de grupo: podemos hacerlos por motivos de organización, y siempre te avisaremos con antelación.',
            en: 'Timetable or group changes: we may make these for organisational reasons, and we\'ll always let you know in advance.',
            nl: 'Wijzigingen in lestijd of groep: die kunnen we om organisatorische redenen doorvoeren, en we laten het je altijd van tevoren weten.',
            h: { en: 'e3001e56', nl: 'e3001e56' }
          }
        ]
      },
      nota: {
        es: '¿Tienes dudas? Pregúntanos por WhatsApp o en recepción.',
        en: 'Any questions? Ask us on WhatsApp or at reception.',
        nl: 'Heb je vragen? Stel ze via WhatsApp of bij de receptie.',
        h: { en: 'ccb45207', nl: 'ccb45207' }
      }
    },

    /* Insignias reales (assets/pools/opt/<img>-240|480|720.avif + -480.jpg).
       Qué pools con insignia siguen en marcha: PENDIENTE_CLUB. Semanales
       son solo los del horario (cartel), con su propia verificación.
       nombre: el de la insignia (traducible); el alt y el reverso son
       «nombre · nombre del club» (render.js).
       color: muestreado de la palabra de la categoría de su imagen 720 px,
       04/10/2026. Es el único color que marca la categoría de cada insignia
       (aro y reverso). colorAro (solo la mixta): el de su aro, con el que
       se completa el degradado del aro. */
    pools: {
      verificado: '2026-09-30',
      fuente:     'cartel: Pools semanales',
      texto:      {
        es: 'Para apuntarte o preguntar, escríbenos por WhatsApp.',
        en: 'To sign up or ask a question, message us on WhatsApp.',
        nl: 'Wil je je aanmelden of iets vragen? Stuur ons een bericht via WhatsApp.',
        h: { en: '8a8769a2', nl: '8a8769a2' }
      },
      horario: {
        verificado: '2026-10-06',
        fuente:     'carteles del club en Instagram, confirmados por el club',
        titulo:     {
          es: 'Pools semanales',
          en: 'Weekly pools',
          nl: 'Wekelijkse pools',
          h: { en: '290b5e67', nl: '290b5e67' }
        },
        items: [
          { dia: { es: 'Martes', en: 'Tuesday', nl: 'Dinsdag', h: { en: 'fff8867b', nl: 'fff8867b' } },  hora: '20:00', pool: { es: 'Pool 4.ª masculina', en: 'Men\'s 4th cat. pool', nl: 'Pool 4e klasse heren', h: { en: '4e0dbccf', nl: '4e0dbccf' } }, pistas: { es: '4 pistas', en: '4 courts', nl: '4 banen', h: { en: 'a39c1084', nl: 'a39c1084' } } },
          { dia: { es: 'Jueves', en: 'Thursday', nl: 'Donderdag', h: { en: 'ca7b8cbc', nl: 'ca7b8cbc' } },  hora: '20:00', pool: { es: 'Pool 5.ª femenina', en: 'Women\'s 5th cat. pool', nl: 'Pool 5e klasse dames', h: { en: '5498e7a6', nl: '5498e7a6' } },  pistas: { es: '2 o 3 pistas', en: '2 or 3 courts', nl: '2 of 3 banen', h: { en: '72a080ed', nl: '72a080ed' } } },
          { dia: { es: 'Viernes', en: 'Friday', nl: 'Vrijdag', h: { en: '7e9a9f12', nl: '7e9a9f12' } }, hora: '20:00', pool: { es: 'Pool 4.ª masculina', en: 'Men\'s 4th cat. pool', nl: 'Pool 4e klasse heren', h: { en: '4e0dbccf', nl: '4e0dbccf' } }, pistas: { es: '4 pistas', en: '4 courts', nl: '4 banen', h: { en: 'a39c1084', nl: 'a39c1084' } } },
          { dia: { es: 'Domingo', en: 'Sunday', nl: 'Zondag', h: { en: '424e93aa', nl: '424e93aa' } }, hora: '09:30', pool: { es: 'Pool mixta', en: 'Mixed pool', nl: 'Pool gemengd', h: { en: 'a6b93a5d', nl: 'a6b93a5d' } },         pistas: { es: '3 o 4 pistas', en: '3 or 4 courts', nl: '3 of 4 banen', h: { en: 'bcc73c6b', nl: 'bcc73c6b' } } }
        ]
      },
      insignias: [
        { img: 'pool_snp_masculina', nombre: { es: 'Pool SNP masculina', en: 'Men\'s SNP pool', nl: 'Pool SNP heren', h: { en: 'e7e51bc4', nl: 'e7e51bc4' } }, color: '#957E6D' },
        { img: 'pool_snp_femenina',  nombre: { es: 'Pool SNP femenina', en: 'Women\'s SNP pool', nl: 'Pool SNP dames', h: { en: '734d65ea', nl: '734d65ea' } }, color: '#997E6D' },
        { img: 'pool_3a_masculina',  nombre: { es: 'Pool 3.ª masculina', en: 'Men\'s 3rd cat. pool', nl: 'Pool 3e klasse heren', h: { en: '15ba017d', nl: '15ba017d' } }, color: '#937C6A' },
        { img: 'pool_4a_masculina',  nombre: { es: 'Pool 4.ª masculina', en: 'Men\'s 4th cat. pool', nl: 'Pool 4e klasse heren', h: { en: '4e0dbccf', nl: '4e0dbccf' } }, color: '#947E6B' },
        { img: 'pool_4a_femenina',   nombre: { es: 'Pool 4.ª femenina', en: 'Women\'s 4th cat. pool', nl: 'Pool 4e klasse dames', h: { en: '5a11faaf', nl: '5a11faaf' } }, color: '#E27D93' },
        { img: 'pool_5a_masculina',  nombre: { es: 'Pool 5.ª masculina', en: 'Men\'s 5th cat. pool', nl: 'Pool 5e klasse heren', h: { en: '649c547c', nl: '649c547c' } }, color: '#8D7965' },
        { img: 'pool_5a_femenina',   nombre: { es: 'Pool 5.ª femenina', en: 'Women\'s 5th cat. pool', nl: 'Pool 5e klasse dames', h: { en: '5498e7a6', nl: '5498e7a6' } }, color: '#E38B9B' },
        { img: 'pool_mixta',         nombre: { es: 'Pool mixta', en: 'Mixed pool', nl: 'Pool gemengd', h: { en: 'a6b93a5d', nl: 'a6b93a5d' } }, color: '#945BA4', colorAro: '#7D72AB' },
        { img: 'pool_rocha',         nombre: { es: 'Pool Rocha', en: 'Rocha pool', nl: 'Pool Rocha', igual: ['nl'], h: { en: 'd3482be1', nl: 'd3482be1' } }, color: '#A49183' }
      ]
    },

    equipo: [
      { nombre: 'Lorena Vano', foto: '../assets/img/team-lorena.jpg', rol: PENDIENTE_CLUB, bio: PENDIENTE_CLUB },
      { nombre: 'Maripaz',     foto: null,                            rol: PENDIENTE_CLUB, bio: null }  /* sin bio: decidido */
    ],

    /* Sin nombres hasta tener la lista completa confirmada: una lista
       parcial no se publica, ni oculta (regla 10). */
    patrocinadores: {
      listaCompleta: false,
      items: []
    },

    /* «Colaborar con el club»: anuncio «Buscamos patrocinadores», con sus
       mismos datos y reescrito con el OK del propietario (26/11/2026).
       La disponibilidad de pistas caduca: tiene su propia verificación.
       contacto: {numero} se enlaza solo a WhatsApp (contacto.whatsapp);
       validar.js comprueba que es el mismo número. */
    colaborar: {
      verificado: '2026-10-07',
      fuente:     'anuncio de patrocinadores del club, enviado por el propietario; redacción nueva aprobada por él el 2026-11-26',
      titulo:     {
        es: 'Buscamos patrocinadores',
        en: 'We\'re looking for sponsors',
        nl: 'We zoeken sponsors',
        h: { en: '90f5fb61', nl: '90f5fb61' }
      },
      intro:      {
        es: 'Si tu empresa quiere unir su marca al deporte y formar parte del crecimiento del club, puedes colaborar con nosotros de varias formas.',
        en: 'If your business wants to associate its brand with sport and be part of the club\'s growth, there are several ways to partner with us.',
        nl: 'Wil jouw bedrijf zijn merk aan de sport koppelen en deel uitmaken van de groei van de club? Dan kun je op verschillende manieren met ons samenwerken.',
        h: { en: 'de92c611', nl: 'de92c611' }
      },
      opcionesTitulo: {
        es: 'Formas de colaborar',
        en: 'Ways to partner with us',
        nl: 'Manieren om samen te werken',
        h: { en: '9d4df925', nl: '9d4df925' }
      },
      opciones: [
        {
          es: 'Vestir a nuestros equipos de la Liga SNP y la Liga LAPI.',
          en: 'Kit out our Liga SNP and Liga LAPI teams.',
          nl: 'Onze teams in de Liga SNP en de Liga LAPI van teamkleding voorzien.',
          h: { en: 'c1c66307', nl: 'c1c66307' }
        },
        {
          es: 'Patrocinar una pista entera.',
          en: 'Sponsor a whole court.',
          nl: 'Een hele baan sponsoren.',
          h: { en: '19189fe0', nl: '19189fe0' }
        },
        {
          es: 'Poner vallas publicitarias que se ven desde el club y desde la carretera.',
          en: 'Put up advertising hoardings that can be seen from the club and from the road.',
          nl: 'Reclameborden plaatsen die zichtbaar zijn vanaf de club en vanaf de weg.',
          h: { en: 'bccb9c2c', nl: 'bccb9c2c' }
        },
        {
          es: 'Patrocinar torneos, eventos y actividades deportivas.',
          en: 'Sponsor tournaments, events and sports activities.',
          nl: 'Toernooien, evenementen en sportactiviteiten sponsoren.',
          h: { en: '9bc9854d', nl: '9bc9854d' }
        }
      ],
      disponibilidad: {
        verificado: '2026-10-07',
        fuente:     'anuncio de patrocinadores del club, enviado por el propietario',
        texto:      {
          es: 'Tres de nuestras cuatro pistas ya tienen patrocinador. Ahora mismo queda una libre para patrocinar.',
          en: 'Three of our four courts already have a sponsor. Right now, there\'s one left to sponsor.',
          nl: 'Drie van onze vier banen hebben al een sponsor. Op dit moment is er nog één baan vrij om te sponsoren.',
          h: { en: '7872204f', nl: '7872204f' }
        }
      },
      cierre:     {
        es: 'Vemos cada propuesta una a una, para que la colaboración merezca la pena para las dos partes.',
        en: 'We look at each proposal individually, so that the partnership is worth it for both sides.',
        nl: 'We bekijken elk voorstel afzonderlijk, zodat de samenwerking voor beide partijen de moeite waard is.',
        h: { en: 'c90eed88', nl: 'c90eed88' }
      },
      pregunta:   {
        es: '¿Te interesa colaborar con Eleva Pádel?',
        en: 'Interested in partnering with Eleva Pádel?',
        nl: 'Wil je samenwerken met Eleva Pádel?',
        h: { en: 'bd77be69', nl: 'bd77be69' }
      },
      contacto:   {
        es: 'Escríbenos por WhatsApp al {numero}.',
        en: 'Message us on WhatsApp: {numero}.',
        nl: 'Stuur ons een bericht via WhatsApp op {numero}.',
        h: { en: 'f5837b9f', nl: 'f5837b9f' }
      },
      numero:     '659 14 31 03'
    },

    /* Fotos reales: { base: '../assets/galeria/<nombre>', w, h, alt: { es } }
       con <base>-480.avif, -960.avif, -1440.avif y -960.jpg. Vacío = no se pinta. */
    galeria: [],

    /* Avisos con fecha de fin OBLIGATORIA (ISO con zona horaria):
       { id, titulo:{es}, texto:{es}, desde?, hasta, enlace?:{ url, texto:{es} } }
       Se pintan solo entre `desde` y `hasta`; sin `hasta` válido no se pintan.
       Nunca en el HTML estático ni en el JSON-LD. */
    eventos: []
  };
})();
