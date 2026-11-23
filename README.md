# La Bogotá satírica de *Sin remedio* — V06 (revisión de dirección de arte)

Experiencia web en **Three.js + TypeScript + Vite** basada en una cartografía especulativa de la Bogotá narrativa de Antonio Caballero. La esfera completa conserva un acabado de cemento gris y la corona superior aloja once escenarios interactivos, más el paisaje no transitable de los Cerros Orientales.

## Qué se rehizo en V06

- Reorganización de la planta maestra para separar mejor los edificios principales, manteniendo las relaciones geográficas interpretativas.
- Arquitecturas narrativas más grandes, fachadas con ladrillo, cornisas, balcones, escalinatas, toldos y accesos reconocibles.
- Jardines bajos y vegetación urbana andina, sin pinos decorativos.
- Carreteras principales reconocibles (Séptima, calle 26) con bifurcaciones y caminos secundarios.
- Mayor relieve para los Cerros Orientales y materiales de colores contenidos.
- Cámara de apertura más baja, con una lectura escénica más cercana al referente de mini-mundo.

**Estado:** prototipo artístico jugable para revisión; las mallas procedimentales no equivalen aún a personajes esculpidos profesionalmente. Las escenas interiores y sus microanimaciones siguen siendo una base que requerirá dirección cinematográfica individual.

## Abrir en Mac

Requiere Node.js 20 o posterior:

```bash
npm ci
npm run dev
```

Abre la URL local que indica Vite (normalmente http://localhost:5173).

## Controles

- Ratón: rotar y acercar el globo.
- W/S o flechas arriba/abajo: empezar el recorrido y caminar por los caminos.
- A/D o flechas izquierda/derecha: elegir dirección en las intersecciones.
- Mayúsculas (Shift): correr.
- Espacio: avanzar un momento narrativo; 1/2/3: seleccionar una bifurcación.
- Escape: salir del escenario; N: acelerar el ciclo día-noche para probarlo.
- Botón centrar: volver a la vista general; luna: «Sobre el proyecto».

## Método

La ubicación y escala son **escenográficas e interpretativas**, no coordenadas geodésicas ni reconstrucciones patrimoniales exactas. El Jockey, la Porciúncula, la Plaza de Toros y las Torres del Parque sirven como anclajes de época; los lugares de ficción mantienen el emplazamiento y sentido narrativo del corpus.

## Verificación

- `npm run build`: compilación y auditoría TypeScript.
- `node tests/smoke.mjs` con servidor de previsualización en `4173`: prueba WebGL de escenas, movimiento, controles, luna y ciclo.
- GitHub Actions ejecuta esas verificaciones y conserva capturas como artefacto QA.

## Dirección de arte V06

La V06 separa conjuntos urbanos y vuelve visibles los costados y hastiales de las arquitecturas. Véase `docs/REVISION_VISUAL_V06.md`. Los esquemas PDF V04 se conservan como antecedente, pero las coordenadas y entradas vigentes están en `src/data/layout.ts`.
