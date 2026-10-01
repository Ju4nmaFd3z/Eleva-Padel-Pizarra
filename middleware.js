/* =========================================================
   MODO MANTENIMIENTO (Routing Middleware de Vercel)
   ---------------------------------------------------------
   Activar:     variable de entorno MANTENIMIENTO=1 en Vercel
                + Redeploy (las variables solo se aplican a
                despliegues nuevos).
   Desactivar:  borrar la variable o ponerla a 0 + Redeploy.
   Saltárselo:  visitar cualquier URL con ?acceso=<clave>, donde
                <clave> es la variable MANTENIMIENTO_CLAVE. Deja
                una cookie durante 30 días.

   La clave NUNCA se escribe en el repo (es público).
   Sin dependencias: solo Request/Response estándar.
   tools/servidor-local.js carga este mismo archivo.
   ========================================================= */

export const config = { runtime: 'nodejs' };

const COOKIE = 'eleva-acceso';
const DIAS_COOKIE = 30;
const RETRY_AFTER = '3600';

/* Se sirven siempre, también en mantenimiento */
const LIBRES = new Set([
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/assets/img/favicon.svg',
  '/robots.txt',
  '/assets/marcas/whatsapp-glifo-blanco.svg',
  '/assets/marcas/instagram-glifo-blanco.svg'
]);

const CSP = "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; " +
  "base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

const PAGINA = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>Eleva Pádel</title>
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<style>
  :root { --fondo:#000000; --texto:#EDE4DC; --suave:#DBD2CC; --oro:#947E6B; }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0; min-height: 100vh; min-height: 100dvh;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: max(2rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
             max(2rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
    background: var(--fondo); color: var(--texto);
    font: 400 1rem/1.6 system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    text-align: center;
  }
  main { max-width: 30rem; }
  .logo { display: block; width: clamp(4rem, 18vw, 5.5rem); height: auto; margin: 0 auto 1.25rem; }
  ul a { color: var(--texto); }
  h1 { font-size: clamp(1.75rem, 7vw, 2.5rem); line-height: 1.15; margin: 0 0 .75rem; }
  p { margin: 0 0 1.5rem; color: var(--suave); }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: .75rem; }
  a { color: var(--oro); }
  ul a {
    display: flex; align-items: center; justify-content: center;
    min-height: 44px; padding: .5rem 1rem;
    border: 1px solid var(--oro); border-radius: 4px; text-decoration: none;
  }
  ul a { gap: .625rem; }
  ul a:hover, ul a:focus-visible { border-color: var(--texto); }
  footer { margin-top: 3rem; font-size: .875rem; color: var(--suave); }
  /* Móvil en horizontal: todo en una pantalla */
  @media (max-height: 30rem) and (orientation: landscape) {
    .logo { width: 3rem; margin-bottom: .75rem; }
    h1 { margin-bottom: .25rem; }
    p { margin-bottom: 1rem; }
    main { max-width: 44rem; }
    ul { grid-auto-flow: column; }
    footer { margin-top: 1.5rem; }
  }
</style>
</head>
<body>
<main>
  <img class="logo" src="/assets/img/favicon.svg" width="88" height="88" alt="Logo de Eleva Pádel">
  <h1>Eleva Pádel</h1>
  <p>La web está en mantenimiento. Mientras tanto, puedes escribirnos.</p>
  <ul>
    <li><a href="https://wa.me/34659143103" rel="noopener noreferrer"><img src="/assets/marcas/whatsapp-glifo-blanco.svg" width="20" height="20" alt="">WhatsApp +34 659 14 31 03</a></li>
    <li><a href="https://instagram.com/elevapadelpizarra" rel="noopener noreferrer"><img src="/assets/marcas/instagram-glifo-blanco.svg" width="20" height="20" alt="">Instagram @elevapadelpizarra</a></li>
  </ul>
</main>
<footer>
  Desarrollado por <a href="https://biznagaconsulting.es/" target="_blank" rel="noopener noreferrer">Biznaga Consulting</a>
</footer>
</body>
</html>
`;

function leerCookie(request, nombre) {
  const cabecera = request.headers.get('cookie') || '';
  for (const trozo of cabecera.split(';')) {
    const i = trozo.indexOf('=');
    if (i > -1 && trozo.slice(0, i).trim() === nombre) return trozo.slice(i + 1).trim();
  }
  return null;
}

export default function middleware(request) {
  const env = (typeof process !== 'undefined' && process.env) || {};
  if (env.MANTENIMIENTO !== '1') return; // sin respuesta: la petición sigue su curso normal

  const url = new URL(request.url);
  if (LIBRES.has(url.pathname)) return;

  const clave = env.MANTENIMIENTO_CLAVE;
  if (clave) {
    if (url.searchParams.get('acceso') === clave) {
      url.searchParams.delete('acceso');
      const segura = url.protocol === 'https:' ? '; Secure' : '';
      return new Response(null, {
        status: 303,
        headers: {
          'Location': url.pathname + url.search,
          'Set-Cookie': `${COOKIE}=${encodeURIComponent(clave)}; Path=/; Max-Age=${DIAS_COOKIE * 86400}; HttpOnly; SameSite=Lax${segura}`,
          'Cache-Control': 'no-store'
        }
      });
    }
    if (leerCookie(request, COOKIE) === encodeURIComponent(clave)) return;
  }

  return new Response(PAGINA, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': RETRY_AFTER,
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });
}
