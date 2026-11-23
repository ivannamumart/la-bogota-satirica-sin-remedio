# La Bogotá satírica de *Sin remedio* — V08

Prototipo web interactivo para una cartografía especulativa de la Bogotá de la novela de Antonio Caballero. El globo conserva su base de cemento gris; la ciudad se asienta sobre una meseta suavemente nivelada que no atraviesa la esfera y crece de forma continua hacia los Cerros Orientales. Once lugares presentan microescenas y uno es paisaje no transitable.

## Cómo probar

Requiere Node.js 20 o superior. En la carpeta del proyecto, ejecutar `npm ci`, `npm run dev` y abrir la dirección que indique Vite (normalmente `http://localhost:5173/`).

### Controles

**Globo:** arrastrar con ratón o dedo para girarlo; rueda/pellizco para acercar. Pulsar W o flecha arriba para entrar en modo recorrido. En móvil, doble toque sobre el mundo.

**Caminos:** W/↑ avanzar; S/↓ retroceder por el mismo camino; A/← y D/→ seleccionar desvíos en intersecciones; Shift correr. Escobar se desplaza por las carreteras y sus ramales, no sobre los cerros.

**Escenas:** al entrar, se desarrolla una pequeña coreografía inicial. A continuación, ↑/W o Espacio avanza un parlamento y ↓/S regresa al anterior. **Los diálogos ya no corren con un temporizador**. Cuando terminan, aparecen tres alternativas con contexto, seleccionables con clic/toque o números 1–3. Esc regresa al mundo; una vez terminada la escena también se puede caminar hacia la salida.

**Móvil:** controles táctiles ↑↓←→ en la parte inferior. Durante una conversación, ↑ y ↓ controlan el diálogo, no la posición del personaje. El botón central centra el globo y la luna abre «Sobre el proyecto». N cambia el ciclo de luz para probar las horas.

## Narración y autoría

Las líneas identificadas con referencias P- proceden del corpus previamente validado; el resto es **texto original interpretativo para el prototipo**, no una cita de Caballero. Esta es una experiencia en desarrollo, no un juego de producción terminada. Las rutas representan relaciones históricas aproximadas y una interpretación escénica, no coordenadas geográficas exactas.

## Verificación

`npm run build` debe ejecutar TypeScript y Vite. La acción de GitHub ejecuta además un navegador con WebGL, verifica controles, diálogos, decisiones, luna y viewport móvil, y guarda capturas en `docs/qa/`.

## Alcance y criterios de autoría de la V08

- Las escenas usan una edición **condensada e interpretativa** por lugares. Las líneas marcadas P- se cotejan con el corpus, pero la puesta en escena y las acotaciones son redacción editorial. No se deben presentar como reproducción íntegra de capítulos de la novela.
- Las bifurcaciones satíricas son escritura original, claramente diferenciada de la novela.
- La meseta se construye sobre la esfera, no la sustituye: la corona está ligeramente sobre la superficie de cemento, la misma malla genera los Cerros y la ciudad queda restringida al hemisferio superior.
- Este código es una iteración para la revisión académica y estética. La compilación/WebGL son verificaciones técnicas, no una certificación de calidad artística final ni una garantía de cero errores en dispositivos reales.
