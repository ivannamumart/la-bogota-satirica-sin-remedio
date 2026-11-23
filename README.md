# La Bogotá satírica de *Sin remedio* · Reconstrucción V2

Visualizador web interactivo (Three.js + TypeScript + Vite), inspirado en los doce lugares narrativos de *Sin remedio* de Antonio Caballero. Proyecto de investigación-creación de la Maestría en Humanidades Digitales de la Universidad de los Andes.

## Cómo probarlo

Necesitas Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador. Para generar la versión de producción:

```bash
npm run build
npm run preview
```

### Controles

- **Arrastrar sobre el planeta:** girar el mundo y explorar ambos hemisferios.
- **W / flecha arriba:** empezar a caminar, avanzar por el camino.
- **S / flecha abajo:** retroceder por el camino.
- **A / flecha izquierda en un cruce:** tomar un camino alternativo cuando existe.
- **Shift:** correr, también dentro del escenario.
- **Entrar:** automático al alcanzar la puerta de un lugar, sin botones.
- **Salir:** caminar hacia la entrada del interior o presionar **ESC**.
- **1 / 2 / 3:** elegir alternativas al acabar el microrrelato canónico.
- **Barra espaciadora:** saltar al siguiente diálogo durante una escena.
- **N:** avanzar 1/4 del ciclo día-noche para probarlo.
- **Centrar:** vista general de la esfera.
- **Luna:** «Sobre el proyecto», por ahora únicamente «En construcción».

## Dirección artística

El mundo **no pretende ser una reproducción cartográfica exacta de Bogotá**. Su distribución exagera deliberadamente monumentos y espacios y preserva las tensiones narrativas entre los barrios. Las referencias históricas informan fachadas, urbanismo y objetos, pero las ubicaciones corresponden a una cartografía especulativa. Los Cerros Orientales son relieve geográfico dominante y paisaje no transitable.

La estética combina **geometría estilizada**, texturas mates originales de acuarela, detalles arquitectónicos de la Bogotá de inicios de los setenta, contornos topográficos, sombras suaves y una interfaz editorial mínima. Los acabados de papel se generan dentro del navegador con semillas deterministas; también se incluye una biblioteca opcional de 18 texturas JPG procedimentales en `public/textures`.

## Estructura

- `src/world/art.ts` materiales y primitivas;
- `src/world/planet.ts` topografía, caminos esféricos y distribución espacial;
- `src/world/architecture.ts` exteriores, vegetación y transportes;
- `src/world/people.ts` personajes articulados y sus animaciones;
- `src/world/scenes.ts` microescenarios interiores y reparto;
- `src/story/dialogues.ts` diálogos canónicos e interpretaciones (separados por metadatos);
- `src/main.ts` navegación restringida, cámara, transiciones, ciclo día/noche y narración;
- `src/ui/styles.css` interfaz.

## Estado de validación

Esta es una nueva construcción procedimental. El código debe someterse a pruebas WebGL reales en un navegador antes de declararse aprobado para entrega académica. La presencia de código para una escena no equivale a una animación cinematográfica final: los personajes usan animaciones procedimentales y falta captura de movimiento o rigging especializado. Los modelos no corresponden a escaneos ni reconstrucciones históricas certificadas.

## Fuentes históricas usadas para el diseño

- Instituto Distrital de Patrimonio Cultural: fichas del barrio La Soledad, desarrollo de la ciudad jardín y viviendas de dos y tres pisos, https://sisbic.idpc.gov.co/Fichas_606_ant/0071013901.pdf
- Bogotá.gov.co: Porciúncula, neogótico tardío, naves, vitrales y rosetón, https://bogota.gov.co/internacional/planes-en-bogota-conoce-6-iglesias-de-chapinero-en-semana-santa-2025
- Archivo de Bogotá: *Políticas públicas y memoria*, parque de busetas en 1971 y 1981, https://archivobogota.secretariageneral.gov.co/sites/default/files/documentos_secretaria_general/POLITICAS_PUBLICAS_IEPRI.compressed.pdf

No se alojó el corpus literario completo ni material protegido de la novela en el repositorio. Las citas breves de la propuesta llevan referencias P- y las ramificaciones originales se identifican como reinterpretación.
