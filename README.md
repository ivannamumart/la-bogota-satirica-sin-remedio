# LA BOGOTÁ SATÍRICA DE SIN REMEDIO

**Versión V04 — corona superior, red vial y arquitectura escénica**

Prototipo de investigación-creación para la Maestría en Humanidades Digitales, Universidad de los Andes, basado en *Sin remedio* (Antonio Caballero, 1984), ambientada en la Bogotá de 1972.

La visualización no es una réplica métrica de la Bogotá histórica. Es una **cartografía especulativa**: la ciudad narrativa ocupa únicamente la corona superior de una esfera de cemento gris. La proporción de los edificios se amplifica deliberadamente para hacer visibles las relaciones entre espacios, personajes y tensiones de la sátira.

## Ejecutar en un Mac

Requiere Node.js 20 o posterior.

```bash
npm ci
npm run dev
```

Abrir la dirección que indique Vite, normalmente `http://localhost:5173/`.

Para producir el sitio estático:

```bash
npm run build
npm run preview
```

El directorio generado `dist/` se puede publicar en Vercel (framework **Vite**, comando `npm run build`, salida `dist`).

## Controles

- En la vista general: arrastra el ratón para girar la esfera, rueda para acercarte. El botón de centrar devuelve la cámara general.
- **W / ↑** comienza el recorrido y avanza sobre los caminos; **S / ↓** retrocede; **Shift** acelera.
- En una intersección, **A / ←** o **D / →** seleccionan un camino alternativo y W sigue la dirección marcada.
- Los caminos de acceso activan una escena automáticamente al llegar a la puerta. Los Cerros no son transitables.
- En una microescena, los personajes se mueven y los diálogos aparecen como subtítulos; al final se ofrecen tres alternativas (**1, 2, 3** o clic). **Espacio** permite avanzar rápidamente durante las pruebas. **Esc** sale.
- **N** adelanta el ciclo automático de luz de cinco minutos (día → atardecer → noche). Es un atajo para revisión.
- La **luna** abre «Sobre el proyecto» en una página blanca y negra.

## Estructura y decisiones

- `src/data/layout.ts`: fuente única de verdad de los doce lugares, veintinueve nodos y treinta y tres tramos de la red. Las posiciones son escénicas, no EPSG:4326.
- `src/world/planet.ts`: esfera gris, terreno de la corona, topografía oriental, carreteras y arquitectura integrada.
- `src/world/city.ts`: nuevos edificios y cuatro hitos urbanos de referencia (La Santamaría, Torres del Parque, Centro Internacional, Museo Nacional).
- `src/world/scenes.ts`: interiores y microescenas procedimentales con personajes.
- `src/world/people.ts`: personajes estilizados con rostro, ropa y articulaciones procedimentales. No son esculturas fotorrealistas ni recreaciones de personas concretas.
- `src/story/dialogues.ts`: fragmentos identificados por párrafo del corpus, más bifurcaciones interpretativas que no deben confundirse con citas de la novela.
- `docs/Planos_2D_La_Bogota_Satirica_V04.pdf`: seis láminas, derivadas del mismo plano que el código.
- `docs/planta_vial_V04.json`: manifestación portable de ese plano.

## Estado artístico y científico

Esta V04 es **una versión interactiva sujeta a revisión**, no un videojuego comercial final. El exterior tiene nuevas mallas y texturas acuareladas; algunos interiores reutilizan geometría procedural adaptada de la V02 y aún necesitan modelado artístico individual. El movimiento de personajes es procedural y las transiciones utilizan fundidos. La posición de lugares literarios es interpretativa; algunos referentes históricos proceden de documentación patrimonial.

Para la reproducción académica no se incluye el texto integral de la novela ni las tablas personales de trabajo. La sección «Sobre el proyecto» contiene los objetivos facilitados por la autora y conserva marcadores de construcción en resultados y diálogos con IA.

## Fuentes de orientación histórica

- Fundación Rogelio Salmona: Residencias El Parque (1968–1970): https://www.fundacionrogeliosalmona.org/proyectos/residencias-el-parque
- Sociedad Colombiana de Arquitectos: https://scabogota.org/bepbog-torresdelparque/
- IDPC, patrimonio construido y ejes históricos: https://idpc.gov.co/

La base empírica espacial y textual procede de los archivos aportados por la autora: gacetero, extracción, coocurrencias y cruces espaciales/afectivos. Las coordenadas tentativas se mantienen como tales.
