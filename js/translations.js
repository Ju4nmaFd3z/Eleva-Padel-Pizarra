/* =========================================================
   Textos de interfaz comunes · ES / EN / NL
   ---------------------------------------------------------
   Solo interfaz (menú, botones, rótulos, formulario). Los datos de
   cada club viven en su manifest. Las tres tablas tienen las mismas
   claves (tools/validar.js lo comprueba).
   ========================================================= */
(function () {
  'use strict';

  window.__ELEVA_I18N__ = {

    es: {
      skip: { link: 'Saltar al contenido principal' },
      nav: {
        ariaLabel: 'Navegación principal', overlayLabel: 'Menú de navegación',
        langLabel: 'Idioma', menuOpen: 'Abrir menú', menuClose: 'Cerrar menú',
        logoLabel: 'Eleva Pádel Pizarra, inicio', network: 'Eleva Pádel',
        club: 'El club', classes: 'Clases', pools: 'Pools',
        cancellations: 'Cancelaciones', contact: 'Contacto',
        book: 'Reservar', bookCourt: 'Reservar pista'
      },
      hero:    { ctaPrimary: 'Reservar pista', ctaCancel: 'Política de cancelaciones' },
      club:    { heading: 'El club', facilities: 'Instalaciones', bookings: 'Reservas', community: 'Comunidad' },
      classes: { heading: 'Clases', vat: 'Precios con IVA incluido.', cta: 'Consultar por WhatsApp' },
      pools:   { heading: 'Pools', cta: 'Consultar por WhatsApp' },
      other:   { heading: 'Otros servicios' },
      cancel:  { heading: 'Política de cancelaciones' },
      team:    { heading: 'Equipo' },
      sponsors:{ heading: 'Patrocinadores' },
      gallery: { heading: 'Fotos del club' },
      contact: {
        heading: 'Contacto',
        channels: 'Información y reservas por WhatsApp o en recepción.',
        address: 'Dirección', maps: 'Cómo llegar (Google Maps)',
        community: 'Comunidad', communityLink: 'Grupo de WhatsApp del club',
        formTitle: 'Escríbenos',
        labelName: 'Nombre', labelPhone: 'Teléfono', labelMessage: 'Mensaje',
        submit: 'Enviar por WhatsApp',
        formNote: 'Se abre WhatsApp con el mensaje escrito. Lo envías tú.',
        privacy: 'Tus datos solo viajan en ese mensaje. Más información en',
        errRequired: 'Rellena este campo.',
        errPhone: 'Escribe un teléfono válido (números, espacios o +).'
      },
      footer: {
        ariaLabel: 'Pie de página', contactTitle: 'Contacto', bookings: 'Reservas',
        navTitle: 'En esta página', legalLink: 'Aviso legal y privacidad',
        credit: 'Desarrollado por'
      },
      home: {
        logoLabel: 'Eleva Pádel, inicio',
        clubs: { heading: 'Clubes', visit: 'Ver el club' }
      },
      wa: {
        classes: 'Hola, quiero información sobre las clases.',
        pools:   'Hola, quiero información sobre los pools.',
        contact: 'Hola, os escribo desde la web.'
      }
    },

    en: {
      skip: { link: 'Skip to main content' },
      nav: {
        ariaLabel: 'Main navigation', overlayLabel: 'Navigation menu',
        langLabel: 'Language', menuOpen: 'Open menu', menuClose: 'Close menu',
        logoLabel: 'Eleva Pádel Pizarra, home', network: 'Eleva Pádel',
        club: 'The club', classes: 'Lessons', pools: 'Pools',
        cancellations: 'Cancellations', contact: 'Contact',
        book: 'Book', bookCourt: 'Book a court'
      },
      hero:    { ctaPrimary: 'Book a court', ctaCancel: 'Cancellation policy' },
      club:    { heading: 'The club', facilities: 'Facilities', bookings: 'Bookings', community: 'Community' },
      classes: { heading: 'Lessons', vat: 'Prices include VAT.', cta: 'Ask on WhatsApp' },
      pools:   { heading: 'Pools', cta: 'Ask on WhatsApp' },
      other:   { heading: 'Other services' },
      cancel:  { heading: 'Cancellation policy' },
      team:    { heading: 'Team' },
      sponsors:{ heading: 'Sponsors' },
      gallery: { heading: 'Club photos' },
      contact: {
        heading: 'Contact',
        channels: 'Information and bookings on WhatsApp or at reception.',
        address: 'Address', maps: 'Directions (Google Maps)',
        community: 'Community', communityLink: 'Club WhatsApp group',
        formTitle: 'Message us',
        labelName: 'Name', labelPhone: 'Phone', labelMessage: 'Message',
        submit: 'Send on WhatsApp',
        formNote: 'WhatsApp opens with your message ready. You send it.',
        privacy: 'Your details only travel in that message. More information in',
        errRequired: 'Please fill in this field.',
        errPhone: 'Enter a valid phone number (digits, spaces or +).'
      },
      footer: {
        ariaLabel: 'Footer', contactTitle: 'Contact', bookings: 'Bookings',
        navTitle: 'On this page', legalLink: 'Legal notice and privacy',
        credit: 'Developed by'
      },
      home: {
        logoLabel: 'Eleva Pádel, home',
        clubs: { heading: 'Clubs', visit: 'Visit the club' }
      },
      wa: {
        classes: 'Hi, I would like information about lessons.',
        pools:   'Hi, I would like information about the pools.',
        contact: 'Hi, I am writing from your website.'
      }
    },

    nl: {
      skip: { link: 'Naar de hoofdinhoud' },
      nav: {
        ariaLabel: 'Hoofdnavigatie', overlayLabel: 'Navigatiemenu',
        langLabel: 'Taal', menuOpen: 'Menu openen', menuClose: 'Menu sluiten',
        logoLabel: 'Eleva Pádel Pizarra, home', network: 'Eleva Pádel',
        club: 'De club', classes: 'Lessen', pools: 'Pools',
        cancellations: 'Annuleren', contact: 'Contact',
        book: 'Reserveren', bookCourt: 'Baan reserveren'
      },
      hero:    { ctaPrimary: 'Baan reserveren', ctaCancel: 'Annuleringsbeleid' },
      club:    { heading: 'De club', facilities: 'Faciliteiten', bookings: 'Reserveren', community: 'Community' },
      classes: { heading: 'Lessen', vat: 'Prijzen inclusief btw.', cta: 'Vraag het via WhatsApp' },
      pools:   { heading: 'Pools', cta: 'Vraag het via WhatsApp' },
      other:   { heading: 'Andere diensten' },
      cancel:  { heading: 'Annuleringsbeleid' },
      team:    { heading: 'Team' },
      sponsors:{ heading: 'Sponsors' },
      gallery: { heading: "Foto's van de club" },
      contact: {
        heading: 'Contact',
        channels: 'Informatie en reserveren via WhatsApp of bij de receptie.',
        address: 'Adres', maps: 'Routebeschrijving (Google Maps)',
        community: 'Community', communityLink: 'WhatsApp-groep van de club',
        formTitle: 'Stuur ons een bericht',
        labelName: 'Naam', labelPhone: 'Telefoon', labelMessage: 'Bericht',
        submit: 'Versturen via WhatsApp',
        formNote: 'WhatsApp opent met je bericht klaar. Jij verstuurt het.',
        privacy: 'Je gegevens gaan alleen mee in dat bericht. Meer informatie in',
        errRequired: 'Vul dit veld in.',
        errPhone: 'Vul een geldig telefoonnummer in (cijfers, spaties of +).'
      },
      footer: {
        ariaLabel: 'Voettekst', contactTitle: 'Contact', bookings: 'Reserveren',
        navTitle: 'Op deze pagina', legalLink: 'Juridische informatie en privacy',
        credit: 'Ontwikkeld door'
      },
      home: {
        logoLabel: 'Eleva Pádel, home',
        clubs: { heading: 'Clubs', visit: 'Naar de club' }
      },
      wa: {
        classes: 'Hallo, ik wil graag informatie over de lessen.',
        pools:   'Hallo, ik wil graag informatie over de pools.',
        contact: 'Hallo, ik schrijf jullie via de website.'
      }
    }
  };
})();
