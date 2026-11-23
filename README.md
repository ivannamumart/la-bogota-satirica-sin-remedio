# La Bogotá satírica de *Sin remedio*

**Prototipo web navegable · Maestría en Humanidades Digitales · Universidad de los Andes · 2026**

Una geografía especulativa construida a partir de doce espacios recurrentes de *Sin remedio* (Antonio Caballero, 1984, ambientada en la Bogotá de los años setenta). La esfera tiene relieve real y permite recorrer tanto la cara visible como la posterior.

## Qué contiene esta entrega

- **Globo en Three.js** de geometría continua con relieve, topografía, sombras, atmósfera, caminos conectados, vegetación, vehículos y doce microescenarios diferenciados. Los objetos se componen dentro de la escena con código tridimensional, sin reutilizar los modelos GLB anteriores que habían quedado demasiado esquemáticos.
- **Escobar en tercera persona**, en vista de espaldas: WASD / flechas para caminar; **Mayús** acelera; movimiento tangente a la esfera. En móvil, **doble toque** sobre el mundo para seguirlo y **deslizamiento** para moverse; este control táctil es experimental.
- **Ingreso automático** a cada escena al aproximarse, sin botones de «entrar». En el interior la salida se encuentra detrás del protagonista: camina hacia la puerta original para volver al globo.
- **Escenas interiores 3D** con mobiliario propio (taller, apartamento, bar, iglesia, club, Jockey, oficina, casa familiar) y espacios abiertos para Parque Nacional, Cerros, Séptima y Cementerio.
- **Diálogos dependientes del avance**: se muestran al acercarse; caminando hacia atrás se retrocede en el diálogo. Tres alternativas interpretativas por espacio.
- **Ciclo de luz** de cinco minutos, con fases diurnas y nocturnas, iluminación variable y estrellas.
- **Luna académica** con seis secciones: argumento, objetivos, Humano-en-la-Jugada, Segunda Caja Negra, teoría (Drucker, Westphal y Bajtín) y referencias iniciales.
- **Diseño de pantalla limpia** sin marcadores sobre los edificios ni botones para entrar. Se priorizan texto flotante, márgenes amplios y tonos de acuarela.

## Ejecutar en Mac o PC (para la autora / equipo técnico)

Instala Node.js 20 o posterior, descomprime el proyecto y desde Terminal, en la carpeta raíz:

```sh
npm ci
npm run dev
```

Abre la URL que Vite anuncia (normalmente `http://localhost:5173`). No hace falta Blender.

**Quien visita una URL publicada no instala Node, Blender ni software alguno:** solo necesita un navegador actualizado con WebGL.

## Publicar en GitHub y Vercel

1. Crea o utiliza tu repositorio de GitHub para el proyecto.
2. Sube los archivos de la **raíz de esta carpeta** (incluidos `package.json`, `package-lock.json`, `src/`, `index.html` y `vercel.json`). No subas `node_modules/`.
3. En Vercel, elige «Add New Project» y selecciona ese repositorio.
4. El framework se detecta como **Vite**. Build Command: `npm run build`. Output Directory: `dist`.
5. Vercel generará una URL pública y podrá desplegar automáticamente nuevos commits en la rama conectada.

El prototipo está preparado para configurar este flujo. El código debe subirse al repositorio y después vincularse con Vercel; todavía no existe una URL pública del visualizador.

## Estructura

```text
src/
  main.ts                    # motor, controles, cámara, transiciones, ciclo de luz
  story/places.ts            # 12 nodos y su distribución especulativa
  story/dialogues.ts         # corpus breve, referencias P- y alternativas originales
  world/materials.ts        # papel, acuarela y materiales
  world/architecture.ts     # edificios, personajes, árboles, vehículos y detalles
  world/planet.ts           # relieve, caminos y mundo esférico
  world/interiors.ts        # escenarios narrativos interiores y exteriores
  ui/styles.css             # interfaz no intrusiva, luna y globos de diálogo
```

## Estado real y límites

Este es un **prototipo implementado en código, pendiente de prueba integrada en navegador**, no una producción artística definitiva ni un conjunto de 135 modelos BLEND/GLB finalizados. El terreno, los edificios y el mobiliario se generan en Three.js a partir de geometría paramétrica y materiales con textura. La arquitectura histórica está estilizada: todavía requiere contraste de fachadas individuales y un trabajo de modelado externo para adquirir el realismo expresivo y el nivel de detalle cinematográfico que buscas. Los actores son esculturas ligeras con animación procedural básica, **sin rig facial ni sincronización labial**. La entrada a interiores utiliza una **disolvencia de cámara**: la continuidad geométrica física del paso por la puerta queda para una siguiente iteración. Tampoco incluye audio, registro de decisiones, pulido de la interacción táctil o publicación realizada.

**Límite de pruebas en este entorno:** se verificaron sintaxis de TypeScript, consistencia estructural de escenas y referencias de 26 fragmentos con el corpus suministrado; la compilación integrada con módulos descargados y la inspección gráfica completa en navegador están **pendientes**, porque el entorno de generación no tuvo acceso al registro npm. Antes de enviarla a jurados, ejecuta `npm ci && npm run build` y pruébala en Chrome, Firefox y Safari.

## Uso responsable de los textos

El corpus íntegro de la novela no está publicado en el repositorio. Se utilizan fragmentos breves identificados por párrafo; las alternativas están explícitamente marcadas como **escritura interpretativa**. La documentación de investigación y las fuentes originales permanecen bajo control de la autora. Ver `docs/CRITERIOS_Y_ESTADO.md`.