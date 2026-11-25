/* =========================================================
   Textos de interfaz · ES / EN / NL (una sola fuente por texto)
   ---------------------------------------------------------
   Solo interfaz (menú, botones, rótulos, formulario, <head>, 404 y
   mantenimiento). Los datos de cada club viven en su manifest con el
   mismo formato.

   Cada clave: { es, en, nl, h: { en, nl } }
   · h = huella del español del que salió cada traducción (tools/i18n.js).
     Si el español cambia, validar.js marca la traducción desfasada y falla.
   · Sin en/nl: traducción pendiente. El navegador pinta el español con
     lang="es" (nunca como si fuera inglés o neerlandés) y validar.js lo avisa.
   · soloEs: true → solo en español a propósito (og:*, ver CLAUDE.md).
   · igual: ['en', 'nl'] → la traducción es igual al español a propósito
     («Pools»). Sin la marca, una traducción que copia el español es error
     de validar.js (salvo si es neutra: nombres propios, cifras…).
   · {codigo}: el código del idioma activo (ES, EN, NL).
   · Marcado en línea (solo en los textos que se pintan con
     data-i18n-html, p. ej. los de la página legal, js/legal-textos.js):
     **negrita**, `código` y [texto](destino), con destino #ancla,
     página.html[#ancla] o https://… (externo: pestaña nueva). enLinea()
     lo convierte en HTML; todo lo demás se escapa.
   El HTML en español de cada página lo escribe tools/generar.js desde aquí
   (data-i18n, data-i18n-attr, data-i18n-fijo): no se edita a mano.

   NOMBRES_PROPIOS: no se traducen nunca. La misma lista va en CLAUDE.md
   (validar.js comprueba que coinciden).
   ========================================================= */
