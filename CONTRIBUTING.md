# Cómo contribuir

## Antes de nada: activa los hooks

```sh
git config core.hooksPath tools/hooks
```

Activa dos hooks (Node, sin dependencias):

- `pre-commit`: ejecuta `node tools/generar.js` y `node tools/validar.js`. Si el
  HTML generado cambia, el commit se para para que revises y añadas los archivos.
- `commit-msg`: rechaza los mensajes que no siguen la convención de abajo y
  explica el motivo.

## Datos del club y de la marca

- Solo se publica lo confirmado por el cliente. Lo pendiente se marca
  `PENDIENTE_CLUB` / `PENDIENTE_MARCA` y su valor propuesto va a `CONFIRMAR.md`
  (local, fuera de Git). Nunca un dato sin confirmar en un archivo versionado ni
  en un mensaje de commit.
- Los datos que caducan llevan `verificado` y `fuente` en el manifest.
- Tras tocar un manifest: `node tools/generar.js` (pinta el HTML) y
  `node tools/validar.js`.

## Convención de commits

```
tipo(ámbito): resumen

Cuerpo: qué cambia y por qué.

Pie opcional.
```

**Tipos**

| Tipo | Para |
|---|---|
| `feat` | sección, página o función nueva |
| `fix` | corrección de un fallo |
| `content` | datos o textos del club o de la marca |
| `style` | CSS y aspecto visual sin cambiar el comportamiento |
| `refactor` | reorganización del código sin cambios visibles |
| `perf` | rendimiento |
| `a11y` | accesibilidad |
| `i18n` | traducciones |
| `docs` | documentación |
| `build` | herramientas del proyecto (generar, validar, qa, hooks) |
| `chore` | tareas sin efecto en la web (`.gitignore`, configuración) |
| `revert` | deshacer un commit anterior |

**Ámbitos** (opcionales): `marca`, `pizarra`, `mantenimiento`, `legal`, `seo`,
`tools`, `deploy`.

**Reglas**

- Resumen en español, en tercera persona del presente («añade», «corrige»,
  «elimina»), con minúscula inicial, sin punto final y de 72 caracteres como
  máximo. Dice qué cambia en concreto.
- Prohibidos los resúmenes vacíos: «Update», «cambios», «arreglos», «wip», «varios».
- Cuerpo obligatorio salvo en cambios triviales, en líneas de 72 caracteres como
  máximo. Si el commit toca datos del club, el cuerpo indica la fuente y la fecha
  de verificación.
- Pie, cuando aplique: `BREAKING CHANGE:` o `Refs:`.
- Un commit, un cambio lógico: no se mezclan contenido, estilos y herramientas.
- Nunca en un mensaje: datos sin confirmar, claves, secretos ni enlaces privados.
- Sin emojis y sin firmas ni líneas `Co-Authored-By` de herramientas de IA.
- Las fusiones a `main` llevan mensaje según la convención, por ejemplo
  `chore(deploy): integra rediseno en main`, con un cuerpo que resuma lo que entra.

**Ejemplos buenos**

```
content(pizarra): añade las tarifas de la escuela infantil

Hasta 12 años, 40 € por niño al mes, una clase a la semana y máximo
seis niños por grupo.

Fuente: cartel "Escuela infantil", verificado 2026-09-30
```

```
fix(pizarra): evita que el botón de reservar tape el formulario

El botón flotante se ocultaba solo sobre el hero. Ahora también se
oculta mientras la sección de contacto está en pantalla.
```

```
build(tools): comprueba en validar.js que el HTML está generado

validar.js genera el HTML en memoria y falla si no coincide con el
archivo, para que nadie publique datos del manifest sin pintar.
```

```
docs: explica cómo activar los hooks de Git
```

**Ejemplo malo**

```
Update index.html
```

No dice qué cambia, no tiene tipo y empieza en mayúscula.

## Identidad del autor

Los commits van con la identidad de Git del propietario del proyecto, tal como
está configurada. Es una decisión suya: no se cambia la configuración de Git
(ni la global ni la del repo).
