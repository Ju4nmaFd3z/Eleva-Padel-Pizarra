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
            es: 'por persona / mes',
            en: 'per person / month',
            nl: 'per persoon / maand',
            h: { en: '00ed7119', nl: '00ed7119' }
          },
          detalle: [
            {
              es: 'Grupos de 4 personas.',
              en: 'Groups of 4 people.',
              nl: 'Groepen van 4 personen.',
              h: { en: 'ccf75512', nl: 'ccf75512' }
            },
            {
              es: 'Organizados por nivel y disponibilidad.',
              en: 'Arranged by level and availability.',
              nl: 'Ingedeeld op niveau en beschikbaarheid.',
              h: { en: '364c932f', nl: '364c932f' }
            },
            {
              es: 'Plazas limitadas.',
              en: 'Limited places.',
              nl: 'Beperkt aantal plaatsen.',
              h: { en: '942e65ef', nl: '942e65ef' }
            },
            {
              es: 'También en modalidad puntual (consultar).',
              en: 'Also available pay-as-you-go (just ask).',
              nl: 'Ook als losse les (vraag ernaar).',
              h: { en: '2068bbcc', nl: '2068bbcc' }
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
              es: 'Individual, 2 personas o 3 personas.',
              en: 'One-to-one, 2 people or 3 people.',
              nl: 'Individueel, met 2 of 3 personen.',
              h: { en: '8205ba15', nl: '8205ba15' }
            },
            {
              es: 'Modalidad mensual o puntual.',
              en: 'Monthly or pay-as-you-go.',
              nl: 'Per maand of per losse les.',
              h: { en: '2ee2158e', nl: '2ee2158e' }
            },
            {
              es: 'Consulta precio y disponibilidad.',
              en: 'Ask about price and availability.',
              nl: 'Vraag naar prijs en beschikbaarheid.',
              h: { en: 'fdfbadff', nl: 'fdfbadff' }
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
          es: 'por niño / mes',
          en: 'per child / month',
          nl: 'per kind / maand',
          h: { en: '1a37d258', nl: '1a37d258' }
        },
        detalle: [
          {
            es: 'Hasta 12 años.',
            en: 'Up to age 12.',
            nl: 'Tot 12 jaar.',
            h: { en: '76a57371', nl: '76a57371' }
          },
          {
            es: '1 clase a la semana.',
            en: '1 lesson a week.',
            nl: '1 les per week.',
            h: { en: '40ea1fac', nl: '40ea1fac' }
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
        es: 'Americanos, pools y eventos. Precio según evento.',
        en: 'Americanos, pools and events. Prices vary by event.',
        nl: 'Americano\'s, pools en evenementen. Prijs afhankelijk van het evenement.',
        h: { en: 'd64b7673', nl: 'd64b7673' }
      }
    },

    cancelaciones: {
      verificado: '2026-09-30',
      fuente:     'cartel: Política de cancelaciones',
      pistas: {
        titulo: { es: 'Reservas de pista', en: 'Court bookings', nl: 'Banen', h: { en: '67b2a51f', nl: '67b2a51f' } },
        items: [
          {
            es: 'Las reservas deberán cancelarse con al menos 24 horas de antelación.',
            en: 'Bookings must be cancelled at least 24 hours in advance.',
            nl: 'Reserveringen moeten minstens 24 uur van tevoren worden geannuleerd.',
            h: { en: 'e8c1e32b', nl: 'e8c1e32b' }
          },
          {
            es: 'Las cancelaciones fuera de plazo podrán no ser reembolsadas.',
            en: 'Late cancellations may not be refunded.',
            nl: 'Te late annuleringen worden mogelijk niet terugbetaald.',
            h: { en: '2dd8b671', nl: '2dd8b671' }
          }
        ]
      },
      clases: {
        titulo: { es: 'Clases', en: 'Lessons', nl: 'Lessen', h: { en: '86bcee36', nl: '86bcee36' } },
        items: [
          {
            es: 'Clases particulares: las cancelaciones deben avisarse con 24 horas de antelación.',
            en: 'Private lessons: cancellations must be made with 24 hours\' notice.',
            nl: 'Privélessen: annuleringen moeten 24 uur van tevoren worden doorgegeven.',
            h: { en: '80afd8c1', nl: '80afd8c1' }
          },
          {
            es: 'Clases de grupo y escuela: la cuota mensual reserva la plaza en el grupo asignado.',
            en: 'Group lessons and junior academy: the monthly fee holds your place in the group you\'ve been assigned.',
            nl: 'Groepslessen en kinderpadel: het maandelijkse lesgeld reserveert je plek in de groep waarin je bent ingedeeld.',
            h: { en: '6255f99f', nl: '6255f99f' }
          },
          {
            es: 'Recuperación por ausencia: si se avisa con 24 horas y es la única ausencia del mes, se intentará siempre recuperar esa clase. Las ausencias adicionales no tienen recuperación garantizada.',
            en: 'Missed lessons: if you give 24 hours\' notice and it\'s your only absence that month, we\'ll always try to reschedule that lesson. Rescheduling isn\'t guaranteed for any further absences.',
            nl: 'Inhalen bij afwezigheid: als je het 24 uur van tevoren doorgeeft en het je enige afwezigheid van die maand is, proberen we die les altijd in te halen. Voor extra afwezigheden is inhalen niet gegarandeerd.',
            h: { en: '290e71d7', nl: '290e71d7' }
          },
          {
            es: 'Lluvia o imposibilidad del club: la clase será recuperada o compensada.',
            en: 'Rain, or if the club can\'t hold the lesson: it will be rescheduled or compensated for.',
            nl: 'Regen of als de club verhinderd is: de les wordt ingehaald of gecompenseerd.',
            h: { en: '51f35503', nl: '51f35503' }
          },
          {
            es: 'Cambios organizativos: el club podrá modificar horarios o grupos por motivos organizativos, avisando siempre con antelación.',
            en: 'Organisational changes: the club may change times or groups for organisational reasons, always with advance notice.',
            nl: 'Organisatorische wijzigingen: de club kan om organisatorische redenen tijden of groepen aanpassen en laat dat altijd van tevoren weten.',
            h: { en: '07e8efb4', nl: '07e8efb4' }
          }
        ]
      },
      nota: {
        es: 'Consulta cualquier duda por WhatsApp o en recepción.',
        en: 'Any questions? Ask us on WhatsApp or at reception.',
        nl: 'Met vragen kun je terecht via WhatsApp of bij de receptie.',
        h: { en: '1c8e929b', nl: '1c8e929b' }
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
        es: 'Información e inscripciones por WhatsApp.',
        en: 'Information and sign-ups on WhatsApp.',
        nl: 'Informatie en inschrijven via WhatsApp.',
        h: { en: '45d39ca1', nl: '45d39ca1' }
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
        { img: 'pool_rocha',         nombre: { es: 'Pool Rocha', en: 'Rocha pool', nl: 'Pool Rocha', h: { en: 'd3482be1', nl: 'd3482be1' } }, color: '#A49183' }
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

    /* «Colaborar con el club»: anuncio «Buscamos patrocinadores», literal.
       La disponibilidad de pistas caduca: tiene su propia verificación.
       contacto: {numero} se enlaza solo a WhatsApp (contacto.whatsapp);
       validar.js comprueba que es el mismo número. */
    colaborar: {
      verificado: '2026-10-07',
      fuente:     'anuncio de patrocinadores del club, enviado por el propietario',
      titulo:     {
        es: 'Buscamos patrocinadores',
        en: 'We\'re looking for sponsors',
        nl: 'We zoeken sponsors',
        h: { en: '90f5fb61', nl: '90f5fb61' }
      },
      intro:      {
        es: 'En Eleva Pádel abrimos nuevas posibilidades de colaboración para empresas que quieran vincular su marca al deporte y formar parte del crecimiento del club.',
        en: 'At Eleva Pádel we\'re opening up new ways to partner with businesses that want to associate their brand with sport and be part of the club\'s growth.',
        nl: 'Bij Eleva Pádel bieden we nieuwe mogelijkheden tot samenwerking voor bedrijven die hun merk willen verbinden aan de sport en deel willen uitmaken van de groei van de club.',
        h: { en: '6ce22777', nl: '6ce22777' }
      },
      opcionesTitulo: {
        es: 'Opciones disponibles',
        en: 'Available options',
        nl: 'Beschikbare opties',
        h: { en: '0cd0180a', nl: '0cd0180a' }
      },
      opciones: [
        {
          es: 'Equipaciones de nuestros equipos de competición de Liga SNP y Liga LAPI.',
          en: 'Kit for our competition teams in Liga SNP and Liga LAPI.',
          nl: 'Teamkleding voor onze competitieteams in de Liga SNP en de Liga LAPI.',
          h: { en: '21c15f38', nl: '21c15f38' }
        },
        {
          es: 'Patrocinio de pistas completas.',
          en: 'Sponsorship of whole courts.',
          nl: 'Sponsoring van hele banen.',
          h: { en: '747907ca', nl: '747907ca' }
        },
        {
          es: 'Vallas publicitarias con visibilidad hacia el club y la carretera.',
          en: 'Advertising hoardings visible from the club and the road.',
          nl: 'Reclameborden die zichtbaar zijn vanaf de club en vanaf de weg.',
          h: { en: 'f0ab1b73', nl: 'f0ab1b73' }
        },
        {
          es: 'Torneos, eventos y actividades deportivas.',
          en: 'Tournaments, events and sports activities.',
          nl: 'Toernooien, evenementen en sportactiviteiten.',
          h: { en: 'fc35d2a3', nl: 'fc35d2a3' }
        }
      ],
      disponibilidad: {
        verificado: '2026-10-07',
        fuente:     'anuncio de patrocinadores del club, enviado por el propietario',
        texto:      {
          es: 'Tres de nuestras cuatro pistas ya cuentan con patrocinador. Actualmente queda una única pista disponible para nuevas colaboraciones.',
          en: 'Three of our four courts already have a sponsor. There is currently just one court left for new partnerships.',
          nl: 'Drie van onze vier banen hebben al een sponsor. Op dit moment is er nog één baan beschikbaar voor nieuwe samenwerkingen.',
          h: { en: '48c282a8', nl: '48c282a8' }
        }
      },
      cierre:     {
        es: 'Estudiaremos cada propuesta de forma personalizada, buscando una colaboración que aporte valor a ambas partes.',
        en: 'We\'ll look at each proposal individually, aiming for a partnership that benefits both sides.',
        nl: 'We bekijken elk voorstel persoonlijk en zoeken naar een samenwerking waar beide partijen iets aan hebben.',
        h: { en: '514a1784', nl: '514a1784' }
      },
      pregunta:   {
        es: '¿Te interesa colaborar con Eleva Pádel?',
        en: 'Interested in partnering with Eleva Pádel?',
        nl: 'Wil je samenwerken met Eleva Pádel?',
        h: { en: 'bd77be69', nl: 'bd77be69' }
      },
      contacto:   {
        es: 'Contacta con nosotros en el {numero}.',
        en: 'Get in touch on {numero}.',
        nl: 'Neem contact met ons op via {numero}.',
        h: { en: '506df2f4', nl: '506df2f4' }
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
