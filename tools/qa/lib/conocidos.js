/* =========================================================
   Fallos conocidos del sitio
   ---------------------------------------------------------
   Fallos REALES ya apuntados y pendientes de arreglo. No se
   silencian: la batería los imprime en su propio bloque en
   cada ejecución. No cambian el código de salida mientras
   sigan ocurriendo exactamente así; si uno deja de ocurrir,
   la batería falla hasta que se quite su entrada (quien lo
   arregla la borra en el mismo commit).

   Cada entrada:
     caso         RegExp sobre el id del caso
     tipo         RegExp sobre el tipo de fallo
     clave        RegExp sobre la clave (elemento o mensaje)
     motivo       qué pasa, en una línea
     apuntado     fecha (AAAA-MM-DD) e informe donde se describe
   Una entrada sin coincidencias en los casos ejecutados que
   cubre se considera resuelta.
   ========================================================= */
'use strict';

module.exports = [
  {
    caso: /^responsive · privacidad · /,
    tipo: /^objetivo-pequeno/,
    clave: /^a\b/,
    motivo: '/privacidad: en táctil, los enlaces del índice (29 px), «volver» (21 px), los de navegadores (29 px) y el de la tabla miden menos de 44 px',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 1'
  },
  {
    caso: /^responsive · privacidad · /,
    tipo: /^palabra-partida/,
    clave: /«(eleva-lang|eleva-splash-seen|eleva-padel-pizarra\.vercel\.app)»$/,
    motivo: '/privacidad: en móvil, las claves de almacenamiento y la URL de la tabla no caben en su columna y se parten',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 2'
  },
  {
    caso: /^responsive · marca · (1920x1080|2560x1440) · /,
    tipo: /^palabra-partida/,
    clave: /^span\.hero-linea/,
    motivo: '/ en pantallas anchas (1920 y 2560 px): el titular del hero se parte dentro de las palabras («ELEV / A», «PÁ- / DEL»; a 2560 en tres trozos): la columna mide 508 y 238 px y la letra 256 px',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 3'
  },
  {
    caso: /^responsive · pizarra · (667x375-apaisado|768x1024|zoom200) · /,
    tipo: /^palabra-partida/,
    clave: /«Reservas de pista» «Reservas»$/,
    motivo: '/pizarra, Cancelaciones: el título «Reservas de pista» se parte en «RESER- / VAS» a 667, 768 y 640 px (zoom 200 %)',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 4'
  },
  {
    caso: /^responsive · pizarra · (320x640|390x844) · nl · /,
    tipo: /^palabra-partida/,
    clave: /«Annuleringsbeleid»$/,
    motivo: '/pizarra en NL: el título «Annuleringsbeleid» no cabe a 320 ni a 390 px y se parte',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 5'
  },
  {
    caso: /^responsive · pizarra · (320x640|390x844) · es · sinjs$/,
    tipo: /^nombre-del-club$/,
    clave: /^logo-nombre$/,
    motivo: '/pizarra sin JS: el nombre del club se ve en la cabecera por debajo de 408 px (decisión 1 del encargo: oculto, con y sin JS)',
    apuntado: '2026-10-07 · cierre/qa/INFORME.md, fallo 6'
  }
];
