three.js r186 (paquete npm three@0.186.0), licencia MIT: ver LICENSE (copiada
del paquete). Autoalojado: la CSP es 'self' y no hay CDN.

three.eleva.js es un bundle reducido (tree-shaking) con solo lo que importa
js/movimiento/pista.js. Se genera fuera del repo (el repo no usa npm):

  npm i three@0.186.0 esbuild
  # entrada.js:
  export {
    WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, LineSegments,
    BufferGeometry, Float32BufferAttribute, ShaderMaterial, Vector3,
    DoubleSide, AdditiveBlending, LinearSRGBColorSpace, ColorManagement, REVISION
  } from 'three';
  npx esbuild entrada.js --bundle --format=esm --minify \
    --legal-comments=inline --target=es2020 --outfile=three.eleva.js

Las cabeceras @license de three.js se conservan dentro del archivo.
Si pista.js importa algo nuevo, se añade a entrada.js y se regenera.

Se importa sin ?v= (pista.js). Si se regenera el bundle, el archivo nuevo va con
otro nombre (p. ej. three.eleva-2.js) y se cambia el import en pista.js: la caché
del navegador guarda /lib un día (regla 12 de CLAUDE.md).
