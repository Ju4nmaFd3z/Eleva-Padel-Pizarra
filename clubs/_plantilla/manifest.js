/* =========================================================
   PLANTILLA DE MANIFEST DE CLUB (no se publica: clubs/ está en .vercelignore)
   ---------------------------------------------------------
   Copia este archivo a /<slug>/manifest.js y rellénalo SOLO con datos
   confirmados por el club. Lo que no esté confirmado se queda como
   PENDIENTE_CLUB (no se pinta) y su valor propuesto se apunta en
   CONFIRMAR.md, nunca aquí: el repo es público y el manifest llega al
   navegador. Esquema de referencia: pizarra/manifest.js.

   · Textos traducibles: { es, en, nl } (si falta un idioma se usa `es`).
   · Datos que pueden cambiar: `verificado: 'AAAA-MM-DD'` + `fuente`.
   · Rutas de assets con "../".
   ========================================================= */
(function () {
  var PENDIENTE_CLUB = 'PENDIENTE_CLUB';

  window.__ELEVA__ = {

    sede: { slug: PENDIENTE_CLUB, nombre: PENDIENTE_CLUB, ciudad: PENDIENTE_CLUB },

    contacto: {
      whatsapp:        PENDIENTE_CLUB,   /* solo dígitos con prefijo, p. ej. 34XXXXXXXXX */
      whatsappDisplay: PENDIENTE_CLUB,
      llamadas:        PENDIENTE_CLUB,   /* sin confirmar → no hay enlaces tel: */
      instagram:       PENDIENTE_CLUB,   /* { url, handle } */
      comunidad:       PENDIENTE_CLUB,   /* invitación al grupo de WhatsApp */
      reservas:        PENDIENTE_CLUB,   /* URL de la plataforma de reservas */
      direccion:       PENDIENTE_CLUB,
      mapsUrl:         PENDIENTE_CLUB,
      geo:             PENDIENTE_CLUB,   /* { lat, lng } para generar-mapa.js */
      mapImage:        PENDIENTE_CLUB,   /* '../assets/maps/<slug>.svg' */
      horario:         PENDIENTE_CLUB    /* { es, en, nl } */
    },

    instalaciones:  PENDIENTE_CLUB,      /* { verificado, fuente, items: [ {es}, … ] } */
    reservas:       PENDIENTE_CLUB,      /* { verificado, fuente, canales: {es} } */

    tarifas: {
      pistas:      PENDIENTE_CLUB,
      ivaIncluido: PENDIENTE_CLUB,
      clases:      PENDIENTE_CLUB,       /* { verificado, fuente, grupo:{titulo,precio,unidad,detalle}, otras:{…} } */
      infantil:    PENDIENTE_CLUB
    },

    otrosServicios: PENDIENTE_CLUB,      /* { verificado, fuente, texto: {es} } */
    cancelaciones:  PENDIENTE_CLUB,      /* { verificado, fuente, pistas:{titulo,items}, clases:{…}, nota } */
    pools:          PENDIENTE_CLUB,      /* { verificado, fuente, texto, insignias:[ {img, alt} ] } */
    equipo:         [],                  /* [ { nombre, foto|null, rol, bio } ] */
    patrocinadores: [],                  /* [ { nombre, tipo } ] */
    colaborar:      PENDIENTE_CLUB,
    galeria:        [],                  /* [ { base, w, h, alt:{es} } ] */
    eventos:        []                   /* [ { id, titulo, texto, desde?, hasta (OBLIGATORIO), enlace? } ] */
  };
})();
