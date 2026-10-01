/* ================================================================
   Eleva Pádel — render.js
   Convierte el manifest de un club en HTML. Lo usan:
   · tools/generar.js (Node), que escribe el HTML en español en la página,
     para que todo lo confirmado se vea sin JavaScript;
   · js/main.js (navegador), que vuelve a pintar al cambiar de idioma.
   Regla: un dato vacío o marcado PENDIENTE_* no se pinta, y una sección
   sin datos se oculta. Los avisos con fecha (eventos) NO pasan por aquí:
   solo los pinta el navegador, para que caduquen solos.
   ================================================================ */
(function (root) {
  'use strict';

  var POOLS_BASE = '../assets/pools/opt/';

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function presente(v) {
    if (v == null || v === '' || v === false) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'string') return v.indexOf('PENDIENTE_') !== 0;
    return true;
  }

  /* Contexto de pintado: idioma y función de traducción de la interfaz */
  function crear(data, lang, t) {
    function L(v) {
      if (v == null) return '';
      if (typeof v === 'string') return v;
      return v[lang] || v.es || '';
    }
    function lista(items, cls) {
      return '<ul' + (cls ? ' class="' + cls + '"' : '') + '>' +
        items.map(function (i) { return '<li>' + esc(L(i)) + '</li>'; }).join('') + '</ul>';
    }
    function enlace(url, texto, cls) {
      return '<a' + (cls ? ' class="' + cls + '"' : '') + ' href="' + esc(url) +
        '" target="_blank" rel="noopener noreferrer">' + esc(texto) + '</a>';
    }

    var d = data || {};
    var c = d.contacto || {};
    var s = {};   /* id → { html, visible } */

    /* El club */
    var filas = [];
    if (d.instalaciones && presente(d.instalaciones.items)) {
      filas.push([t('club.facilities'), lista(d.instalaciones.items)]);
    }
    if (presente(c.horario)) filas.push([t('club.hours'), esc(L(c.horario))]);
    if (d.reservas && presente(c.reservas)) {
      filas.push([t('club.bookings'), '<p>' + esc(L(d.reservas.canales)) + '</p>' +
        enlace(c.reservas, t('club.bookOnline'), 'enlace')]);
    }
    if (presente(c.comunidad)) filas.push([t('club.community'), enlace(c.comunidad, t('contact.communityLink'), 'enlace')]);
    s.club = {
      html: filas.map(function (f) { return '<div class="dato"><dt>' + esc(f[0]) + '</dt><dd>' + f[1] + '</dd></div>'; }).join(''),
      visible: filas.length > 0
    };

    /* Clases */
    function tarjeta(b) {
      if (!b) return '';
      return '<article class="tarjeta">' +
        '<h3 class="tarjeta-titulo">' + esc(L(b.titulo)) + '</h3>' +
        (presente(b.precio) ? '<p class="precio">' + esc(b.precio) + ' <span>' + esc(L(b.unidad)) + '</span></p>' : '') +
        (presente(b.detalle) ? lista(b.detalle, 'lista') : '') +
        '</article>';
    }
    var tf = d.tarifas || {};
    var cl = presente(tf.clases) ? tf.clases : null;
    var inf = presente(tf.infantil) ? tf.infantil : null;
    s.clases = {
      html: (cl ? tarjeta(cl.grupo) + tarjeta(cl.otras) : '') + (inf ? tarjeta(inf) : ''),
      visible: !!(cl || inf)
    };

    /* Pools: insignias reales */
    var p = d.pools;
    var hayPools = !!(p && presente(p.insignias));
    s.pools = {
      html: hayPools ? p.insignias.map(function (i) {
        var b = POOLS_BASE + i.img;
        return '<li><picture>' +
          '<source type="image/avif" srcset="' + b + '-240.avif 240w, ' + b + '-480.avif 480w, ' + b + '-720.avif 720w" ' +
          'sizes="(min-width: 64rem) 15rem, (min-width: 40rem) 30vw, 45vw">' +
          '<img src="' + b + '-480.jpg" width="480" height="480" loading="lazy" decoding="async" alt="' + esc(i.alt) + '">' +
          '</picture></li>';
      }).join('') : '',
      visible: hayPools
    };
    s['pools-texto'] = { html: hayPools ? esc(L(p.texto)) : '', visible: hayPools };

    /* Otros servicios */
    var os = d.otrosServicios;
    s.servicios = { html: presente(os) ? esc(L(os.texto)) : '', visible: presente(os) };

    /* Cancelaciones */
    var cn = d.cancelaciones;
    s.cancelaciones = {
      html: presente(cn) ? [cn.pistas, cn.clases].filter(Boolean).map(function (b) {
        return '<div class="bloque"><h3>' + esc(L(b.titulo)) + '</h3>' + lista(b.items, 'lista') + '</div>';
      }).join('') + (cn.nota ? '<p class="nota">' + esc(L(cn.nota)) + '</p>' : '') : '',
      visible: presente(cn)
    };

    /* Equipo: nombre siempre; foto, cargo y bio solo si están confirmados */
    s.equipo = {
      html: presente(d.equipo) ? d.equipo.map(function (m) {
        var foto = presente(m.foto)
          ? '<img class="persona-foto" src="' + esc(m.foto) + '" width="632" height="800" loading="lazy" decoding="async" alt="">'
          : '<span class="persona-foto persona-inicial" aria-hidden="true">' + esc(String(m.nombre).charAt(0)) + '</span>';
        return '<li class="persona">' + foto + '<h3>' + esc(m.nombre) + '</h3>' +
          (presente(m.rol) ? '<p class="persona-rol">' + esc(L(m.rol)) + '</p>' : '') +
          (presente(m.bio) ? '<p>' + esc(L(m.bio)) + '</p>' : '') + '</li>';
      }).join('') : '',
      visible: presente(d.equipo)
    };

    /* Patrocinadores: solo con la lista completa confirmada */
    var pt = d.patrocinadores || {};
    var hayPatro = pt.listaCompleta === true && presente(pt.items);
    s.patrocinadores = {
      html: hayPatro ? pt.items.map(function (x) {
        return '<li>' + esc(x.nombre) + (presente(x.tipo) ? ' <span>' + esc(L(x.tipo)) + '</span>' : '') + '</li>';
      }).join('') : '',
      visible: hayPatro
    };

    /* Galería: solo fotos reales, AVIF + JPEG en varios tamaños */
    s.galeria = {
      html: presente(d.galeria) ? d.galeria.map(function (f) {
        return '<li><picture>' +
          '<source type="image/avif" srcset="' + f.base + '-480.avif 480w, ' + f.base + '-960.avif 960w, ' + f.base + '-1440.avif 1440w" ' +
          'sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw">' +
          '<img src="' + esc(f.base) + '-960.jpg" width="' + esc(f.w) + '" height="' + esc(f.h) + '" loading="lazy" decoding="async" alt="' + esc(L(f.alt)) + '">' +
          '</picture></li>';
      }).join('') : '',
      visible: presente(d.galeria)
    };

    /* Contacto */
    var dc = [];
    if (presente(c.whatsapp)) dc.push(['WhatsApp', enlace('https://wa.me/' + c.whatsapp, c.whatsappDisplay, 'enlace')]);
    if (presente(c.instagram)) dc.push(['Instagram', enlace(c.instagram.url, c.instagram.handle, 'enlace')]);
    if (presente(c.direccion)) {
      dc.push([t('contact.address'), '<p>' + esc(c.direccion) + '</p>' +
        (presente(c.mapsUrl) ? enlace(c.mapsUrl, t('contact.maps'), 'enlace') : '')]);
    }
    if (presente(c.comunidad)) dc.push([t('contact.community'), enlace(c.comunidad, t('contact.communityLink'), 'enlace')]);
    s.contacto = {
      html: dc.map(function (f) { return '<div class="dato"><dt>' + esc(f[0]) + '</dt><dd>' + f[1] + '</dd></div>'; }).join(''),
      visible: dc.length > 0
    };

    /* Plano estático (OpenStreetMap, ODbL): solo con coordenadas confirmadas */
    var hayMapa = presente(c.mapImage) && presente(c.geo) && presente(c.mapsUrl);
    s.mapa = {
      html: hayMapa ? '<a href="' + esc(c.mapsUrl) + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + esc(c.mapImage) + '" width="1200" height="480" loading="lazy" decoding="async" alt="' + esc(t('contact.mapAlt')) + '"></a>' +
        '<figcaption>© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors</figcaption>' : '',
      visible: hayMapa
    };

    /* Pie */
    var pie = [];
    if (presente(c.whatsapp)) pie.push(enlace('https://wa.me/' + c.whatsapp, 'WhatsApp ' + c.whatsappDisplay));
    if (presente(c.instagram)) pie.push(enlace(c.instagram.url, 'Instagram ' + c.instagram.handle));
    if (presente(c.reservas)) pie.push(enlace(c.reservas, t('footer.bookings')));
    s['pie-contacto'] = { html: pie.map(function (x) { return '<li>' + x + '</li>'; }).join(''), visible: pie.length > 0 };

    return s;
  }

  /* JSON-LD del club (solo datos confirmados; nunca eventos ni horarios sin confirmar) */
  function jsonld(data, base) {
    var d = data || {}, c = d.contacto || {}, sede = d.sede || {};
    var url = base + '/' + sede.slug;
    var o = {
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      '@id': url + '#club',
      name: sede.nombre,
      url: url
    };
    if (presente(d.seo) && presente(d.seo.descripcion)) o.description = d.seo.descripcion;
    if (presente(d.seo) && presente(d.seo.imagen)) o.image = base + '/' + d.seo.imagen;
    if (presente(c.direccionPostal)) {
      o.address = Object.assign({ '@type': 'PostalAddress' }, c.direccionPostal);
    }
    if (presente(c.geo)) o.geo = { '@type': 'GeoCoordinates', latitude: c.geo.lat, longitude: c.geo.lng };
    if (presente(c.mapsUrl)) o.hasMap = c.mapsUrl;
    if (presente(c.instagram)) o.sameAs = [c.instagram.url];
    o.parentOrganization = { '@type': 'Organization', '@id': base + '/#organization', name: 'Eleva Pádel', url: base + '/' };
    return JSON.stringify(o, null, 2);
  }

  var api = { crear: crear, jsonld: jsonld, presente: presente, esc: esc };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ElevaRender = api;
})(this);
