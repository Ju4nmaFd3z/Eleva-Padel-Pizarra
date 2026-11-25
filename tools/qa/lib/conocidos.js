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

const partida = (clave, detalle) => ({ tipo: 'palabra-partida', clave, detalle });

module.exports = [];
