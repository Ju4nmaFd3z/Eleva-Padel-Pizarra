/* =========================================================
   Fallos conocidos del sitio
   ---------------------------------------------------------
   Fallos REALES ya apuntados y pendientes de arreglo. No se
   silencian: la batería los imprime en su propio bloque en
   cada ejecución. No cambian el código de salida mientras
   sigan ocurriendo exactamente así.

   Cada entrada:
     caso      RegExp sobre el id del caso (solo los tamaños,
               páginas y modos donde se ha visto)
     fallos    lista EXACTA de fallos { tipo, clave, detalle }:
               se comparan como texto, medida incluida. Un fallo
               nuevo en el mismo elemento o con otra medida no
               coincide y hace fallar la batería.
     motivo    qué pasa, en una línea
     apuntado  fecha (AAAA-MM-DD) e informe donde se describe

   Si un fallo de la lista deja de ocurrir en todos los casos
   ejecutados que cubre la entrada, la batería falla hasta que
   se quita de la lista (quien lo arregla la borra en el mismo
   commit). Nunca se añade una entrada para silenciar un fallo
   nuevo: los fallos se arreglan.
   ========================================================= */
'use strict';

const TACTILES = '(320x640|360x780|375x812|390x844|414x896|430x932|667x375-apaisado|844x390-apaisado|932x430-apaisado|768x1024|1024x768-tableta|820x1180|1180x820|1024x1366|1366x1024)';
const pequeno = (clave, medida) => ({ tipo: 'objetivo-pequeno', clave, detalle: medida + ' px (mínimo 44)' });
const partida = (clave, detalle) => ({ tipo: 'palabra-partida', clave, detalle });

module.exports = [
  {
    caso: new RegExp('^responsive · privacidad · ' + TACTILES + ' · es · (normal|reducido|sinjs)$'),
    fallos: [
      pequeno('a.back-link[index.html] «Eleva Pádel · marca»', '160×21'),
      pequeno('a.back-link[pizarra/index.html] «Club de Pizarra»', '134×21'),
      pequeno('a[#aviso-legal] «Aviso Legal»', '69×29'),
      pequeno('a[#cancelaciones] «Política de Cancelaciones»', '154×29'),
      pequeno('a[#normas] «Normas del Club»', '98×29'),
      pequeno('a[#privacidad] «Política de Privacidad»', '130×29'),
      pequeno('a[#fuera-web] «Datos que tratamos fuera de la»', '212×29'),
      pequeno('a[#cookies] «Política de Cookies»', '114×29'),
      pequeno('a[https://support.google.com/chrome/answer/95647] «Google Chrome»', '95×29'),
      pequeno('a[https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-c] «Mozilla Firefox»', '89×29'),
      pequeno('a[https://support.apple.com/es-es/guide/safari/sfri11471/mac] «Apple Safari»', '75×29'),
      pequeno('a[https://support.microsoft.com/es-es/windows/eliminar-y-admin] «Microsoft Edge»', '94×29'),
      pequeno('a[https://eleva-padel-pizarra.vercel.app/] «eleva-padel-pizarra.vercel.app»', '185×17'),
      pequeno('a[https://eleva-padel-pizarra.vercel.app/] «eleva-padel-pizarra.vercel.app»', '109×42')
    ],
    motivo: '/privacidad: en táctil, los enlaces del índice (29 px), «volver» (21 px), los de navegadores (29 px) y el de la tabla (17-42 px) miden menos de 44 px',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 1'
  },
  {
    caso: /^responsive · privacidad · (320x640|360x780|375x812|390x844|414x896|430x932) · es · (normal|reducido|sinjs)$/,
    fallos: [
      partida('td «eleva-lang» «eleva-lang»', '63 px en 45 px'),
      partida('td «eleva-splash-seen» «eleva-splash-seen»', '111 px en 45 px'),
      partida('a[https://eleva-padel-pizarra.vercel.app/] «eleva-padel-pizarra.vercel.app» «eleva-padel-pizarra.vercel.app»', '185 px en 144 px'),
      partida('a[https://eleva-padel-pizarra.vercel.app/] «eleva-padel-pizarra.vercel.app» «eleva-padel-pizarra.vercel.app»', '185 px en 182 px')
    ],
    motivo: '/privacidad: en móvil, las claves de almacenamiento y la URL de la tabla no caben en su columna y se parten',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 2'
  },
  {
    caso: /^responsive · marca · (1920x1080|2560x1440) · es · normal$/,
    fallos: [
      partida('span.hero-linea «Eleva» «Eleva»', '549 px en 508 px'),
      partida('span.hero-linea «Pádel» «Pádel»', '563 px en 508 px'),
      partida('span.hero-linea «Eleva» «Eleva»', '549 px en 238 px'),
      partida('span.hero-linea «Pádel» «Pádel»', '563 px en 238 px'),
      Object.assign(partida('span.hero-linea «Eleva» «Eleva»', '549 px en 508 px'), { tipo: 'palabra-partida (idiomas abiertos)' }),
      Object.assign(partida('span.hero-linea «Pádel» «Pádel»', '563 px en 508 px'), { tipo: 'palabra-partida (idiomas abiertos)' }),
      Object.assign(partida('span.hero-linea «Eleva» «Eleva»', '549 px en 238 px'), { tipo: 'palabra-partida (idiomas abiertos)' }),
      Object.assign(partida('span.hero-linea «Pádel» «Pádel»', '563 px en 238 px'), { tipo: 'palabra-partida (idiomas abiertos)' })
    ],
    motivo: '/ en pantallas anchas (1920 y 2560 px): el titular del hero se parte dentro de las palabras («ELEV / A», «PÁ- / DEL»; a 2560 en tres trozos): la columna mide 508 y 238 px y la letra 256 px',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 3'
  },
  {
    caso: /^responsive · pizarra · (667x375-apaisado · es · normal|768x1024 · es · normal|zoom200 · es · (normal|sinjs))$/,
    fallos: [
      partida('h3 «Reservas de pista» «Reservas»', '276 px en 249 px'),
      partida('h3 «Reservas de pista» «Reservas»', '304 px en 290 px'),
      partida('h3 «Reservas de pista» «Reservas»', '265 px en 239 px')
    ],
    motivo: '/pizarra, Cancelaciones: el título «Reservas de pista» se parte en «RESER- / VAS» a 667, 768 y 640 px (zoom 200 %)',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 4'
  },
  {
    caso: /^responsive · pizarra · (320x640|390x844) · nl · (normal|reducido)$/,
    fallos: [
      partida('h2#cancelaciones-titulo «Annuleringsbeleid» «Annuleringsbeleid»', '351 px en 288 px'),
      partida('h2#cancelaciones-titulo «Annuleringsbeleid» «Annuleringsbeleid»', '371 px en 358 px')
    ],
    motivo: '/pizarra en NL: el título «Annuleringsbeleid» no cabe a 320 ni a 390 px y se parte',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 5'
  },
  {
    caso: /^responsive · pizarra · (320x640|390x844) · es · sinjs$/,
    fallos: [
      { tipo: 'nombre-del-club', clave: 'logo-nombre', detalle: 'visible a 320 px (debe estar oculto desde/por debajo de 408 px)' },
      { tipo: 'nombre-del-club', clave: 'logo-nombre', detalle: 'visible a 390 px (debe estar oculto desde/por debajo de 408 px)' }
    ],
    motivo: '/pizarra sin JS: el nombre del club se ve en la cabecera por debajo de 408 px (decisión 1 del encargo: oculto, con y sin JS)',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 6'
  }
];
