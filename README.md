# La Bogotá satírica de *Sin remedio* — V07

Prototipo web interactivo para una cartografía especulativa de la Bogotá de la novela de Antonio Caballero. La esfera conserva su base gris; la corona superior concentra doce lugares, de los cuales once albergan microescenas.

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