(function (root) {
  'use strict';

  var NOMBRES_PROPIOS = [
    'Eleva Pádel Pizarra', 'Eleva Pádel', 'WhatsApp', 'Instagram', 'Vola',
    'Biznaga Consulting', 'OpenStreetMap',
    'Google Maps', 'Pizarra', 'Málaga', 'Pasaje Jerez s/n', '@elevapadelpizarra',
    'Lorena Vano', 'Maripaz', 'Liga SNP', 'Liga LAPI',
    'SNP', 'Series Nacionales de Pádel', 'Rocha',
    'Vercel Inc.', 'Meta Platforms Ireland Ltd.', 'WhatsApp Ireland Limited',
    'Español', 'English', 'Nederlands'
  ];

  var TEXTOS = {
    'skip.link': { es: 'Ir al contenido', en: 'Skip to content', nl: 'Naar de inhoud', h: { en: 'bb2b678a', nl: 'bb2b678a' } },

    'nav.ariaLabel': { es: 'Menú principal', en: 'Main menu', nl: 'Hoofdmenu', h: { en: '1e9c027c', nl: '1e9c027c' } },
    'nav.langLabel': { es: 'Idioma: {codigo}', en: 'Language: {codigo}', nl: 'Taal: {codigo}', h: { en: '131faa99', nl: '131faa99' } },
    'nav.menuOpen': { es: 'Abrir menú', en: 'Open menu', nl: 'Menu openen', h: { en: '1a7de9bc', nl: '1a7de9bc' } },
    'nav.menuClose': { es: 'Cerrar menú', en: 'Close menu', nl: 'Menu sluiten', h: { en: 'f296f95a', nl: 'f296f95a' } },
    'nav.logoLabel': { es: 'Eleva Pádel Pizarra, inicio', en: 'Eleva Pádel Pizarra, home', nl: 'Eleva Pádel Pizarra, startpagina', h: { en: '7dd1283a', nl: '7dd1283a' } },
    'nav.network': { es: 'Eleva Pádel', en: 'Eleva Pádel', nl: 'Eleva Pádel', h: { en: 'c3ff5107', nl: 'c3ff5107' } },
    'nav.club': { es: 'El club', en: 'The club', nl: 'De club', h: { en: '6921d1f3', nl: '6921d1f3' } },
    'nav.classes': { es: 'Clases', en: 'Lessons', nl: 'Lessen', h: { en: '86bcee36', nl: '86bcee36' } },
    'nav.pools': { es: 'Pools', en: 'Pools', nl: 'Pools', igual: ['en', 'nl'], h: { en: 'd46fbd72', nl: 'd46fbd72' } },
    'nav.cancellations': { es: 'Cancelaciones', en: 'Cancellations', nl: 'Annuleren', h: { en: 'f0f88b82', nl: 'f0f88b82' } },
    'nav.collab': { es: 'Colaborar', en: 'Partnerships', nl: 'Samenwerken', h: { en: '969eae1e', nl: '969eae1e' } },
    'nav.contact': { es: 'Contacto', en: 'Contact', nl: 'Contact', h: { en: '771b96b0', nl: '771b96b0' } },
    'nav.book': { es: 'Reservar', en: 'Book', nl: 'Reserveren', h: { en: 'f1445c5e', nl: 'f1445c5e' } },

    'hero.ctaPrimary': { es: 'Reservar pista', en: 'Book a court', nl: 'Baan reserveren', h: { en: '471c0363', nl: '471c0363' } },
    'hero.ctaCancel': { es: 'Cómo cancelar', en: 'How to cancel', nl: 'Zo annuleer je', h: { en: '29020f80', nl: '29020f80' } },

    'club.heading': { es: 'El club', en: 'The club', nl: 'De club', h: { en: '6921d1f3', nl: '6921d1f3' } },
    'club.facilities': { es: 'Instalaciones', en: 'Facilities', nl: 'Faciliteiten', h: { en: 'b6fd0e49', nl: 'b6fd0e49' } },
    'club.hours': { es: 'Horario', en: 'Opening hours', nl: 'Openingstijden', h: { en: 'c9405caa', nl: 'c9405caa' } },
    'club.bookings': { es: 'Reservas', en: 'Bookings', nl: 'Reserveren', h: { en: '52d37013', nl: '52d37013' } },
    'club.bookOnline': { es: 'Reservar en Vola', en: 'Book on Vola', nl: 'Reserveren via Vola', h: { en: '41b60b7b', nl: '41b60b7b' } },
    'club.community': { es: 'Comunidad', en: 'Community', nl: 'Community', h: { en: '97060b8c', nl: '97060b8c' } },
    'club.rates': { es: 'Tarifas de pista', en: 'Court hire', nl: 'Baantarieven', h: { en: 'b76f35fe', nl: 'b76f35fe' } },
    'club.ratesPerCourtVat': { es: 'Precios por pista, con IVA incluido.', en: 'Prices are per court and include VAT.', nl: 'Prijzen per baan, inclusief btw.', h: { en: 'f89c4bf3', nl: 'f89c4bf3' } },

    'classes.heading': { es: 'Clases', en: 'Lessons', nl: 'Lessen', h: { en: '86bcee36', nl: '86bcee36' } },
    'classes.vat': { es: 'Precios con IVA incluido.', en: 'Prices include VAT.', nl: 'Prijzen inclusief btw.', h: { en: '814e7dfb', nl: '814e7dfb' } },
    'classes.cta': { es: 'Pregunta por WhatsApp', en: 'Ask us on WhatsApp', nl: 'Vraag het via WhatsApp', h: { en: '37ea6025', nl: '37ea6025' } },

    'pools.heading': { es: 'Pools', en: 'Pools', nl: 'Pools', igual: ['en', 'nl'], h: { en: 'd46fbd72', nl: 'd46fbd72' } },
    'pools.cta': { es: 'Pregunta por WhatsApp', en: 'Ask us on WhatsApp', nl: 'Vraag het via WhatsApp', h: { en: '37ea6025', nl: '37ea6025' } },

    'other.heading': { es: 'Otros servicios', en: 'Other services', nl: 'Overige diensten', h: { en: 'f0fdfba1', nl: 'f0fdfba1' } },

    'cancel.heading': { es: 'Cancelaciones', en: 'Cancellations', nl: 'Annuleren', h: { en: 'f0f88b82', nl: 'f0f88b82' } },

    'team.heading': { es: 'Equipo', en: 'Team', nl: 'Team', h: { en: 'c2944675', nl: 'c2944675' } },

    'sponsors.heading': { es: 'Patrocinadores', en: 'Sponsors', nl: 'Sponsors', h: { en: '84a69fbb', nl: '84a69fbb' } },

    'collab.cta': { es: 'Pregunta por WhatsApp', en: 'Ask us on WhatsApp', nl: 'Vraag het via WhatsApp', h: { en: '37ea6025', nl: '37ea6025' } },

    'gallery.heading': { es: 'Fotos del club', en: 'Club photos', nl: 'Foto\'s van de club', h: { en: '34935568', nl: '34935568' } },

    'contact.heading': { es: 'Contacto', en: 'Contact', nl: 'Contact', h: { en: '771b96b0', nl: '771b96b0' } },
    'contact.channels': { es: 'Para preguntar o reservar, escríbenos por WhatsApp o pásate por recepción.', en: 'To ask a question or book, message us on WhatsApp or pop into reception.', nl: 'Wil je iets vragen of reserveren? Stuur ons een bericht via WhatsApp of kom langs bij de receptie.', h: { en: 'b753b85c', nl: 'b753b85c' } },
    'contact.address': { es: 'Dirección', en: 'Address', nl: 'Adres', h: { en: '2af66cb6', nl: '2af66cb6' } },
    'contact.maps': { es: 'Cómo llegar en Google Maps', en: 'Get directions on Google Maps', nl: 'Routebeschrijving in Google Maps', h: { en: '10b7ffd1', nl: '10b7ffd1' } },
    'contact.mapAlt': { es: 'Plano de la zona del club', en: 'Map of the area around the club', nl: 'Kaart van de omgeving van de club', h: { en: '600d17c3', nl: '600d17c3' } },
    'contact.community': { es: 'Comunidad', en: 'Community', nl: 'Community', h: { en: '97060b8c', nl: '97060b8c' } },
    'contact.communityLink': { es: 'Únete al grupo de WhatsApp', en: 'Join the WhatsApp group', nl: 'Kom in de WhatsApp-groep', h: { en: '083453b6', nl: '083453b6' } },
    'contact.formTitle': { es: 'Escríbenos', en: 'Message us', nl: 'Stuur ons een bericht', h: { en: 'e9c82906', nl: 'e9c82906' } },
    'contact.labelName': { es: 'Nombre', en: 'Name', nl: 'Naam', h: { en: '562bb157', nl: '562bb157' } },
    'contact.labelPhone': { es: 'Teléfono', en: 'Phone', nl: 'Telefoon', h: { en: 'f1186abd', nl: 'f1186abd' } },
    'contact.labelMessage': { es: 'Mensaje', en: 'Message', nl: 'Bericht', h: { en: 'd2af3171', nl: 'd2af3171' } },
    'contact.submit': { es: 'Enviar por WhatsApp', en: 'Send on WhatsApp', nl: 'Versturen via WhatsApp', h: { en: 'b2acd5e9', nl: 'b2acd5e9' } },
    'contact.formNote': { es: 'Al pulsar, se abre WhatsApp con tu mensaje ya escrito y lo envías tú.', en: 'This opens WhatsApp with your message filled in. You send it yourself.', nl: 'Als je klikt, opent WhatsApp met je bericht al ingevuld en dan verstuur je het zelf.', h: { en: 'cb10ed41', nl: 'cb10ed41' } },
    'contact.privacy': { es: 'Tus datos solo van en ese mensaje. Más información en', en: 'Your details are only sent in that message. More information:', nl: 'Je gegevens worden alleen in dat bericht verstuurd. Lees er meer over in', h: { en: 'a17b07eb', nl: 'a17b07eb' } },
    'contact.errRequired': { es: 'Rellena este campo.', en: 'Please fill in this field.', nl: 'Vul dit veld in.', h: { en: 'bd64537e', nl: 'bd64537e' } },
    'contact.errPhone': { es: 'Escribe un teléfono válido: solo números, espacios o +.', en: 'Please enter a valid phone number: digits, spaces or + only.', nl: 'Vul een geldig telefoonnummer in: alleen cijfers, spaties of +.', h: { en: 'd8c5d74e', nl: 'd8c5d74e' } },

    'footer.ariaLabel': { es: 'Pie de página', en: 'Footer', nl: 'Voettekst', h: { en: '6218e8d3', nl: '6218e8d3' } },
    'footer.contactTitle': { es: 'Contacto', en: 'Contact', nl: 'Contact', h: { en: '771b96b0', nl: '771b96b0' } },
    'footer.bookings': { es: 'Reservas', en: 'Bookings', nl: 'Reserveren', h: { en: '52d37013', nl: '52d37013' } },
    'footer.navTitle': { es: 'En esta página', en: 'On this page', nl: 'Op deze pagina', h: { en: 'a4847f7c', nl: 'a4847f7c' } },
    'footer.legalLink': { es: 'Aviso legal y privacidad', en: 'Legal notice and privacy', nl: 'Juridische informatie en privacy', h: { en: '32a29679', nl: '32a29679' } },
    'footer.credit': { es: 'Web hecha por', en: 'Website by', nl: 'Website gemaakt door', h: { en: 'df682e08', nl: 'df682e08' } },

    'home.logoLabel': { es: 'Eleva Pádel, inicio', en: 'Eleva Pádel, home', nl: 'Eleva Pádel, startpagina', h: { en: 'a8807cf1', nl: 'a8807cf1' } },
    'home.clubs.heading': { es: 'Clubes', en: 'Clubs', nl: 'Clubs', h: { en: '656b4c40', nl: '656b4c40' } },
    'home.clubs.visit': { es: 'Ver el club', en: 'View club', nl: 'Naar de club', h: { en: '491f15f6', nl: '491f15f6' } },

    'wa.classes': { es: 'Hola, quiero información sobre las clases.', en: 'Hi, I\'d like some information about the lessons.', nl: 'Hallo, ik wil graag informatie over de lessen.', h: { en: 'c008d96f', nl: 'c008d96f' } },
    'wa.pools': { es: 'Hola, quiero información sobre las pools.', en: 'Hi, I\'d like some information about the pools.', nl: 'Hallo, ik wil graag informatie over de pools.', h: { en: 'b823631e', nl: 'b823631e' } },
    'wa.collab': { es: 'Hola, me interesa colaborar con el club.', en: 'Hi, I\'m interested in partnering with the club.', nl: 'Hallo, ik heb interesse in een samenwerking met de club.', h: { en: 'c5c09f7c', nl: 'c5c09f7c' } },
    'wa.contact': { es: 'Hola, os escribo desde la web.', en: 'Hi, I\'m messaging you from your website.', nl: 'Hallo, ik stuur jullie een bericht via de website.', h: { en: 'dc3a688e', nl: 'dc3a688e' } },

    /* <head>: <title> y meta description se traducen; og:* y JSON-LD van
       siempre en español (una URL = una ficha para buscadores y vistas previas) */
    'meta.marca.description': { es: 'Web de Eleva Pádel y de su club en Pizarra, Málaga.', en: 'The website of Eleva Pádel and its club in Pizarra, Málaga.', nl: 'Website van Eleva Pádel en de club in Pizarra, Málaga.', h: { en: '72483b2e', nl: '72483b2e' } },
    'meta.pizarra.title': { es: 'Eleva Pádel Pizarra, club de pádel en Pizarra', en: 'Eleva Pádel Pizarra, padel club in Pizarra', nl: 'Eleva Pádel Pizarra, padelclub in Pizarra', h: { en: 'b6a6dfb6', nl: 'b6a6dfb6' } },
    'meta.pizarra.description': { es: 'Club de pádel en Pizarra, Málaga, con 4 pistas exteriores de cristal, iluminación LED y zona chill-out. Reserva por Vola, por WhatsApp o en recepción.', en: 'Padel club in Pizarra, Málaga, with 4 outdoor glass courts, LED lighting and a chill-out area. Book on Vola, on WhatsApp or at reception.', nl: 'Padelclub in Pizarra, Málaga, met 4 glazen buitenbanen, ledverlichting en een chill-outzone. Reserveer via Vola, via WhatsApp of bij de receptie.', h: { en: 'ecfbfb9a', nl: 'ecfbfb9a' } },
    'meta.pizarra.ogDescription': { es: '4 pistas exteriores de cristal, iluminación LED y zona chill-out en Pizarra, Málaga.', soloEs: true },
    'meta.pizarra.ogImageAlt': { es: 'Jugador de pádel golpeando la bola', soloEs: true },

    /* Página 404 */
    'e404.title': { es: 'Página no encontrada | Eleva Pádel', en: 'Page not found | Eleva Pádel', nl: 'Pagina niet gevonden | Eleva Pádel', h: { en: '11e99795', nl: '11e99795' } },
    'e404.heading': { es: 'Esta página no existe', en: 'This page doesn\'t exist', nl: 'Deze pagina bestaat niet', h: { en: '1f542831', nl: '1f542831' } },
    'e404.text': { es: 'Puede que el enlace esté mal escrito o que la página ya no exista. Desde aquí puedes ir al club o a Eleva Pádel.', en: 'The link may be mistyped, or the page may no longer exist. From here you can go to the club or to Eleva Pádel.', nl: 'Misschien is de link verkeerd getypt of bestaat de pagina niet meer. Vanaf hier kun je naar de club of naar Eleva Pádel.', h: { en: '8b837b71', nl: '8b837b71' } },

    /* Página de mantenimiento (middleware.js) */
    'maint.text': { es: 'Estamos haciendo cambios en la web. Mientras tanto, escríbenos por WhatsApp o por Instagram.', en: 'We\'re making some changes to the website. In the meantime, message us on WhatsApp or Instagram.', nl: 'We zijn de website aan het aanpassen. Stuur ons in de tussentijd een bericht via WhatsApp of Instagram.', h: { en: '571a8d76', nl: '571a8d76' } },
    'maint.logoAlt': { es: 'Logo de Eleva Pádel', en: 'Eleva Pádel logo', nl: 'Logo van Eleva Pádel', h: { en: '58e55177', nl: '58e55177' } }
  };

  /* Marcado en línea → HTML. El texto se escapa entero y solo se
     convierten **…**, `…` y [texto](destino) con un destino permitido:
     cualquier otra cosa queda como texto. La misma función pinta el HTML
     generado (tools/generar.js) y el del navegador (js/main.js): al volver
     al español el DOM queda idéntico. */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  var DESTINO = /^(#[a-z0-9-]+|[a-z0-9-]+(\/[a-z0-9-]+)*\.html(#[a-z0-9-]+)?|https:\/\/[^\s"<>()]+)$/i;
  function enLinea(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, t, d) {
        if (!DESTINO.test(d)) return m;
        var fuera = d.indexOf('https://') === 0;
        return '<a href="' + d + '"' + (fuera ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + t + '</a>';
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  var api = { textos: TEXTOS, nombresPropios: NOMBRES_PROPIOS, enLinea: enLinea };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ElevaTextos = api;
})(this);
