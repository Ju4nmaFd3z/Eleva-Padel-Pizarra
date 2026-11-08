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
      geo:             { lat: 36.76933415706922, lng: -4.709440122747979, verificado: '2026-09-30', fuente: 'Juanma' },
      mapImage:        '../assets/maps/pizarra.svg',   /* generado con clubs/_plantilla/generar-mapa.js */
      horario:         PENDIENTE_CLUB
    },

    instalaciones: {
      verificado: '2026-09-30',
      fuente:     'cliente',
      items: [
        { es: '4 pistas exteriores de cristal' },
        { es: 'Iluminación LED' },
        { es: 'Zona chill-out' }
      ]
    },

    reservas: {
      verificado: '2026-09-30',
      fuente:     'cartel: Clases y servicios',
      canales:    { es: 'Por Vola, por WhatsApp o en recepción.' }
    },

    tarifas: {
      /* Tal cual el cartel: sin unidad añadida */
      pistas: {
        verificado: '2026-10-06',
        fuente:     'carteles del club en Instagram, confirmados por el club',
        tramos: [
          { cuando: { es: 'L–V hasta las 17:00 h' },
            precios: [ { duracion: '60 min', precio: '10 €' }, { duracion: '90 min', precio: '16 €' } ] },
          { cuando: { es: 'Desde las 17:00 h, fines de semana y festivos' },
            precios: [ { duracion: '60 min', precio: '15 €' }, { duracion: '90 min', precio: '22 €' } ] }
        ]
      },
      ivaIncluido: true,
      clases: {
        verificado: '2026-09-30',
        fuente:     'cartel: Clases y servicios',
        grupo: {
          titulo:  { es: 'Clases en grupo' },
          precio:  '60 €',
          unidad:  { es: 'por persona / mes' },
          detalle: [
            { es: 'Grupos de 4 personas.' },
            { es: 'Organizados por nivel y disponibilidad.' },
            { es: 'Plazas limitadas.' },
            { es: 'También en modalidad puntual (consultar).' }
          ]
        },
        otras: {
          titulo:  { es: 'Otras opciones' },
          detalle: [
            { es: 'Individual, 2 personas o 3 personas.' },
            { es: 'Modalidad mensual o puntual.' },
            { es: 'Consulta precio y disponibilidad.' }
          ]
        }
      },
      infantil: {
        verificado: '2026-09-30',
        fuente:     'cartel: Escuela infantil',
        titulo:  { es: 'Escuela infantil' },
        precio:  '40 €',
        unidad:  { es: 'por niño / mes' },
        detalle: [
          { es: 'Hasta 12 años.' },
          { es: '1 clase a la semana.' },
          { es: 'Máximo 6 niños por grupo.' }
        ]
      }
    },

    otrosServicios: {
      verificado: '2026-09-30',
      fuente:     'cartel: Clases y servicios',
      texto:      { es: 'Americanos, pools y eventos. Precio según evento.' }
    },

    cancelaciones: {
      verificado: '2026-09-30',
      fuente:     'cartel: Política de cancelaciones',
      pistas: {
        titulo: { es: 'Reservas de pista' },
        items: [
          { es: 'Las reservas deberán cancelarse con al menos 24 horas de antelación.' },
          { es: 'Las cancelaciones fuera de plazo podrán no ser reembolsadas.' }
        ]
      },
      clases: {
        titulo: { es: 'Clases' },
        items: [
          { es: 'Clases particulares: las cancelaciones deben avisarse con 24 horas de antelación.' },
          { es: 'Clases de grupo y escuela: la cuota mensual reserva la plaza en el grupo asignado.' },
          { es: 'Recuperación por ausencia: si se avisa con 24 horas y es la única ausencia del mes, se intentará siempre recuperar esa clase. Las ausencias adicionales no tienen recuperación garantizada.' },
          { es: 'Lluvia o imposibilidad del club: la clase será recuperada o compensada.' },
          { es: 'Cambios organizativos: el club podrá modificar horarios o grupos por motivos organizativos, avisando siempre con antelación.' }
        ]
      },
      nota: { es: 'Consulta cualquier duda por WhatsApp o en recepción.' }
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
      texto:      { es: 'Información e inscripciones por WhatsApp.' },
      horario: {
        verificado: '2026-10-06',
        fuente:     'carteles del club en Instagram, confirmados por el club',
        titulo:     { es: 'Pools semanales' },
        items: [
          { dia: { es: 'Martes' },  hora: '20:00', pool: { es: 'Pool 4.ª masculina' }, pistas: { es: '4 pistas' } },
          { dia: { es: 'Jueves' },  hora: '20:00', pool: { es: 'Pool 5.ª femenina' },  pistas: { es: '2 o 3 pistas' } },
          { dia: { es: 'Viernes' }, hora: '20:00', pool: { es: 'Pool 4.ª masculina' }, pistas: { es: '4 pistas' } },
          { dia: { es: 'Domingo' }, hora: '09:30', pool: { es: 'Pool mixta' },         pistas: { es: '3 o 4 pistas' } }
        ]
      },
      insignias: [
        { img: 'pool_snp_masculina', nombre: { es: 'Pool SNP masculina' }, color: '#957E6D' },
        { img: 'pool_snp_femenina',  nombre: { es: 'Pool SNP femenina' }, color: '#997E6D' },
        { img: 'pool_3a_masculina',  nombre: { es: 'Pool 3.ª masculina' }, color: '#937C6A' },
        { img: 'pool_4a_masculina',  nombre: { es: 'Pool 4.ª masculina' }, color: '#947E6B' },
        { img: 'pool_4a_femenina',   nombre: { es: 'Pool 4.ª femenina' }, color: '#E27D93' },
        { img: 'pool_5a_masculina',  nombre: { es: 'Pool 5.ª masculina' }, color: '#8D7965' },
        { img: 'pool_5a_femenina',   nombre: { es: 'Pool 5.ª femenina' }, color: '#E38B9B' },
        { img: 'pool_mixta',         nombre: { es: 'Pool mixta' }, color: '#945BA4', colorAro: '#7D72AB' },
        { img: 'pool_rocha',         nombre: { es: 'Pool Rocha' }, color: '#A49183' }
      ]
    },

    equipo: [
      { nombre: 'Lorena Vano', foto: '../assets/img/team-lorena.jpg', rol: PENDIENTE_CLUB, bio: PENDIENTE_CLUB },
      { nombre: 'Maripaz',     foto: null,                            rol: PENDIENTE_CLUB, bio: null }  /* sin bio: decidido */
    ],

    /* No se pinta hasta tener la lista completa confirmada (no se publica
       una lista parcial). Tipo de colaboración: PENDIENTE_CLUB. */
    patrocinadores: {
      listaCompleta: PENDIENTE_CLUB,
      items: [
        { nombre: 'Bar Restaurante La Herradura', tipo: PENDIENTE_CLUB }
      ]
    },

    /* «Colaborar con el club»: anuncio «Buscamos patrocinadores», literal.
       La disponibilidad de pistas caduca: tiene su propia verificación.
       contacto: {numero} se enlaza solo a WhatsApp (contacto.whatsapp);
       validar.js comprueba que es el mismo número. */
    colaborar: {
      verificado: '2026-10-07',
      fuente:     'anuncio de patrocinadores del club, enviado por el propietario',
      titulo:     { es: 'Buscamos patrocinadores' },
      intro:      { es: 'En Eleva Pádel abrimos nuevas posibilidades de colaboración para empresas que quieran vincular su marca al deporte y formar parte del crecimiento del club.' },
      opcionesTitulo: { es: 'Opciones disponibles' },
      opciones: [
        { es: 'Equipaciones de nuestros equipos de competición de Liga SNP y Liga LAPI.' },
        { es: 'Patrocinio de pistas completas.' },
        { es: 'Vallas publicitarias con visibilidad hacia el club y la carretera.' },
        { es: 'Torneos, eventos y actividades deportivas.' }
      ],
      disponibilidad: {
        verificado: '2026-10-07',
        fuente:     'anuncio de patrocinadores del club, enviado por el propietario',
        texto:      { es: 'Tres de nuestras cuatro pistas ya cuentan con patrocinador. Actualmente queda una única pista disponible para nuevas colaboraciones.' }
      },
      cierre:     { es: 'Estudiaremos cada propuesta de forma personalizada, buscando una colaboración que aporte valor a ambas partes.' },
      pregunta:   { es: '¿Te interesa colaborar con Eleva Pádel?' },
      contacto:   { es: 'Contacta con nosotros en el {numero}.' },
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
