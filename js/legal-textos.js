/* =========================================================
   Textos de la página legal (/privacidad) · ES / EN / NL
   ---------------------------------------------------------
   Mismo formato que js/translations.js: { es, en, nl, h: { en, nl } }.
   Archivo propio para no cargar estos textos en las demás páginas: en el
   navegador se suman a window.ElevaTextos (va después de translations.js);
   las herramientas los leen con tools/i18n.js (todosLosTextos).

   La versión que vale legalmente es la española. Las traducciones al
   inglés y al neerlandés (traductor y revisor por idioma) son solo
   informativas, y la página lo dice en un aviso en su idioma.

   Los textos con marcado en línea van en elementos data-i18n-html:
   **negrita**, `código` y [texto](destino) (ElevaTextos.enLinea).
   La política de cancelaciones no está aquí: sale del manifest del club
   (pizarra/manifest.js → cancelaciones), la misma fuente que /pizarra.

   Titular y NIF: pendientes del club. No se publican hasta confirmarlos.
   ========================================================= */
(function (root) {
  'use strict';

  var TEXTOS = {
    /* <head> y cabecera */
    'legal.title': {
      es: 'Aviso legal y privacidad | Eleva Pádel',
      en: 'Legal notice and privacy | Eleva Pádel',
      nl: 'Juridische informatie en privacy | Eleva Pádel',
      h: { en: '6532fefb', nl: '6532fefb' }
    },
    'legal.description': {
      es: 'Aviso legal, política de cancelaciones, privacidad y cookies de Eleva Pádel y de su club Eleva Pádel Pizarra, en Pizarra (Málaga).',
      en: 'Legal notice, cancellation policy, privacy and cookies for Eleva Pádel and its club, Eleva Pádel Pizarra, in Pizarra (Málaga).',
      nl: 'Juridische informatie, regels voor annuleren, privacy en cookies van Eleva Pádel en van de club Eleva Pádel Pizarra, in Pizarra (Málaga).',
      h: { en: 'a119a85d', nl: 'a119a85d' }
    },
    'legal.back': { es: 'Volver', en: 'Back', nl: 'Terug', h: { en: 'ab26ae7b', nl: 'ab26ae7b' } },
    'legal.eyebrow': {
      es: 'Información legal',
      en: 'Legal information',
      nl: 'Juridische informatie',
      h: { en: '7bf153fb', nl: '7bf153fb' }
    },
    'legal.heading': {
      es: 'Aviso legal y privacidad',
      en: 'Legal notice and privacy',
      nl: 'Juridische informatie en privacy',
      h: { en: '32a29679', nl: '32a29679' }
    },
    'legal.updated': {
      es: 'Última actualización: 25 de noviembre de 2026',
      en: 'Last updated: 25 November 2026',
      nl: 'Laatst bijgewerkt: 25 november 2026',
      h: { en: 'c325b2dd', nl: 'c325b2dd' }
    },
    'legal.translationNotice': {
      es: 'Esta traducción es solo informativa. La única versión que vale legalmente es la española, que prevalece si hay diferencias.',
      en: 'This translation is for information only. The Spanish version is the only legally binding one and prevails in case of any discrepancy.',
      nl: 'Deze vertaling is alleen ter informatie. Alleen de Spaanse versie is juridisch bindend en gaat bij verschillen voor.',
      h: { en: '7a8619d9', nl: '7a8619d9' }
    },
    'legal.toc': { es: 'Índice', en: 'Contents', nl: 'Inhoud', h: { en: '5145b3d5', nl: '5145b3d5' } },
    'legal.tocLabel': {
      es: 'Índice del documento',
      en: 'Table of contents',
      nl: 'Inhoudsopgave van dit document',
      h: { en: '41a91565', nl: '41a91565' }
    },

    /* I. Aviso legal */
    'legal.aviso.label': {
      es: 'Sección I. LSSI-CE, artículo 10',
      en: 'Section I. LSSI-CE, Article 10',
      nl: 'Deel I. LSSI-CE, artikel 10',
      h: { en: 'fe90d7e0', nl: 'fe90d7e0' }
    },
    'legal.aviso.title': {
      es: 'Aviso legal',
      en: 'Legal notice',
      nl: 'Juridische informatie',
      h: { en: '79e539a7', nl: '79e539a7' }
    },
    'legal.aviso.intro': {
      es: 'Esta página reúne la información legal de todo el sitio web, como pide el artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).',
      en: 'This page brings together the legal information for the whole website, as required by Article 10 of Spanish Law 34/2002 of 11 July on information society services and electronic commerce (LSSI-CE).',
      nl: 'Op deze pagina staat de juridische informatie van de hele website, zoals artikel 10 van de Spaanse Wet 34/2002 van 11 juli inzake diensten van de informatiemaatschappij en elektronische handel (LSSI-CE) voorschrijft.',
      h: { en: '882d2927', nl: '882d2927' }
    },
    'legal.aviso.ambitoTitle': {
      es: 'A qué páginas se aplica',
      en: 'Which pages this applies to',
      nl: 'Op welke pagina\'s dit van toepassing is',
      h: { en: 'd856e24f', nl: 'd856e24f' }
    },
    'legal.aviso.ambitoMarca': {
      es: '**Inicio (/)**: la página de Eleva Pádel. Presenta la marca y enlaza a la página de su club. No tiene formularios ni botones de contacto.',
      en: '**Home (/)**: the Eleva Pádel page. It presents the brand and links to its club\'s page. It has no forms or contact buttons.',
      nl: '**Startpagina (/)**: de pagina van Eleva Pádel. Hier wordt het merk gepresenteerd en staat een link naar de pagina van de club. Er staan geen formulieren of contactknoppen op.',
      h: { en: 'f4eea5a7', nl: 'f4eea5a7' }
    },
    'legal.aviso.ambitoClub': {
      es: '**Pizarra (/pizarra)**: la página del club Eleva Pádel Pizarra, en Pizarra (Málaga), con su información, tarifas, cancelaciones y contacto.',
      en: '**Pizarra (/pizarra)**: the page for the Eleva Pádel Pizarra club, in Pizarra (Málaga), with its information, prices, cancellations and contact details.',
      nl: '**Pizarra (/pizarra)**: de pagina van de club Eleva Pádel Pizarra, in Pizarra (Málaga), met informatie, tarieven, regels voor annuleren en contact.',
      h: { en: '475b03f3', nl: '475b03f3' }
    },
    'legal.aviso.ambitoLegal': {
      es: '**Información legal (/privacidad)**: esta página, enlazada desde el pie de las otras dos.',
      en: '**Legal information (/privacidad)**: this page, linked from the footer of the other two.',
      nl: '**Juridische informatie (/privacidad)**: deze pagina, met een link in de voettekst van de andere twee.',
      h: { en: 'e151e553', nl: 'e151e553' }
    },
    'legal.aviso.ambitoNota': {
      es: 'La política de cancelaciones (sección II) es solo del club de Pizarra. El resto de esta página se aplica a todo el sitio.',
      en: 'The cancellation policy (Section II) applies only to the Pizarra club. The rest of this page applies to the whole site.',
      nl: 'De regels voor annuleren (deel II) gelden alleen voor de club in Pizarra. De rest van deze pagina geldt voor de hele website.',
      h: { en: '0e14382f', nl: '0e14382f' }
    },
    'legal.aviso.datosTitle': {
      es: 'Datos identificativos',
      en: 'Identification details',
      nl: 'Identificatiegegevens',
      h: { en: '74696104', nl: '74696104' }
    },
    'legal.aviso.nombreDt': { es: 'Nombre comercial', en: 'Trade name', nl: 'Handelsnaam', h: { en: '2849aca9', nl: '2849aca9' } },
    'legal.aviso.nombreDd': {
      es: 'Eleva Pádel (marca) y Eleva Pádel Pizarra (club)',
      en: 'Eleva Pádel (brand) and Eleva Pádel Pizarra (club)',
      nl: 'Eleva Pádel (merk) en Eleva Pádel Pizarra (club)',
      h: { en: '8bba3f91', nl: '8bba3f91' }
    },
    'legal.aviso.domicilioDt': {
      es: 'Domicilio del club',
      en: 'Club address',
      nl: 'Adres van de club',
      h: { en: 'cbbd44da', nl: 'cbbd44da' }
    },
    'legal.aviso.domicilioDd': {
      es: 'Pasaje Jerez s/n, 29560 Pizarra, Málaga (España)',
      en: 'Pasaje Jerez s/n, 29560 Pizarra, Málaga (Spain)',
      nl: 'Pasaje Jerez s/n, 29560 Pizarra, Málaga (Spanje)',
      h: { en: '4c6949f8', nl: '4c6949f8' }
    },
    'legal.aviso.contactoDt': { es: 'Contacto', en: 'Contact', nl: 'Contact', h: { en: '771b96b0', nl: '771b96b0' } },
    'legal.aviso.contactoDd': {
      es: 'Por [WhatsApp](https://wa.me/34659143103) al +34 659 14 31 03, en Instagram como [@elevapadelpizarra](https://instagram.com/elevapadelpizarra) o en persona, en la recepción del club.',
      en: 'On [WhatsApp](https://wa.me/34659143103) at +34 659 14 31 03, on Instagram as [@elevapadelpizarra](https://instagram.com/elevapadelpizarra) or in person at the club\'s reception.',
      nl: 'Via [WhatsApp](https://wa.me/34659143103) op +34 659 14 31 03, op Instagram als [@elevapadelpizarra](https://instagram.com/elevapadelpizarra) of persoonlijk bij de receptie van de club.',
      h: { en: '3cede36f', nl: '3cede36f' }
    },
    'legal.aviso.alojamientoDt': { es: 'Alojamiento web', en: 'Web hosting', nl: 'Webhosting', h: { en: '821e361e', nl: '821e361e' } },
    'legal.aviso.alojamientoDd': {
      es: 'Vercel Inc., en Estados Unidos. Más información en su [política de privacidad](https://vercel.com/legal/privacy-notice).',
      en: 'Vercel Inc., in the United States. More information in its [privacy notice](https://vercel.com/legal/privacy-notice).',
      nl: 'Vercel Inc., in de Verenigde Staten. Meer informatie in het [privacybeleid van Vercel](https://vercel.com/legal/privacy-notice).',
      h: { en: '676fda5d', nl: '676fda5d' }
    },
    'legal.aviso.usoTitle': {
      es: 'Condiciones de uso',
      en: 'Terms of use',
      nl: 'Gebruiksvoorwaarden',
      h: { en: 'd3f19ec2', nl: 'd3f19ec2' }
    },
    'legal.aviso.uso1': {
      es: 'Usar este sitio web supone aceptar estas condiciones. El contenido del sitio y estas condiciones pueden cambiar en cualquier momento: vale la versión publicada en esta página, con su fecha de actualización.',
      en: 'By using this website, you accept these terms. The content of the site and these terms may change at any time: the version published on this page, with its date of last update, is the one that applies.',
      nl: 'Door deze website te gebruiken, ga je akkoord met deze voorwaarden. De inhoud van de website en deze voorwaarden kunnen op elk moment veranderen: de versie die op deze pagina staat, met de datum waarop die is bijgewerkt, is de geldende versie.',
      h: { en: '128cb0c7', nl: '128cb0c7' }
    },
    'legal.aviso.uso2': {
      es: 'Los textos, el logotipo y el diseño propios de este sitio están protegidos por la normativa de propiedad intelectual e industrial, y no se pueden reproducir, ni entera ni parcialmente, sin autorización expresa. Las marcas de terceros que aparecen en él son de sus titulares.',
      en: 'This site\'s own texts, logo and design are protected by intellectual and industrial property law and may not be reproduced, in whole or in part, without express permission. Third-party trademarks that appear on the site belong to their respective owners.',
      nl: 'De eigen teksten, het logo en het ontwerp van deze website zijn beschermd door de wetgeving inzake intellectuele en industriële eigendom en mogen niet geheel of gedeeltelijk worden verveelvoudigd zonder uitdrukkelijke toestemming. Merken van derden die erop voorkomen, zijn eigendom van hun houders.',
      h: { en: 'b7cc8254', nl: 'b7cc8254' }
    },
    'legal.aviso.uso3': {
      es: 'No respondemos de los daños que pueda causar un uso incorrecto del sitio, ni del contenido de los sitios de terceros a los que enlaza.',
      en: 'We are not liable for any damage that may be caused by incorrect use of the site, or for the content of third-party sites that it links to.',
      nl: 'We zijn niet aansprakelijk voor schade die kan ontstaan door onjuist gebruik van de website, en ook niet voor de inhoud van websites van derden waarnaar de website linkt.',
      h: { en: '8c32654e', nl: '8c32654e' }
    },
    'legal.aviso.leyTitle': {
      es: 'Legislación y tribunales',
      en: 'Governing law and jurisdiction',
      nl: 'Toepasselijk recht en bevoegde rechter',
      h: { en: 'ac3f9052', nl: 'ac3f9052' }
    },
    'legal.aviso.ley': {
      es: 'Estas condiciones se rigen por la legislación española. Cualquier conflicto sobre el uso de este sitio se resolverá ante los juzgados y tribunales que correspondan según la ley; si eres consumidor, ante los de tu domicilio.',
      en: 'These terms are governed by Spanish law. Any dispute over the use of this site will be settled by the courts that have jurisdiction under the law; if you are a consumer, by the courts of your place of residence.',
      nl: 'Op deze voorwaarden is het Spaanse recht van toepassing. Elk geschil over het gebruik van deze website wordt beslecht door de rechter die volgens de wet bevoegd is; als je consument bent, door de rechter van je woonplaats.',
      h: { en: '391e2777', nl: '391e2777' }
    },

    /* II. Cancelaciones (las condiciones salen del manifest del club) */
    'legal.cancel.label': {
      es: 'Sección II. Condiciones del club',
      en: 'Section II. Club terms',
      nl: 'Deel II. Voorwaarden van de club',
      h: { en: '67b9a8b3', nl: '67b9a8b3' }
    },
    'legal.cancel.title': {
      es: 'Política de cancelaciones',
      en: 'Cancellation policy',
      nl: 'Regels voor annuleren',
      h: { en: '74e444de', nl: '74e444de' }
    },
    'legal.cancel.intro': {
      es: 'Estas son las condiciones de cancelación de Eleva Pádel Pizarra. Son las mismas que se publican en la [página del club](pizarra/index.html#cancelaciones).',
      en: 'These are the cancellation terms of Eleva Pádel Pizarra. They are the same as those published on the [club\'s page](pizarra/index.html#cancelaciones).',
      nl: 'Dit zijn de voorwaarden voor annuleren bij Eleva Pádel Pizarra. Het zijn dezelfde voorwaarden als op de [pagina van de club](pizarra/index.html#cancelaciones).',
      h: { en: 'c1802a63', nl: 'c1802a63' }
    },

    /* III. Privacidad */
    'legal.priv.label': {
      es: 'Sección III. RGPD y LOPDGDD',
      en: 'Section III. GDPR and LOPDGDD',
      nl: 'Deel III. AVG en LOPDGDD',
      h: { en: 'adfc7744', nl: 'adfc7744' }
    },
    'legal.priv.title': {
      es: 'Política de privacidad',
      en: 'Privacy policy',
      nl: 'Privacybeleid',
      h: { en: '298dfe18', nl: '298dfe18' }
    },
    'legal.priv.intro': {
      es: 'Aquí te contamos qué datos personales se tratan cuando usas este sitio, para qué y qué derechos tienes, según el Reglamento (UE) 2016/679, general de protección de datos (RGPD), y la Ley Orgánica 3/2018, de 5 de diciembre, de protección de datos personales y garantía de los derechos digitales (LOPDGDD).',
      en: 'Here we explain what personal data is processed when you use this site, what for, and what rights you have, under Regulation (EU) 2016/679, the General Data Protection Regulation (GDPR), and Spanish Organic Law 3/2018 of 5 December on the Protection of Personal Data and the Guarantee of Digital Rights (LOPDGDD).',
      nl: 'Hier lees je welke persoonsgegevens worden verwerkt als je deze website gebruikt, waarvoor dat gebeurt en welke rechten je hebt, volgens Verordening (EU) 2016/679, de Algemene verordening gegevensbescherming (AVG), en de Spaanse Organieke Wet 3/2018 van 5 december inzake de bescherming van persoonsgegevens en de waarborging van digitale rechten (LOPDGDD).',
      h: { en: 'ddf9230e', nl: 'ddf9230e' }
    },
    'legal.priv.respTitle': {
      es: '3.1 Quién trata tus datos',
      en: '3.1 Who processes your data',
      nl: '3.1 Wie je gegevens verwerkt',
      h: { en: 'eaa57674', nl: 'eaa57674' }
    },
    'legal.priv.resp': {
      es: 'Los datos que nos llegan por este sitio los recibe y los trata el club Eleva Pádel Pizarra, en Pasaje Jerez s/n, 29560 Pizarra, Málaga (España). Puedes escribirnos por [WhatsApp](https://wa.me/34659143103) al +34 659 14 31 03 o hablar con nosotros en la recepción del club.',
      en: 'The data that reaches us through this site is received and processed by the Eleva Pádel Pizarra club, at Pasaje Jerez s/n, 29560 Pizarra, Málaga (Spain). You can message us on [WhatsApp](https://wa.me/34659143103) at +34 659 14 31 03 or speak to us at the club\'s reception.',
      nl: 'De gegevens die ons via deze website bereiken, worden ontvangen en verwerkt door de club Eleva Pádel Pizarra, Pasaje Jerez s/n, 29560 Pizarra, Málaga (Spanje). Je kunt ons een bericht sturen via [WhatsApp](https://wa.me/34659143103) op +34 659 14 31 03 of met ons praten bij de receptie van de club.',
      h: { en: 'b793648c', nl: 'b793648c' }
    },
    'legal.priv.datosTitle': {
      es: '3.2 Qué datos nos llegan y cómo',
      en: '3.2 What data reaches us and how',
      nl: '3.2 Welke gegevens we ontvangen en hoe',
      h: { en: '78684f23', nl: '78684f23' }
    },
    'legal.priv.estatico': {
      es: 'Este sitio es estático: no tiene base de datos, ni área de clientes, ni registro de usuarios, y **no guarda en ningún servidor propio lo que escribes**.',
      en: 'This is a static site: it has no database, customer area or user registration, and **what you write is not stored on any server of our own**.',
      nl: 'Deze website is statisch: er is geen database, geen klantenomgeving en geen gebruikersregistratie, en **wat je invult, wordt op geen enkele eigen server opgeslagen**.',
      h: { en: '6bf42ff9', nl: '6bf42ff9' }
    },
    'legal.priv.formTitle': {
      es: 'El formulario «Escríbenos» de la página del club',
      en: 'The ‘Message us’ form on the club\'s page',
      nl: 'Het formulier ‘Stuur ons een bericht’ op de pagina van de club',
      h: { en: '0c596c51', nl: '0c596c51' }
    },
    'legal.priv.form1': {
      es: 'Tiene tres campos, los tres obligatorios: nombre, teléfono y mensaje.',
      en: 'It has three fields, all of them required: name, phone and message.',
      nl: 'Het heeft drie velden, alle drie verplicht: naam, telefoon en bericht.',
      h: { en: '4976923f', nl: '4976923f' }
    },
    'legal.priv.form2': {
      es: 'Al pulsar «Enviar por WhatsApp», tu navegador comprueba los campos, compone un mensaje con ellos y abre WhatsApp con ese mensaje ya escrito, dirigido al número del club. **No se envía nada a ningún servidor de este sitio.**',
      en: 'When you select ‘Send on WhatsApp’, your browser checks the fields, composes a message from them and opens WhatsApp with that message already written, addressed to the club\'s number. **Nothing is sent to any server of this site.**',
      nl: 'Als je op ‘Versturen via WhatsApp’ drukt, controleert je browser de velden, stelt er een bericht mee op en opent WhatsApp met dat bericht al ingevuld, gericht aan het nummer van de club. **Er wordt niets naar een server van deze website verstuurd.**',
      h: { en: 'e810c621', nl: 'e810c621' }
    },
    'legal.priv.form3': {
      es: 'El mensaje va dentro del enlace que abre WhatsApp, así que WhatsApp puede recibir su contenido al abrirse. Al club solo le llega si lo envías tú: antes puedes cambiarlo o borrarlo.',
      en: 'The message is contained in the link that opens WhatsApp, so WhatsApp may receive its content when the link opens. It only reaches the club if you send it yourself: before that, you can change or delete it.',
      nl: 'Het bericht zit in de link die WhatsApp opent, dus WhatsApp kan de inhoud ontvangen zodra WhatsApp wordt geopend. De club krijgt het alleen als je het zelf verstuurt: vooraf kun je het nog aanpassen of wissen.',
      h: { en: 'c38966b7', nl: 'c38966b7' }
    },
    'legal.priv.form4': {
      es: 'Lo que escribes no se guarda en tu navegador: si recargas o cierras la página, se pierde. Sin JavaScript, el botón está desactivado y el formulario no hace nada.',
      en: 'What you write is not stored in your browser: if you reload or close the page, it is lost. Without JavaScript, the button is disabled and the form does nothing.',
      nl: 'Wat je invult, wordt niet in je browser opgeslagen: als je de pagina herlaadt of sluit, gaat het verloren. Zonder JavaScript is de knop uitgeschakeld en doet het formulier niets.',
      h: { en: '7f3141d0', nl: '7f3141d0' }
    },
    'legal.priv.enlacesTitle': {
      es: 'Los enlaces a otros servicios',
      en: 'Links to other services',
      nl: 'Links naar andere diensten',
      h: { en: '5a969c4d', nl: '5a969c4d' }
    },
    'legal.priv.enlaces': {
      es: 'Los botones de WhatsApp (algunos llevan un mensaje ya escrito, que puedes cambiar antes de enviarlo), el grupo de WhatsApp del club, Instagram, las reservas en Vola, el enlace para llegar con Google Maps y el de Biznaga Consulting del pie son enlaces: no cargan nada mientras no los pulsas. Al pulsarlos pasas a la aplicación o al sitio de ese servicio, que trata tus datos con sus propias condiciones.',
      en: 'The WhatsApp buttons (some include a pre-written message, which you can change before sending it), the club\'s WhatsApp group, Instagram, bookings on Vola, the Google Maps directions link and the Biznaga Consulting link in the footer are links: they load nothing until you select them. When you select them, you go to that service\'s app or website, which processes your data under its own terms.',
      nl: 'De WhatsApp-knoppen (bij sommige staat al een bericht klaar, dat je kunt aanpassen voordat je het verstuurt), de WhatsApp-groep van de club, Instagram, reserveren via Vola, de routebeschrijving met Google Maps en de link naar Biznaga Consulting in de voettekst zijn links: ze laden niets zolang je er niet op drukt. Als je erop drukt, ga je naar de app of de website van die dienst. Die verwerkt je gegevens volgens zijn eigen voorwaarden.',
      h: { en: '3b245a41', nl: '3b245a41' }
    },
    'legal.priv.marcaTitle': {
      es: 'La página de la marca',
      en: 'The brand page',
      nl: 'De pagina van het merk',
      h: { en: '78074f66', nl: '78074f66' }
    },
    'legal.priv.marca': {
      es: 'La página de inicio (/) no tiene formularios ni botones de WhatsApp: solo enlaza a la página del club.',
      en: 'The home page (/) has no forms or WhatsApp buttons: it only links to the club\'s page.',
      nl: 'Op de startpagina (/) staan geen formulieren of WhatsApp-knoppen: alleen een link naar de pagina van de club.',
      h: { en: '7b5d60ac', nl: '7b5d60ac' }
    },
    'legal.priv.visitaTitle': {
      es: 'Al visitar el sitio',
      en: 'When you visit the site',
      nl: 'Als je de website bezoekt',
      h: { en: '5105d470', nl: '5105d470' }
    },
    'legal.priv.vercel': {
      es: 'Vercel Inc., que aloja el sitio, puede registrar de forma automática datos técnicos de cada visita (dirección IP, fecha y hora, página pedida, respuesta del servidor y navegador) para que el servicio funcione y sea seguro.',
      en: 'Vercel Inc., which hosts the site, may automatically log technical data about each visit (IP address, date and time, page requested, server response and browser) so that the service works and is secure.',
      nl: 'Vercel Inc., dat de website host, kan bij elk bezoek automatisch technische gegevens vastleggen (IP-adres, datum en tijd, opgevraagde pagina, serverantwoord en browser), zodat de dienst werkt en veilig is.',
      h: { en: 'bae5f099', nl: 'bae5f099' }
    },
    'legal.priv.propio': {
      es: 'Todo lo demás se sirve desde este mismo sitio: el código, las tipografías, los iconos y el plano del club, una imagen hecha con datos de OpenStreetMap. **Al cargar la página no se conecta con ningún otro servicio.**',
      en: 'Everything else is served from this site itself: the code, the fonts, the icons and the club map, an image made with OpenStreetMap data. **When the page loads, it does not connect to any other service.**',
      nl: 'Al het andere komt van deze website zelf: de code, de lettertypen, de iconen en de kaart van de club, een afbeelding die is gemaakt met gegevens van OpenStreetMap. **Bij het laden van de pagina wordt met geen enkele andere dienst verbinding gemaakt.**',
      h: { en: '1ed1c748', nl: '1ed1c748' }
    },
    'legal.priv.resumen': {
      es: '**En resumen:** no guardamos tus datos en ningún servidor propio. Si nos escribes por WhatsApp, tratamos lo que nos cuentes solo para responderte y atender lo que nos pidas.',
      en: '**In short:** we do not store your data on any server of our own. If you message us on WhatsApp, we process what you tell us only to reply to you and deal with what you ask us for.',
      nl: '**Kortom:** we slaan je gegevens op geen enkele eigen server op. Als je ons een bericht stuurt via WhatsApp, verwerken we wat je ons vertelt alleen om je te antwoorden en te helpen met wat je vraagt.',
      h: { en: '7bbd1746', nl: '7bbd1746' }
    },
    'legal.priv.finTitle': {
      es: '3.3 Para qué y con qué base legal',
      en: '3.3 Purposes and lawful basis',
      nl: '3.3 Waarvoor en op welke rechtsgrond',
      h: { en: 'eed07254', nl: 'eed07254' }
    },
    'legal.priv.fin1Dt': {
      es: 'Responder a lo que nos escribes',
      en: 'Replying to your messages',
      nl: 'Antwoorden op je berichten',
      h: { en: '70e2b825', nl: '70e2b825' }
    },
    'legal.priv.fin1Dd': {
      es: 'Contestar tus preguntas y atender tus reservas o inscripciones cuando nos escribes por WhatsApp o desde el formulario. Base legal: tu consentimiento, porque eres tú quien empieza la conversación (artículo 6.1.a del RGPD), y, si nos pides una reserva o una plaza, atender esa petición antes de un posible contrato (artículo 6.1.b del RGPD).',
      en: 'Answering your questions and handling your bookings or sign-ups when you message us on WhatsApp or through the form. Lawful basis: your consent, because you are the one who starts the conversation (Article 6(1)(a) of the GDPR), and, if you ask us for a booking or a place, taking steps at your request prior to a possible contract (Article 6(1)(b) of the GDPR).',
      nl: 'Je vragen beantwoorden en je reserveringen of inschrijvingen afhandelen als je ons een bericht stuurt via WhatsApp of via het formulier. Rechtsgrond: je toestemming, omdat jij het gesprek begint (artikel 6, lid 1, onder a, van de AVG), en, als je ons om een reservering of een plek vraagt, het afhandelen van dat verzoek voorafgaand aan een mogelijke overeenkomst (artikel 6, lid 1, onder b, van de AVG).',
      h: { en: '52507376', nl: '52507376' }
    },
    'legal.priv.fin2Dt': {
      es: 'Que el sitio funcione y sea seguro',
      en: 'Keeping the site working and secure',
      nl: 'Een werkende en veilige website',
      h: { en: 'fe60f078', nl: 'fe60f078' }
    },
    'legal.priv.fin2Dd': {
      es: 'Los registros técnicos de Vercel. Base legal: el interés legítimo en que el sitio funcione y esté protegido (artículo 6.1.f del RGPD).',
      en: 'Vercel\'s technical logs. Lawful basis: the legitimate interest in the site working and being protected (Article 6(1)(f) of the GDPR).',
      nl: 'De technische logboeken van Vercel. Rechtsgrond: het gerechtvaardigd belang erbij dat de website werkt en beschermd is (artikel 6, lid 1, onder f, van de AVG).',
      h: { en: '70e1cdcd', nl: '70e1cdcd' }
    },
    'legal.priv.fin3Dt': {
      es: 'Recordar tu idioma',
      en: 'Remembering your language',
      nl: 'Je taal onthouden',
      h: { en: 'c82db89c', nl: 'c82db89c' }
    },
    'legal.priv.fin3Dd': {
      es: 'Guardar en tu navegador el idioma que eliges. Ese dato no sale de tu dispositivo: lo pides tú al elegir y está exento de consentimiento (artículo 22.2 de la LSSI-CE). Detalle en la [sección IV](#cookies).',
      en: 'Storing the language you choose in your browser. This data does not leave your device: you request it by choosing, and it is exempt from consent (Article 22(2) of the LSSI-CE). Details in [Section IV](#cookies).',
      nl: 'De taal die je kiest in je browser opslaan. Dat gegeven verlaat je apparaat niet: jij vraagt erom door een taal te kiezen, en het is vrijgesteld van toestemming (artikel 22, lid 2, van de LSSI-CE). Meer hierover in [deel IV](#cookies).',
      h: { en: 'b76a7183', nl: 'b76a7183' }
    },
    'legal.priv.fin4Dt': {
      es: 'Acceso durante el mantenimiento',
      en: 'Access during maintenance',
      nl: 'Toegang tijdens onderhoud',
      h: { en: 'edbefb13', nl: 'edbefb13' }
    },
    'legal.priv.fin4Dd': {
      es: 'La cookie `eleva-acceso`, solo para quienes gestionan el sitio mientras está en mantenimiento. Es estrictamente necesaria para lo que piden al entrar con su enlace de acceso y está exenta de consentimiento (artículo 22.2 de la LSSI-CE). Detalle en la [sección IV](#cookies).',
      en: 'The `eleva-acceso` cookie, only for those who manage the site while it is under maintenance. It is strictly necessary for what they request when they enter with their access link, and it is exempt from consent (Article 22(2) of the LSSI-CE). Details in [Section IV](#cookies).',
      nl: 'De cookie `eleva-acceso`, alleen voor wie de website beheert terwijl die in onderhoud is. Die is strikt noodzakelijk voor wat zij vragen als ze binnenkomen met hun toegangslink, en is vrijgesteld van toestemming (artikel 22, lid 2, van de LSSI-CE). Meer hierover in [deel IV](#cookies).',
      h: { en: '1cb7cd7d', nl: '1cb7cd7d' }
    },
    'legal.priv.sinPerfiles': {
      es: 'No usamos tus datos para publicidad, no hacemos perfiles y no tomamos decisiones automatizadas sobre ti.',
      en: 'We do not use your data for advertising, we do not create profiles and we do not make automated decisions about you.',
      nl: 'We gebruiken je gegevens niet voor reclame, maken geen profielen en nemen geen geautomatiseerde besluiten over jou.',
      h: { en: 'bef76570', nl: 'bef76570' }
    },
    'legal.priv.destTitle': {
      es: '3.4 Quién más interviene',
      en: '3.4 Who else is involved',
      nl: '3.4 Wie er nog meer bij betrokken is',
      h: { en: '227b8332', nl: '227b8332' }
    },
    'legal.priv.destIntro': {
      es: 'No cedemos tus datos a nadie para sus propios fines. Por cómo funciona el sitio, intervienen estos servicios:',
      en: 'We do not pass your data on to anyone for their own purposes. Because of how the site works, the following services are involved:',
      nl: 'We verstrekken je gegevens aan niemand voor diens eigen doeleinden. Door de manier waarop de website werkt, zijn deze diensten erbij betrokken:',
      h: { en: 'd9b3ff24', nl: 'd9b3ff24' }
    },
    'legal.priv.destWaDt': {
      es: 'WhatsApp (WhatsApp Ireland Limited)',
      en: 'WhatsApp (WhatsApp Ireland Limited)',
      nl: 'WhatsApp (WhatsApp Ireland Limited)',
      h: { en: 'b3425633', nl: 'b3425633' }
    },
    'legal.priv.destWaDd': {
      es: 'El servicio de mensajería por el que nos escribes y en el que está el grupo del club. Trata los datos por su cuenta, según su [política de privacidad](https://www.whatsapp.com/legal/privacy-policy-eea).',
      en: 'The messaging service you use to message us and where the club\'s group is. It processes data independently, under its [privacy policy](https://www.whatsapp.com/legal/privacy-policy-eea).',
      nl: 'De berichtendienst waarmee je ons een bericht stuurt en waarin de groep van de club zit. WhatsApp verwerkt de gegevens zelfstandig, volgens zijn [privacybeleid](https://www.whatsapp.com/legal/privacy-policy-eea).',
      h: { en: '6c4aefe4', nl: '6c4aefe4' }
    },
    'legal.priv.destIgDt': {
      es: 'Instagram (Meta Platforms Ireland Ltd.)',
      en: 'Instagram (Meta Platforms Ireland Ltd.)',
      nl: 'Instagram (Meta Platforms Ireland Ltd.)',
      h: { en: '5d1d57bf', nl: '5d1d57bf' }
    },
    'legal.priv.destIgDd': {
      es: 'La red social donde el club publica su actividad, [@elevapadelpizarra](https://instagram.com/elevapadelpizarra). Si entras, Meta trata tus datos según la [política de privacidad de Instagram](https://privacycenter.instagram.com/policy).',
      en: 'The social network where the club posts its activity, [@elevapadelpizarra](https://instagram.com/elevapadelpizarra). If you visit it, Meta processes your data under the [Instagram privacy policy](https://privacycenter.instagram.com/policy).',
      nl: 'Het sociale netwerk waarop de club zijn activiteiten deelt, [@elevapadelpizarra](https://instagram.com/elevapadelpizarra). Als je Instagram bezoekt, verwerkt Meta je gegevens volgens het [privacybeleid van Instagram](https://privacycenter.instagram.com/policy).',
      h: { en: 'c4697c1f', nl: 'c4697c1f' }
    },
    'legal.priv.destVolaDt': { es: 'Vola', en: 'Vola', nl: 'Vola', h: { en: 'eb426a84', nl: 'eb426a84' } },
    'legal.priv.destVolaDd': {
      es: 'La plataforma de reservas de pistas. Al reservar sales de este sitio: la cuenta y la reserva los gestiona Vola por su cuenta, con sus propias condiciones.',
      en: 'The court booking platform. When you book, you leave this site: your account and booking are handled by Vola independently, under its own terms.',
      nl: 'Het platform voor het reserveren van banen. Als je reserveert, verlaat je deze website: je account en de reservering worden zelfstandig door Vola beheerd, volgens zijn eigen voorwaarden.',
      h: { en: '3d5959b5', nl: '3d5959b5' }
    },
    'legal.priv.destMapsDt': {
      es: 'Google Maps (Google)',
      en: 'Google Maps (Google)',
      nl: 'Google Maps (Google)',
      igual: ['en', 'nl'],
      h: { en: '5ff29619', nl: '5ff29619' }
    },
    'legal.priv.destMapsDd': {
      es: 'Solo si pulsas el enlace para llegar al club: se abre Google Maps, que trata tus datos según la [política de privacidad de Google](https://policies.google.com/privacy).',
      en: 'Only if you select the link for directions to the club: Google Maps opens and processes your data under the [Google privacy policy](https://policies.google.com/privacy).',
      nl: 'Alleen als je op de link voor de routebeschrijving naar de club drukt: dan opent Google Maps, dat je gegevens verwerkt volgens het [privacybeleid van Google](https://policies.google.com/privacy).',
      h: { en: 'c7ae865f', nl: 'c7ae865f' }
    },
    'legal.priv.destVercelDt': { es: 'Vercel Inc.', en: 'Vercel Inc.', nl: 'Vercel Inc.', h: { en: 'bd9d0f96', nl: 'bd9d0f96' } },
    'legal.priv.destVercelDd': {
      es: 'Aloja el sitio y registra los datos técnicos de las visitas como proveedor del servicio. Más información en su [política de privacidad](https://vercel.com/legal/privacy-notice).',
      en: 'Hosts the site and logs technical data about visits as the service provider. More information in its [privacy notice](https://vercel.com/legal/privacy-notice).',
      nl: 'Host de website en legt als dienstverlener de technische gegevens van de bezoeken vast. Meer informatie in het [privacybeleid van Vercel](https://vercel.com/legal/privacy-notice).',
      h: { en: 'fd39545e', nl: 'fd39545e' }
    },
    'legal.priv.destLeyDt': {
      es: 'Administraciones y juzgados',
      en: 'Public authorities and courts',
      nl: 'Overheidsinstanties en rechtbanken',
      h: { en: '0c846992', nl: '0c846992' }
    },
    'legal.priv.destLeyDd': {
      es: 'Solo cuando la ley nos obligue a comunicarles datos.',
      en: 'Only when the law requires us to disclose data to them.',
      nl: 'Alleen als de wet ons verplicht om gegevens aan hen te verstrekken.',
      h: { en: 'e21b42a5', nl: 'e21b42a5' }
    },
    'legal.priv.transTitle': {
      es: '3.5 Datos fuera del Espacio Económico Europeo',
      en: '3.5 Data outside the European Economic Area',
      nl: '3.5 Gegevens buiten de Europese Economische Ruimte',
      h: { en: '1c00e2f9', nl: '1c00e2f9' }
    },
    'legal.priv.transIntro': {
      es: 'Meta y Vercel pueden tratar datos en Estados Unidos. Esas transferencias se apoyan en estas garantías del capítulo V del RGPD:',
      en: 'Meta and Vercel may process data in the United States. These transfers rely on the following safeguards under Chapter V of the GDPR:',
      nl: 'Meta en Vercel kunnen gegevens verwerken in de Verenigde Staten. Die doorgiften zijn gebaseerd op deze waarborgen uit hoofdstuk V van de AVG:',
      h: { en: 'af2705d3', nl: 'af2705d3' }
    },
    'legal.priv.transMetaDt': {
      es: 'Meta (WhatsApp e Instagram)',
      en: 'Meta (WhatsApp and Instagram)',
      nl: 'Meta (WhatsApp en Instagram)',
      h: { en: 'bf146a08', nl: 'bf146a08' }
    },
    'legal.priv.transMetaDd': {
      es: 'El Marco de Privacidad de Datos UE-EE. UU. (decisión de adecuación de la Comisión Europea de 10 de julio de 2023) y, además, las cláusulas contractuales tipo de la Comisión (Decisión de Ejecución (UE) 2021/914). En el Espacio Económico Europeo, el responsable de WhatsApp es WhatsApp Ireland Limited y el de Instagram, Meta Platforms Ireland Ltd.',
      en: 'The EU-U.S. Data Privacy Framework (European Commission adequacy decision of 10 July 2023) and, in addition, the Commission\'s standard contractual clauses (Commission Implementing Decision (EU) 2021/914). In the European Economic Area, the controller for WhatsApp is WhatsApp Ireland Limited and the controller for Instagram is Meta Platforms Ireland Ltd.',
      nl: 'Het EU-VS-kader voor gegevensbescherming (adequaatheidsbesluit van de Europese Commissie van 10 juli 2023) en daarnaast de standaardcontractbepalingen van de Commissie (Uitvoeringsbesluit (EU) 2021/914). In de Europese Economische Ruimte is WhatsApp Ireland Limited de verwerkingsverantwoordelijke voor WhatsApp en Meta Platforms Ireland Ltd. die voor Instagram.',
      h: { en: 'df317d97', nl: 'df317d97' }
    },
    'legal.priv.transVercelDt': { es: 'Vercel Inc.', en: 'Vercel Inc.', nl: 'Vercel Inc.', h: { en: 'bd9d0f96', nl: 'bd9d0f96' } },
    'legal.priv.transVercelDd': {
      es: 'Las cláusulas contractuales tipo de su acuerdo de tratamiento de datos (Data Processing Addendum).',
      en: 'The standard contractual clauses in its Data Processing Addendum.',
      nl: 'De standaardcontractbepalingen in de verwerkersovereenkomst van Vercel (Data Processing Addendum).',
      h: { en: '7d999248', nl: '7d999248' }
    },
    'legal.priv.transMas': {
      es: 'Si quieres más información sobre estas garantías, pídenosla por los canales del apartado 3.7.',
      en: 'If you would like more information about these safeguards, ask us through the channels in section 3.7.',
      nl: 'Wil je meer weten over deze waarborgen? Vraag het ons via de kanalen in punt 3.7.',
      h: { en: '49f0421a', nl: '49f0421a' }
    },
    'legal.priv.plazoTitle': {
      es: '3.6 Cuánto tiempo',
      en: '3.6 How long data is kept',
      nl: '3.6 Hoe lang',
      h: { en: '1c910e39', nl: '1c910e39' }
    },
    'legal.priv.plazo1': {
      es: 'Lo que nos escribes se guarda el tiempo necesario para atenderte y, después, solo durante los plazos que exija la ley.',
      en: 'What you write to us is kept for as long as necessary to deal with it and, after that, only for the periods required by law.',
      nl: 'Wat je ons schrijft, wordt bewaard zo lang als nodig is om je te helpen, en daarna alleen gedurende de termijnen die de wet voorschrijft.',
      h: { en: '9b2fed21', nl: '9b2fed21' }
    },
    'legal.priv.plazo2': {
      es: 'Los registros técnicos de Vercel se conservan durante los plazos que fija Vercel, que no dependen de nosotros.',
      en: 'Vercel\'s technical logs are kept for the periods set by Vercel, which do not depend on us.',
      nl: 'De technische logboeken van Vercel worden bewaard gedurende de termijnen die Vercel bepaalt; daar hebben wij geen invloed op.',
      h: { en: 'b955a3ec', nl: 'b955a3ec' }
    },
    'legal.priv.plazo3': {
      es: 'Lo que se guarda en tu navegador dura lo que se indica en la [sección IV](#cookies).',
      en: 'What is stored in your browser lasts as long as stated in [Section IV](#cookies).',
      nl: 'Hoe lang wat in je browser wordt opgeslagen bewaard blijft, staat in [deel IV](#cookies).',
      h: { en: 'ed916241', nl: 'ed916241' }
    },
    'legal.priv.derechosTitle': {
      es: '3.7 Tus derechos',
      en: '3.7 Your rights',
      nl: '3.7 Je rechten',
      h: { en: '954ac1cc', nl: '954ac1cc' }
    },
    'legal.priv.derechosIntro': {
      es: 'Puedes ejercer en cualquier momento estos derechos que te da el RGPD:',
      en: 'You can exercise the following rights under the GDPR at any time:',
      nl: 'Je kunt deze rechten uit de AVG op elk moment uitoefenen:',
      h: { en: '460e2d85', nl: '460e2d85' }
    },
    'legal.priv.derechosLabel': {
      es: 'Tus derechos sobre tus datos',
      en: 'Your rights over your data',
      nl: 'Je rechten met betrekking tot je gegevens',
      h: { en: '99a3f6d4', nl: '99a3f6d4' }
    },
    'legal.priv.dAcceso': { es: 'Acceso', en: 'Access', nl: 'Inzage', h: { en: 'bf904abc', nl: 'bf904abc' } },
    'legal.priv.dAccesoTxt': {
      es: 'Saber si tratamos datos tuyos, obtener una copia y saber para qué los usamos, de dónde salen y a quién se comunican.',
      en: 'To know whether we process data about you, to get a copy, and to know what we use it for, where it comes from and who it is disclosed to.',
      nl: 'Weten of we gegevens van je verwerken, een kopie krijgen en weten waarvoor we ze gebruiken, waar ze vandaan komen en aan wie ze worden verstrekt.',
      h: { en: '26146e50', nl: '26146e50' }
    },
    'legal.priv.dRect': { es: 'Rectificación', en: 'Rectification', nl: 'Rectificatie', h: { en: 'a4087000', nl: 'a4087000' } },
    'legal.priv.dRectTxt': {
      es: 'Corregir los datos que sean inexactos o estén incompletos.',
      en: 'To correct data that is inaccurate or incomplete.',
      nl: 'Gegevens laten corrigeren die onjuist of onvolledig zijn.',
      h: { en: 'fb0d2d51', nl: 'fb0d2d51' }
    },
    'legal.priv.dSupr': { es: 'Supresión', en: 'Erasure', nl: 'Wissing', h: { en: 'c0d17cac', nl: 'c0d17cac' } },
    'legal.priv.dSuprTxt': {
      es: 'Pedir que borremos tus datos, por ejemplo cuando ya no hagan falta para lo que se recogieron.',
      en: 'To ask us to delete your data, for example when it is no longer needed for the purpose for which it was collected.',
      nl: 'Vragen dat we je gegevens wissen, bijvoorbeeld als ze niet meer nodig zijn voor het doel waarvoor ze zijn verzameld.',
      h: { en: 'e0200b96', nl: 'e0200b96' }
    },
    'legal.priv.dOpos': { es: 'Oposición', en: 'Objection', nl: 'Bezwaar', h: { en: 'fed2b79f', nl: 'fed2b79f' } },
    'legal.priv.dOposTxt': {
      es: 'Oponerte a que usemos tus datos cuando lo hacemos por interés legítimo.',
      en: 'To object to our use of your data when we use it on the basis of legitimate interest.',
      nl: 'Bezwaar maken tegen het gebruik van je gegevens als we ze gebruiken op basis van gerechtvaardigd belang.',
      h: { en: '5ebdd90d', nl: '5ebdd90d' }
    },
    'legal.priv.dLim': { es: 'Limitación', en: 'Restriction', nl: 'Beperking', h: { en: '63a87f62', nl: '63a87f62' } },
    'legal.priv.dLimTxt': {
      es: 'Pedir que conservemos tus datos sin usarlos mientras se comprueba si son exactos o, si te has opuesto a que los usemos, mientras se verifica si nuestros motivos legítimos prevalecen sobre los tuyos. También puedes pedirlo si el tratamiento es ilícito y prefieres que no los borremos, o si ya no nos hacen falta pero tú los necesitas para formular, ejercer o defender reclamaciones.',
      en: 'To ask us to keep your data without using it while its accuracy is being checked or, if you have objected to our use of it, while it is being verified whether our legitimate grounds override yours. You can also ask for this if the processing is unlawful and you would rather we did not delete your data, or if we no longer need it but you need it for the establishment, exercise or defence of legal claims.',
      nl: 'Vragen dat we je gegevens bewaren zonder ze te gebruiken zolang wordt nagegaan of ze juist zijn of, als je bezwaar hebt gemaakt tegen het gebruik ervan, zolang wordt nagegaan of onze gerechtvaardigde gronden zwaarder wegen dan die van jou. Je kunt dat ook vragen als de verwerking onrechtmatig is en je liever hebt dat we ze niet wissen, of als wij ze niet meer nodig hebben maar jij ze nodig hebt voor de instelling, uitoefening of onderbouwing van een rechtsvordering.',
      h: { en: '6008f57c', nl: '6008f57c' }
    },
    'legal.priv.dPort': { es: 'Portabilidad', en: 'Portability', nl: 'Overdraagbaarheid', h: { en: 'c75028a1', nl: 'c75028a1' } },
    'legal.priv.dPortTxt': {
      es: 'Recibir los datos que nos diste en un formato de uso común, o que se los pasemos a otro responsable cuando sea técnicamente posible.',
      en: 'To receive the data you gave us in a commonly used format, or to have us pass it to another controller where technically possible.',
      nl: 'De gegevens die je ons hebt gegeven ontvangen in een gangbaar formaat, of ze laten doorgeven aan een andere verwerkingsverantwoordelijke als dat technisch mogelijk is.',
      h: { en: '5593b34e', nl: '5593b34e' }
    },
    'legal.priv.dRetirar': {
      es: 'Retirar el consentimiento',
      en: 'Withdrawing consent',
      nl: 'Toestemming intrekken',
      h: { en: '769c7c36', nl: '769c7c36' }
    },
    'legal.priv.dRetirarTxt': {
      es: 'Retirarlo cuando quieras. Lo que hicimos antes con tu consentimiento sigue siendo válido.',
      en: 'To withdraw it whenever you like. Anything we did with your consent before then remains valid.',
      nl: 'Je toestemming intrekken wanneer je wilt. Wat we eerder met je toestemming hebben gedaan, blijft geldig.',
      h: { en: 'd706de13', nl: 'd706de13' }
    },
    'legal.priv.ejercerTitle': {
      es: 'Cómo ejercerlos',
      en: 'How to exercise them',
      nl: 'Hoe je ze uitoefent',
      h: { en: '212fec50', nl: '212fec50' }
    },
    'legal.priv.ejercer': {
      es: 'Es gratis. Escríbenos por [WhatsApp](https://wa.me/34659143103) al +34 659 14 31 03 o pásate por la recepción del club, y dinos qué derecho quieres ejercer. Solo si tenemos dudas razonables sobre quién eres te pediremos que lo acredites (artículo 12.6 del RGPD).',
      en: 'It is free of charge. Message us on [WhatsApp](https://wa.me/34659143103) at +34 659 14 31 03 or drop in at the club\'s reception, and tell us which right you want to exercise. We will only ask you to prove your identity if we have reasonable doubts about who you are (Article 12(6) of the GDPR).',
      nl: 'Het is gratis. Stuur ons een bericht via [WhatsApp](https://wa.me/34659143103) op +34 659 14 31 03 of kom langs bij de receptie van de club, en laat ons weten welk recht je wilt uitoefenen. Alleen als we redelijke twijfel hebben over wie je bent, vragen we je om dat aan te tonen (artikel 12, lid 6, van de AVG).',
      h: { en: 'd3749fec', nl: 'd3749fec' }
    },
    'legal.priv.respuesta': {
      es: 'Te responderemos en un mes como máximo desde que recibamos tu petición. Si es especialmente compleja o hay muchas peticiones, el plazo puede alargarse dos meses más; en ese caso te lo diremos dentro del primer mes y te explicaremos por qué.',
      en: 'We will reply within one month of receiving your request at the latest. If it is particularly complex or there are many requests, this period may be extended by two further months; in that case, we will let you know within the first month and explain why.',
      nl: 'We antwoorden uiterlijk binnen een maand nadat we je verzoek hebben ontvangen. Als het verzoek bijzonder ingewikkeld is of als er veel verzoeken zijn, kan die termijn met nog twee maanden worden verlengd; in dat geval laten we je dat binnen de eerste maand weten en leggen we uit waarom.',
      h: { en: '59ceb466', nl: '59ceb466' }
    },
    'legal.priv.aepd': {
      es: '**Reclamar ante la AEPD.** Si crees que no tratamos bien tus datos o que no hemos atendido tu petición, puedes reclamar ante la Agencia Española de Protección de Datos en su sede electrónica, [www.aepd.es](https://www.aepd.es), o en C/ Jorge Juan, 6, 28001 Madrid. Antes, si quieres, cuéntanoslo y lo intentamos resolver.',
      en: '**Complaints to the AEPD.** If you believe we are not handling your data properly or have not dealt with your request, you can lodge a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos) through its electronic office, [www.aepd.es](https://www.aepd.es), or at C/ Jorge Juan, 6, 28001 Madrid. Before that, if you wish, tell us about it and we will try to resolve it.',
      nl: '**Een klacht indienen bij de AEPD.** Vind je dat we niet goed met je gegevens omgaan of dat we je verzoek niet hebben afgehandeld, dan kun je een klacht indienen bij de Agencia Española de Protección de Datos via haar elektronische loket, [www.aepd.es](https://www.aepd.es), of op het adres C/ Jorge Juan, 6, 28001 Madrid. Als je wilt, kun je het ons eerst vertellen, dan proberen we het op te lossen.',
      h: { en: 'fea32ac6', nl: 'fea32ac6' }
    },

    /* IV. Cookies y almacenamiento en el navegador */
    'legal.cookies.label': {
      es: 'Sección IV. LSSI-CE, artículo 22.2',
      en: 'Section IV. LSSI-CE, Article 22(2)',
      nl: 'Deel IV. LSSI-CE, artikel 22, lid 2',
      h: { en: 'e2f0e639', nl: 'e2f0e639' }
    },
    'legal.cookies.title': {
      es: 'Cookies y almacenamiento en el navegador',
      en: 'Cookies and browser storage',
      nl: 'Cookies en opslag in de browser',
      h: { en: '6b986410', nl: '6b986410' }
    },
    'legal.cookies.que': {
      es: 'Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo. El almacenamiento local del navegador (`localStorage`) sirve para lo mismo. Esta sección explica todo lo que este sitio guarda en tu navegador.',
      en: 'Cookies are small files that a website stores on your device. The browser\'s local storage (`localStorage`) serves the same purpose. This section explains everything that this site stores in your browser.',
      nl: 'Cookies zijn kleine bestanden die een website op je apparaat opslaat. De lokale opslag van de browser (`localStorage`) dient hetzelfde doel. In dit deel lees je alles wat deze website in je browser opslaat.',
      h: { en: 'aff14b5a', nl: 'aff14b5a' }
    },
    'legal.cookies.noUsa': {
      es: '**No usamos cookies de análisis, de publicidad ni de redes sociales**, ni herramientas de analítica, píxeles o identificadores de seguimiento. No medimos ni perfilamos a quien visita el sitio.',
      en: '**We do not use analytics, advertising or social media cookies**, or any analytics tools, pixels or tracking identifiers. We do not measure or profile visitors to the site.',
      nl: '**We gebruiken geen analytische cookies, advertentiecookies of socialemediacookies**, en ook geen analysetools, pixels of tracking-ID\'s. We meten of profileren de bezoekers van de website niet.',
      h: { en: '3ebc21f3', nl: '3ebc21f3' }
    },
    'legal.cookies.listaTitle': {
      es: 'Lo que se guarda en tu navegador',
      en: 'What is stored in your browser',
      nl: 'Wat er in je browser wordt opgeslagen',
      h: { en: '5901ff06', nl: '5901ff06' }
    },
    'legal.cookies.campoTipo': { es: 'Qué es', en: 'What it is', nl: 'Wat het is', h: { en: 'e8970bbf', nl: 'e8970bbf' } },
    'legal.cookies.campoCuando': {
      es: 'Cuándo se guarda',
      en: 'When it is stored',
      nl: 'Wanneer het wordt opgeslagen',
      h: { en: '13f0b1c7', nl: '13f0b1c7' }
    },
    'legal.cookies.campoPara': { es: 'Para qué', en: 'What it is for', nl: 'Waarvoor', h: { en: '329c8598', nl: '329c8598' } },
    'legal.cookies.campoDura': { es: 'Cuánto dura', en: 'How long it lasts', nl: 'Hoe lang', h: { en: '8246c502', nl: '8246c502' } },
    'legal.cookies.campoConsent': { es: 'Consentimiento', en: 'Consent', nl: 'Toestemming', h: { en: '6ac0792d', nl: '6ac0792d' } },
    'legal.cookies.langTipo': {
      es: 'Almacenamiento local del navegador (`localStorage`), propio.',
      en: 'First-party local browser storage (`localStorage`).',
      nl: 'Lokale opslag van de browser (`localStorage`), van deze website zelf.',
      h: { en: '5a5d19bd', nl: '5a5d19bd' }
    },
    'legal.cookies.langCuando': {
      es: 'Solo cuando eliges un idioma en el selector, en cualquier página del sitio.',
      en: 'Only when you choose a language in the selector, on any page of the site.',
      nl: 'Alleen als je een taal kiest in de taalkeuze, op welke pagina van de website ook.',
      h: { en: '2c4d514f', nl: '2c4d514f' }
    },
    'legal.cookies.langPara': {
      es: 'Recordar el idioma que has elegido (español, inglés o neerlandés) en tus próximas visitas.',
      en: 'To remember the language you have chosen (Spanish, English or Dutch) on your future visits.',
      nl: 'De taal die je hebt gekozen (Spaans, Engels of Nederlands) onthouden voor je volgende bezoeken.',
      h: { en: '6a2f75f5', nl: '6a2f75f5' }
    },
    'legal.cookies.langDura': {
      es: 'Hasta que borres los datos de este sitio en tu navegador.',
      en: 'Until you clear this site\'s data in your browser.',
      nl: 'Tot je de gegevens van deze website in je browser wist.',
      h: { en: '651c4fe0', nl: '651c4fe0' }
    },
    'legal.cookies.langConsent': {
      es: 'No hace falta: lo pides tú al elegir el idioma.',
      en: 'Not needed: you request it by choosing the language.',
      nl: 'Niet nodig: jij vraagt erom door een taal te kiezen.',
      h: { en: '22c7b956', nl: '22c7b956' }
    },
    'legal.cookies.accesoTipo': {
      es: 'Cookie propia y técnica (`HttpOnly`, `SameSite=Lax` y `Secure`).',
      en: 'First-party technical cookie (`HttpOnly`, `SameSite=Lax` and `Secure`).',
      nl: 'Eigen, technische cookie (`HttpOnly`, `SameSite=Lax` en `Secure`).',
      h: { en: '52dfb203', nl: '52dfb203' }
    },
    'legal.cookies.accesoCuando': {
      es: 'Solo mientras el sitio está en mantenimiento y únicamente a quien entra con el enlace de acceso de las personas que lo gestionan. A quien visita el sitio no se le guarda.',
      en: 'Only while the site is under maintenance, and only for those who enter with the access link of the people who manage it. It is not stored for people visiting the site.',
      nl: 'Alleen terwijl de website in onderhoud is, en uitsluitend bij wie binnenkomt met de toegangslink van de mensen die de website beheren. Bij bezoekers wordt hij niet opgeslagen.',
      h: { en: '4bec3fd7', nl: '4bec3fd7' }
    },
    'legal.cookies.accesoPara': {
      es: 'Dejar ver el sitio a esas personas mientras los demás ven la página de mantenimiento.',
      en: 'To let those people see the site while everyone else sees the maintenance page.',
      nl: 'Die mensen de website laten zien terwijl de anderen de onderhoudspagina zien.',
      h: { en: 'ec2b843f', nl: 'ec2b843f' }
    },
    'legal.cookies.accesoDura': { es: '30 días.', en: '30 days.', nl: '30 dagen.', h: { en: 'f60e5c6e', nl: 'f60e5c6e' } },
    'legal.cookies.accesoConsent': {
      es: 'No hace falta: es estrictamente necesaria para lo que pide quien usa ese enlace.',
      en: 'Not needed: it is strictly necessary for what the person using that link requests.',
      nl: 'Niet nodig: de cookie is strikt noodzakelijk voor wat de gebruiker van die link vraagt.',
      h: { en: '80dd452f', nl: '80dd452f' }
    },
    'legal.cookies.vercelNombre': {
      es: 'Cookie de seguridad de Vercel',
      en: 'Vercel security cookie',
      nl: 'Beveiligingscookie van Vercel',
      h: { en: '67ee15cf', nl: '67ee15cf' }
    },
    'legal.cookies.vercelTipo': {
      es: 'Cookie técnica de Vercel Inc., el alojamiento del sitio.',
      en: 'Technical cookie from Vercel Inc., the site\'s host.',
      nl: 'Technische cookie van Vercel Inc., de hostingpartij van de website.',
      h: { en: 'ec00de8b', nl: 'ec00de8b' }
    },
    'legal.cookies.vercelCuando': {
      es: 'Solo si el sistema de seguridad de Vercel detecta tráfico anómalo y muestra una página de comprobación antes del sitio.',
      en: 'Only if Vercel\'s security system detects unusual traffic and shows a verification page before the site.',
      nl: 'Alleen als het beveiligingssysteem van Vercel afwijkend verkeer detecteert en vóór de website een controlepagina toont.',
      h: { en: '2528a1fc', nl: '2528a1fc' }
    },
    'legal.cookies.vercelPara': {
      es: 'No volver a pedirte esa comprobación.',
      en: 'So that you are not asked for that verification again.',
      nl: 'Voorkomen dat je opnieuw om die controle wordt gevraagd.',
      h: { en: '72075eb2', nl: '72075eb2' }
    },
    'legal.cookies.vercelDura': {
      es: 'La que fije Vercel, según su [política de privacidad](https://vercel.com/legal/privacy-notice).',
      en: 'As set by Vercel, according to its [privacy notice](https://vercel.com/legal/privacy-notice).',
      nl: 'Zo lang als Vercel bepaalt, volgens het [privacybeleid van Vercel](https://vercel.com/legal/privacy-notice).',
      h: { en: '4f115e22', nl: '4f115e22' }
    },
    'legal.cookies.vercelConsent': {
      es: 'No hace falta: es una cookie de seguridad del servicio.',
      en: 'Not needed: it is a security cookie for the service.',
      nl: 'Niet nodig: het is een beveiligingscookie van de dienst.',
      h: { en: 'a8528f7e', nl: 'a8528f7e' }
    },
    'legal.cookies.nadaMas': {
      es: 'No se guarda nada más: este sitio no usa `sessionStorage`, IndexedDB ni ninguna otra forma de almacenamiento en el navegador.',
      en: 'Nothing else is stored: this site does not use `sessionStorage`, IndexedDB or any other form of browser storage.',
      nl: 'Verder wordt er niets opgeslagen: deze website gebruikt geen `sessionStorage`, IndexedDB of een andere vorm van opslag in de browser.',
      h: { en: 'a448bcb6', nl: 'a448bcb6' }
    },
    'legal.cookies.banner': {
      es: '**Por eso no hay aviso de cookies.** Solo hay que pedir consentimiento para las cookies o técnicas que lo necesitan, y aquí no hay ninguna. Si algún día se añade una herramienta de analítica o de publicidad, antes de activarla se pedirá tu consentimiento y se actualizará esta página.',
      en: '**That is why there is no cookie banner.** Consent is only required for cookies or techniques that need it, and there are none here. If an analytics or advertising tool is ever added, your consent will be requested before it is activated and this page will be updated.',
      nl: '**Daarom is er geen cookiemelding.** Toestemming hoeft alleen gevraagd te worden voor cookies of technieken waarvoor dat nodig is, en die zijn er hier niet. Als er ooit een analyse- of advertentietool bij komt, wordt eerst je toestemming gevraagd voordat die wordt aangezet, en wordt deze pagina bijgewerkt.',
      h: { en: 'd2084589', nl: 'd2084589' }
    },
    'legal.cookies.borrarTitle': {
      es: 'Cómo borrar lo guardado',
      en: 'How to delete what is stored',
      nl: 'Hoe je opgeslagen gegevens wist',
      h: { en: 'aa3e23d0', nl: 'aa3e23d0' }
    },
    'legal.cookies.borrar': {
      es: 'Puedes borrar las cookies y los datos de este sitio desde la configuración de tu navegador, o navegar en una ventana privada, que no guarda nada al cerrarla. Sin el idioma guardado, el sitio se ve en el primero de los idiomas de tu navegador que sea español, inglés o neerlandés; si no hay ninguno, en español.',
      en: 'You can delete cookies and this site\'s data in your browser settings, or browse in a private window, which keeps nothing once it is closed. Without a saved language, the site is shown in the first of your browser\'s languages that is Spanish, English or Dutch; if there is none, in Spanish.',
      nl: 'Je kunt de cookies en gegevens van deze website wissen via de instellingen van je browser, of surfen in een privévenster, dat niets bewaart als je het sluit. Zonder opgeslagen taal wordt de website getoond in de eerste van je browsertalen die Spaans, Engels of Nederlands is; als geen daarvan erbij zit, in het Spaans.',
      h: { en: '90400c4c', nl: '90400c4c' }
    },
    'legal.cookies.navegadores': {
      es: 'Cómo hacerlo en los navegadores más usados:',
      en: 'How to do this in the most widely used browsers:',
      nl: 'Zo doe je dat in de meest gebruikte browsers:',
      h: { en: '5464b6c5', nl: '5464b6c5' }
    },
    'legal.cookies.chrome': {
      es: '[Google Chrome](https://support.google.com/chrome/answer/95647)',
      en: '[Google Chrome](https://support.google.com/chrome/answer/95647)',
      nl: '[Google Chrome](https://support.google.com/chrome/answer/95647)',
      h: { en: '80f19a0a', nl: '80f19a0a' }
    },
    'legal.cookies.firefox': {
      es: '[Mozilla Firefox](https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox)',
      en: '[Mozilla Firefox](https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox)',
      nl: '[Mozilla Firefox](https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox)',
      h: { en: '8fcb38b9', nl: '8fcb38b9' }
    },
    'legal.cookies.safari': {
      es: '[Safari](https://support.apple.com/guide/safari/sfri11471/mac)',
      en: '[Safari](https://support.apple.com/guide/safari/sfri11471/mac)',
      nl: '[Safari](https://support.apple.com/guide/safari/sfri11471/mac)',
      h: { en: '2f5c3481', nl: '2f5c3481' }
    },
    'legal.cookies.edge': {
      es: '[Microsoft Edge](https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)',
      en: '[Microsoft Edge](https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)',
      nl: '[Microsoft Edge](https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)',
      h: { en: '199a25b6', nl: '199a25b6' }
    }
  };

  if (typeof module === 'object' && module.exports) module.exports = { textos: TEXTOS };
  else if (root.ElevaTextos) {
    for (var k in TEXTOS) if (Object.prototype.hasOwnProperty.call(TEXTOS, k)) root.ElevaTextos.textos[k] = TEXTOS[k];
  }
})(this);
