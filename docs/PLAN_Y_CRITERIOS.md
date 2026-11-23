# Plan de reconstrucción · La Bogotá satírica V2

## Puntos de partida

- Se abandona la colección anterior de modelos genéricos. La nueva escena se genera a partir de una biblioteca de componentes con materiales coherentes.
- La esfera contiene doce núcleos visuales. Los Cerros son un punto de referencia paisajístico, no un destino para escalar.
- El recorrido jugable une once destinos mediante un anillo de caminos sobre toda la esfera y dos atajos alternativos.
- La entrada sucede por proximidad a las puertas. El jugador puede regresar por la salida o usar ESC.
- Cada escena contiene personajes con animación procedimental, un tramo de llegada cinematográfica, diálogos canónicos y una elección entre tres relecturas satíricas.
- Interfaz de inicio: título discreto, centrar, luna con rótulo «Sobre el proyecto» y globo central.
- Luna: página en blanco y negro con «En construcción».
- Ciclo automático: 300 segundos, con atajo N para probar cada período.

## Auditoría de calidad

1. Los doce escenarios deben conservar identidad arquitectónica y narrativa.
2. Ningún edificio se debe percibir como plano sobre el terreno ni flotante por debajo de la esfera.
3. El personaje debe permanecer pegado a un camino (incluidos los atajos).
4. Solo los once escenarios narrativos tienen puertas. Los Cerros son un horizonte.
5. No deben existir recuadros triangulares ni panel académico con teoría en esta versión.
6. El microrrelato canónico debe terminar antes de mostrar las tres alternativas.
7. La transición de luz se debe observar de día, tarde y noche.
8. Se debe compilar con `npm run build` y abrirse en navegador WebGL sin errores JS.

## Límites por validar

La geometría está estilizada y el rig facial es elemental: los personajes no equivalen a actores digitales fotorrealistas ni a captura de movimiento. El ingreso a escena se realiza por cambio de espacio con fundido de continuidad; la transición sin corte real a través de fachada es una fase posterior. El recorrido sigue una red esférica de caminos con intersecciones programadas, no un motor completo de detección física. Se deben ajustar fps, colisiones y respuesta en un equipo Mac Intel.
