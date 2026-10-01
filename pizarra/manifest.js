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
   · Textos traducibles: { es, en, nl }. Si falta un idioma se usa `es`.
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

    contacto: {
      whatsapp:        '34659143103',          /* solo dígitos, con prefijo */
      whatsappDisplay: '+34 659 14 31 03',
      llamadas:        PENDIENTE_CLUB,         /* ¿atienden llamadas? sin confirmar: no hay enlaces tel: */
      instagram:       { url: 'https://instagram.com/elevapadelpizarra', handle: '@elevapadelpizarra' },
      comunidad:       'https://chat.whatsapp.com/EpKyuxIv74E2NWW1aBmPKE',
      reservas:        'https://vola.plus/app-link/club/1498',
      direccion:       'Pasaje Jerez s/n · 29560 Pizarra, Málaga',
      mapsUrl:         'https://maps.app.goo.gl/Zapc2bCKXtFfKwTw5',
      geo:             PENDIENTE_CLUB,         /* coordenadas: sin plano ni JSON-LD geo */
      mapImage:        PENDIENTE_CLUB,
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
      pistas:  PENDIENTE_CLUB,                 /* falta saber si el precio es por pista o por persona */
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
       Qué pools siguen en marcha y su horario: PENDIENTE_CLUB. */
    pools: {
      verificado: '2026-09-30',
      fuente:     'cartel: Pools semanales',
      texto:      { es: 'Información e inscripciones por WhatsApp.' },
      insignias: [
        { img: 'pool_snp_masculina', alt: 'Pool SNP masculina · Eleva Pádel Pizarra' },
        { img: 'pool_snp_femenina',  alt: 'Pool SNP femenina · Eleva Pádel Pizarra' },
        { img: 'pool_3a_masculina',  alt: 'Pool 3.ª masculina · Eleva Pádel Pizarra' },
        { img: 'pool_4a_masculina',  alt: 'Pool 4.ª masculina · Eleva Pádel Pizarra' },
        { img: 'pool_4a_femenina',   alt: 'Pool 4.ª femenina · Eleva Pádel Pizarra' },
        { img: 'pool_5a_masculina',  alt: 'Pool 5.ª masculina · Eleva Pádel Pizarra' },
        { img: 'pool_5a_femenina',   alt: 'Pool 5.ª femenina · Eleva Pádel Pizarra' },
        { img: 'pool_mixta',         alt: 'Pool mixta · Eleva Pádel Pizarra' },
        { img: 'pool_rocha',         alt: 'Pool Rocha · Eleva Pádel Pizarra' }
      ]
    },

    equipo: [
      { nombre: 'Lorena Vano', foto: '../assets/img/team-lorena.jpg', rol: PENDIENTE_CLUB, bio: PENDIENTE_CLUB },
      { nombre: 'Maripaz',     foto: null,                            rol: PENDIENTE_CLUB, bio: null }  /* sin bio: decidido */
    ],

    /* Resto de patrocinadores y tipo de colaboración: PENDIENTE_CLUB */
    patrocinadores: [
      { nombre: 'Bar Restaurante La Herradura', tipo: PENDIENTE_CLUB }
    ],

    colaborar: PENDIENTE_CLUB,                 /* bloque «Colaborar con el club»: no se pinta hasta confirmarlo */

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
