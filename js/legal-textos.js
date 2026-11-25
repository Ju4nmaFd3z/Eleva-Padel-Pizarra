/* =========================================================
   Textos de la página legal (/privacidad) · ES / EN / NL
   ---------------------------------------------------------
   Mismo formato que js/translations.js: { es, en, nl, h: { en, nl } }.
   Archivo propio para no cargar estos textos en las demás páginas: en el
   navegador se suman a window.ElevaTextos (va después de translations.js);
   las herramientas los leen con tools/i18n.js (todosLosTextos).

   La versión que vale legalmente es la española. Hasta que lleguen las
   traducciones revisadas (traductor y revisor por idioma), en inglés y
   neerlandés se ve el español con lang="es" y un aviso traducido.

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
    'legal.title': { es: 'Aviso legal y privacidad | Eleva Pádel' },
    'legal.description': { es: 'Aviso legal, política de cancelaciones, privacidad y cookies de Eleva Pádel y de su club Eleva Pádel Pizarra, en Pizarra (Málaga).' },
    'legal.back': { es: 'Volver' },
    'legal.eyebrow': { es: 'Información legal' },
    'legal.heading': { es: 'Aviso legal y privacidad' },
    'legal.updated': { es: 'Última actualización: 25 de noviembre de 2026' },
    'legal.translationNotice': {
      es: 'Esta traducción es solo informativa. La única versión que vale legalmente es la española, que prevalece si hay diferencias.',
      en: 'This translation is for information only. The Spanish version is the only legally binding one and prevails in case of any discrepancy.',
      nl: 'Deze vertaling is alleen ter informatie. Alleen de Spaanse versie is juridisch bindend en gaat bij verschillen voor.',
      h: { en: '7a8619d9', nl: '7a8619d9' }
    },
    'legal.toc': { es: 'Índice' },
    'legal.tocLabel': { es: 'Índice del documento' },

    /* I. Aviso legal */
    'legal.aviso.label': { es: 'Sección I. LSSI-CE, artículo 10' },
    'legal.aviso.title': { es: 'Aviso legal' },
    'legal.aviso.intro': { es: 'Esta página reúne la información legal de todo el sitio web, como pide el artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).' },
    'legal.aviso.ambitoTitle': { es: 'A qué páginas se aplica' },
    'legal.aviso.ambitoMarca': { es: '**Inicio (/)**: la página de Eleva Pádel. Presenta la marca y enlaza a la página de su club. No tiene formularios ni botones de contacto.' },
    'legal.aviso.ambitoClub': { es: '**Pizarra (/pizarra)**: la página del club Eleva Pádel Pizarra, en Pizarra (Málaga), con su información, tarifas, cancelaciones y contacto.' },
    'legal.aviso.ambitoLegal': { es: '**Información legal (/privacidad)**: esta página, enlazada desde el pie de las otras dos.' },
    'legal.aviso.ambitoNota': { es: 'La política de cancelaciones (sección II) es solo del club de Pizarra. El resto de esta página se aplica a todo el sitio.' },
    'legal.aviso.datosTitle': { es: 'Datos identificativos' },
    'legal.aviso.nombreDt': { es: 'Nombre comercial' },
    'legal.aviso.nombreDd': { es: 'Eleva Pádel (marca) y Eleva Pádel Pizarra (club)' },
    'legal.aviso.domicilioDt': { es: 'Domicilio del club' },
    'legal.aviso.domicilioDd': { es: 'Pasaje Jerez s/n, 29560 Pizarra, Málaga (España)' },
    'legal.aviso.contactoDt': { es: 'Contacto' },
    'legal.aviso.contactoDd': { es: 'Por [WhatsApp](https://wa.me/34659143103) al +34 659 14 31 03, en Instagram como [@elevapadelpizarra](https://instagram.com/elevapadelpizarra) o en persona, en la recepción del club.' },
    'legal.aviso.alojamientoDt': { es: 'Alojamiento web' },
    'legal.aviso.alojamientoDd': { es: 'Vercel Inc., en Estados Unidos. Más información en su [política de privacidad](https://vercel.com/legal/privacy-notice).' },
    'legal.aviso.usoTitle': { es: 'Condiciones de uso' },
    'legal.aviso.uso1': { es: 'Usar este sitio web supone aceptar estas condiciones. El contenido del sitio y estas condiciones pueden cambiar en cualquier momento: vale la versión publicada en esta página, con su fecha de actualización.' },
    'legal.aviso.uso2': { es: 'Los textos, el logotipo y el diseño propios de este sitio están protegidos por la normativa de propiedad intelectual e industrial, y no se pueden reproducir, ni entera ni parcialmente, sin autorización expresa. Las marcas de terceros que aparecen en él son de sus titulares.' },
    'legal.aviso.uso3': { es: 'No respondemos de los daños que pueda causar un uso incorrecto del sitio, ni del contenido de los sitios de terceros a los que enlaza.' },
    'legal.aviso.leyTitle': { es: 'Legislación y tribunales' },
    'legal.aviso.ley': { es: 'Estas condiciones se rigen por la legislación española. Cualquier conflicto sobre el uso de este sitio se resolverá ante los juzgados y tribunales que correspondan según la ley; si eres consumidor, ante los de tu domicilio.' },

    /* II. Cancelaciones (las condiciones salen del manifest del club) */
    'legal.cancel.label': { es: 'Sección II. Condiciones del club' },
    'legal.cancel.title': { es: 'Política de cancelaciones' },
    'legal.cancel.intro': { es: 'Estas son las condiciones de cancelación de Eleva Pádel Pizarra. Son las mismas que se publican en la [página del club](pizarra/index.html#cancelaciones).' },

    /* III. Privacidad */
    'legal.priv.label': { es: 'Sección III. RGPD y LOPDGDD' },
    'legal.priv.title': { es: 'Política de privacidad' },
    'legal.priv.intro': { es: 'Aquí te contamos qué datos personales se tratan cuando usas este sitio, para qué y qué derechos tienes, según el Reglamento (UE) 2016/679, general de protección de datos (RGPD), y la Ley Orgánica 3/2018, de 5 de diciembre, de protección de datos personales y garantía de los derechos digitales (LOPDGDD).' },
    'legal.priv.respTitle': { es: '3.1 Quién trata tus datos' },
    'legal.priv.resp': { es: 'Los datos que nos llegan por este sitio los recibe y los trata el club Eleva Pádel Pizarra, en Pasaje Jerez s/n, 29560 Pizarra, Málaga (España). Puedes escribirnos por [WhatsApp](https://wa.me/34659143103) al +34 659 14 31 03 o hablar con nosotros en la recepción del club.' },
    'legal.priv.datosTitle': { es: '3.2 Qué datos nos llegan y cómo' },
    'legal.priv.estatico': { es: 'Este sitio es estático: no tiene base de datos, ni área de clientes, ni registro de usuarios, y **no guarda en ningún servidor propio lo que escribes**.' },
    'legal.priv.formTitle': { es: 'El formulario «Escríbenos» de la página del club' },
    'legal.priv.form1': { es: 'Tiene tres campos, los tres obligatorios: nombre, teléfono y mensaje.' },
    'legal.priv.form2': { es: 'Al pulsar «Enviar por WhatsApp», tu navegador comprueba los campos, compone un mensaje con ellos y abre WhatsApp con ese mensaje ya escrito, dirigido al número del club. **No se envía nada a ningún servidor de este sitio.**' },
    'legal.priv.form3': { es: 'El mensaje va dentro del enlace que abre WhatsApp, así que WhatsApp puede recibir su contenido al abrirse. Al club solo le llega si lo envías tú: antes puedes cambiarlo o borrarlo.' },
    'legal.priv.form4': { es: 'Lo que escribes no se guarda en tu navegador: si recargas o cierras la página, se pierde. Sin JavaScript, el botón está desactivado y el formulario no hace nada.' },
    'legal.priv.enlacesTitle': { es: 'Los enlaces a otros servicios' },
    'legal.priv.enlaces': { es: 'Los botones de WhatsApp (algunos llevan un mensaje ya escrito, que puedes cambiar antes de enviarlo), el grupo de WhatsApp del club, Instagram, las reservas en Vola, el enlace para llegar con Google Maps y el de Biznaga Consulting del pie son enlaces: no cargan nada mientras no los pulsas. Al pulsarlos pasas a la aplicación o al sitio de ese servicio, que trata tus datos con sus propias condiciones.' },
    'legal.priv.marcaTitle': { es: 'La página de la marca' },
    'legal.priv.marca': { es: 'La página de inicio (/) no tiene formularios ni botones de WhatsApp: solo enlaza a la página del club.' },
    'legal.priv.visitaTitle': { es: 'Al visitar el sitio' },
    'legal.priv.vercel': { es: 'Vercel Inc., que aloja el sitio, puede registrar de forma automática datos técnicos de cada visita (dirección IP, fecha y hora, página pedida, respuesta del servidor y navegador) para que el servicio funcione y sea seguro.' },
    'legal.priv.propio': { es: 'Todo lo demás se sirve desde este mismo sitio: el código, las tipografías, los iconos y el plano del club, una imagen hecha con datos de OpenStreetMap. **Al cargar la página no se conecta con ningún otro servicio.**' },
    'legal.priv.resumen': { es: '**En resumen:** no guardamos tus datos en ningún servidor propio. Si nos escribes por WhatsApp, tratamos lo que nos cuentes solo para responderte y atender lo que nos pidas.' },
    'legal.priv.finTitle': { es: '3.3 Para qué y con qué base legal' },
    'legal.priv.fin1Dt': { es: 'Responder a lo que nos escribes' },
    'legal.priv.fin1Dd': { es: 'Contestar tus preguntas y atender tus reservas o inscripciones cuando nos escribes por WhatsApp o desde el formulario. Base legal: tu consentimiento, porque eres tú quien empieza la conversación (artículo 6.1.a del RGPD), y, si nos pides una reserva o una plaza, atender esa petición antes de un posible contrato (artículo 6.1.b del RGPD).' },
    'legal.priv.fin2Dt': { es: 'Que el sitio funcione y sea seguro' },
    'legal.priv.fin2Dd': { es: 'Los registros técnicos de Vercel. Base legal: el interés legítimo en que el sitio funcione y esté protegido (artículo 6.1.f del RGPD).' },
    'legal.priv.fin3Dt': { es: 'Recordar tu idioma' },
    'legal.priv.fin3Dd': { es: 'Guardar en tu navegador el idioma que eliges. Ese dato no sale de tu dispositivo: lo pides tú al elegir y está exento de consentimiento (artículo 22.2 de la LSSI-CE). Detalle en la [sección IV](#cookies).' },
    'legal.priv.fin4Dt': { es: 'Acceso durante el mantenimiento' },
    'legal.priv.fin4Dd': { es: 'La cookie `eleva-acceso`, solo para quienes gestionan el sitio mientras está en mantenimiento. Es estrictamente necesaria para lo que piden al entrar con su enlace de acceso y está exenta de consentimiento (artículo 22.2 de la LSSI-CE). Detalle en la [sección IV](#cookies).' },
    'legal.priv.sinPerfiles': { es: 'No usamos tus datos para publicidad, no hacemos perfiles y no tomamos decisiones automatizadas sobre ti.' },
    'legal.priv.destTitle': { es: '3.4 Quién más interviene' },
    'legal.priv.destIntro': { es: 'No cedemos tus datos a nadie para sus propios fines. Por cómo funciona el sitio, intervienen estos servicios:' },
    'legal.priv.destWaDt': { es: 'WhatsApp (Meta Platforms Ireland Ltd.)' },
    'legal.priv.destWaDd': { es: 'El servicio de mensajería por el que nos escribes y en el que está el grupo del club. Trata los datos por su cuenta, según su [política de privacidad](https://www.whatsapp.com/legal/privacy-policy-eea).' },
    'legal.priv.destIgDt': { es: 'Instagram (Meta Platforms Ireland Ltd.)' },
    'legal.priv.destIgDd': { es: 'La red social donde el club publica su actividad, [@elevapadelpizarra](https://instagram.com/elevapadelpizarra). Si entras, Meta trata tus datos según la [política de privacidad de Instagram](https://privacycenter.instagram.com/policy).' },
    'legal.priv.destVolaDt': { es: 'Vola' },
    'legal.priv.destVolaDd': { es: 'La plataforma de reservas de pistas. Al reservar sales de este sitio: la cuenta, la reserva y el pago los gestiona Vola por su cuenta, con sus propias condiciones.' },
    'legal.priv.destMapsDt': { es: 'Google Maps (Google)' },
    'legal.priv.destMapsDd': { es: 'Solo si pulsas el enlace para llegar al club: se abre Google Maps, que trata tus datos según la [política de privacidad de Google](https://policies.google.com/privacy).' },
    'legal.priv.destVercelDt': { es: 'Vercel Inc.' },
    'legal.priv.destVercelDd': { es: 'Aloja el sitio y registra los datos técnicos de las visitas como proveedor del servicio. Más información en su [política de privacidad](https://vercel.com/legal/privacy-notice).' },
    'legal.priv.destLeyDt': { es: 'Administraciones y juzgados' },
    'legal.priv.destLeyDd': { es: 'Solo cuando la ley nos obligue a comunicarles datos.' },
    'legal.priv.transTitle': { es: '3.5 Datos fuera del Espacio Económico Europeo' },
    'legal.priv.transIntro': { es: 'Meta y Vercel pueden tratar datos en Estados Unidos. Esas transferencias se apoyan en estas garantías del capítulo V del RGPD:' },
    'legal.priv.transMetaDt': { es: 'Meta (WhatsApp e Instagram)' },
    'legal.priv.transMetaDd': { es: 'El Marco de Privacidad de Datos UE-EE. UU. (decisión de adecuación de la Comisión Europea de 10 de julio de 2023) y, además, las cláusulas contractuales tipo de la Comisión (Decisión de Ejecución (UE) 2021/914). En el Espacio Económico Europeo, la responsable es Meta Platforms Ireland Ltd.' },
    'legal.priv.transVercelDt': { es: 'Vercel Inc.' },
    'legal.priv.transVercelDd': { es: 'Las cláusulas contractuales tipo de su acuerdo de tratamiento de datos (Data Processing Addendum).' },
    'legal.priv.transMas': { es: 'Si quieres más información sobre estas garantías, pídenosla por los canales del apartado 3.7.' },
    'legal.priv.plazoTitle': { es: '3.6 Cuánto tiempo' },
    'legal.priv.plazo1': { es: 'Lo que nos escribes se guarda el tiempo necesario para atenderte y, después, solo durante los plazos que exija la ley.' },
    'legal.priv.plazo2': { es: 'Los registros técnicos de Vercel se conservan durante los plazos que fija Vercel, que no dependen de nosotros.' },
    'legal.priv.plazo3': { es: 'Lo que se guarda en tu navegador dura lo que se indica en la [sección IV](#cookies).' },
    'legal.priv.derechosTitle': { es: '3.7 Tus derechos' },
    'legal.priv.derechosIntro': { es: 'Puedes ejercer en cualquier momento estos derechos que te da el RGPD:' },
    'legal.priv.derechosLabel': { es: 'Tus derechos sobre tus datos' },
    'legal.priv.dAcceso': { es: 'Acceso' },
    'legal.priv.dAccesoTxt': { es: 'Saber si tratamos datos tuyos, obtener una copia y saber para qué los usamos, de dónde salen y a quién se comunican.' },
    'legal.priv.dRect': { es: 'Rectificación' },
    'legal.priv.dRectTxt': { es: 'Corregir los datos que sean inexactos o estén incompletos.' },
    'legal.priv.dSupr': { es: 'Supresión' },
    'legal.priv.dSuprTxt': { es: 'Pedir que borremos tus datos, por ejemplo cuando ya no hagan falta para lo que se recogieron.' },
    'legal.priv.dOpos': { es: 'Oposición' },
    'legal.priv.dOposTxt': { es: 'Oponerte a que usemos tus datos cuando lo hacemos por interés legítimo.' },
    'legal.priv.dLim': { es: 'Limitación' },
    'legal.priv.dLimTxt': { es: 'Pedir que dejemos de usar tus datos mientras se comprueba si son exactos o se resuelve tu reclamación.' },
    'legal.priv.dPort': { es: 'Portabilidad' },
    'legal.priv.dPortTxt': { es: 'Recibir los datos que nos diste en un formato de uso común, o que se los pasemos a otro responsable cuando sea técnicamente posible.' },
    'legal.priv.dRetirar': { es: 'Retirar el consentimiento' },
    'legal.priv.dRetirarTxt': { es: 'Retirarlo cuando quieras. Lo que hicimos antes con tu consentimiento sigue siendo válido.' },
    'legal.priv.ejercerTitle': { es: 'Cómo ejercerlos' },
    'legal.priv.ejercer': { es: 'Es gratis. Escríbenos por [WhatsApp](https://wa.me/34659143103) al +34 659 14 31 03 o pásate por la recepción del club, y dinos qué derecho quieres ejercer. Solo si tenemos dudas razonables sobre quién eres te pediremos que lo acredites (artículo 12.6 del RGPD).' },
    'legal.priv.respuesta': { es: 'Te responderemos en un mes como máximo desde que recibamos tu petición. Si es especialmente compleja o hay muchas peticiones, el plazo puede alargarse dos meses más; en ese caso te lo diremos dentro del primer mes y te explicaremos por qué.' },
    'legal.priv.aepd': { es: '**Reclamar ante la AEPD.** Si crees que no tratamos bien tus datos o que no hemos atendido tu petición, puedes reclamar ante la Agencia Española de Protección de Datos en su sede electrónica, [www.aepd.es](https://www.aepd.es), o en C/ Jorge Juan, 6, 28001 Madrid. Antes, si quieres, cuéntanoslo y lo intentamos resolver.' },

    /* IV. Cookies y almacenamiento en el navegador */
    'legal.cookies.label': { es: 'Sección IV. LSSI-CE, artículo 22.2' },
    'legal.cookies.title': { es: 'Cookies y almacenamiento en el navegador' },
    'legal.cookies.que': { es: 'Las cookies son pequeños archivos que un sitio web guarda en tu dispositivo. El almacenamiento local del navegador (`localStorage`) sirve para lo mismo. Esta sección explica todo lo que este sitio guarda en tu navegador.' },
    'legal.cookies.noUsa': { es: '**No usamos cookies de análisis, de publicidad ni de redes sociales**, ni herramientas de analítica, píxeles o identificadores de seguimiento. No medimos ni perfilamos a quien visita el sitio.' },
    'legal.cookies.listaTitle': { es: 'Lo que se guarda en tu navegador' },
    'legal.cookies.campoTipo': { es: 'Qué es' },
    'legal.cookies.campoCuando': { es: 'Cuándo se guarda' },
    'legal.cookies.campoPara': { es: 'Para qué' },
    'legal.cookies.campoDura': { es: 'Cuánto dura' },
    'legal.cookies.campoConsent': { es: 'Consentimiento' },
    'legal.cookies.langTipo': { es: 'Almacenamiento local del navegador (`localStorage`), propio.' },
    'legal.cookies.langCuando': { es: 'Solo cuando eliges un idioma en el selector, en cualquier página del sitio.' },
    'legal.cookies.langPara': { es: 'Recordar el idioma que has elegido (español, inglés o neerlandés) en tus próximas visitas.' },
    'legal.cookies.langDura': { es: 'Hasta que borres los datos de este sitio en tu navegador.' },
    'legal.cookies.langConsent': { es: 'No hace falta: lo pides tú al elegir el idioma.' },
    'legal.cookies.accesoTipo': { es: 'Cookie propia y técnica (`HttpOnly`, `SameSite=Lax` y `Secure`).' },
    'legal.cookies.accesoCuando': { es: 'Solo mientras el sitio está en mantenimiento y únicamente a quien entra con el enlace de acceso de las personas que lo gestionan. A quien visita el sitio no se le guarda.' },
    'legal.cookies.accesoPara': { es: 'Dejar ver el sitio a esas personas mientras los demás ven la página de mantenimiento.' },
    'legal.cookies.accesoDura': { es: '30 días.' },
    'legal.cookies.accesoConsent': { es: 'No hace falta: es estrictamente necesaria para lo que pide quien usa ese enlace.' },
    'legal.cookies.vercelNombre': { es: 'Cookie de seguridad de Vercel' },
    'legal.cookies.vercelTipo': { es: 'Cookie técnica de Vercel Inc., el alojamiento del sitio.' },
    'legal.cookies.vercelCuando': { es: 'Solo si el sistema de seguridad de Vercel detecta tráfico anómalo y muestra una página de comprobación antes del sitio.' },
    'legal.cookies.vercelPara': { es: 'No volver a pedirte esa comprobación.' },
    'legal.cookies.vercelDura': { es: 'La que fije Vercel, según su [política de privacidad](https://vercel.com/legal/privacy-notice).' },
    'legal.cookies.vercelConsent': { es: 'No hace falta: es una cookie de seguridad del servicio.' },
    'legal.cookies.nadaMas': { es: 'No se guarda nada más: este sitio no usa `sessionStorage`, IndexedDB ni ninguna otra forma de almacenamiento en el navegador.' },
    'legal.cookies.banner': { es: '**Por eso no hay aviso de cookies.** Solo hay que pedir consentimiento para las cookies o técnicas que lo necesitan, y aquí no hay ninguna. Si algún día se añade una herramienta de analítica o de publicidad, antes de activarla se pedirá tu consentimiento y se actualizará esta página.' },
    'legal.cookies.borrarTitle': { es: 'Cómo borrar lo guardado' },
    'legal.cookies.borrar': { es: 'Puedes borrar las cookies y los datos de este sitio desde la configuración de tu navegador, o navegar en una ventana privada, que no guarda nada al cerrarla. Sin el idioma guardado, el sitio se ve en el primero de los idiomas de tu navegador que sea español, inglés o neerlandés; si no hay ninguno, en español.' },
    'legal.cookies.navegadores': { es: 'Cómo hacerlo en los navegadores más usados:' },
    'legal.cookies.chrome': { es: '[Google Chrome](https://support.google.com/chrome/answer/95647)' },
    'legal.cookies.firefox': { es: '[Mozilla Firefox](https://support.mozilla.org/kb/clear-cookies-and-site-data-firefox)' },
    'legal.cookies.safari': { es: '[Safari](https://support.apple.com/guide/safari/sfri11471/mac)' },
    'legal.cookies.edge': { es: '[Microsoft Edge](https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)' }
  };

  if (typeof module === 'object' && module.exports) module.exports = { textos: TEXTOS };
  else if (root.ElevaTextos) {
    for (var k in TEXTOS) if (Object.prototype.hasOwnProperty.call(TEXTOS, k)) root.ElevaTextos.textos[k] = TEXTOS[k];
  }
})(this);
