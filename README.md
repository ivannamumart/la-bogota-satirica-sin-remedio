# La Bogotá satírica de *Sin remedio*

Prototipo de investigación-creación para la Maestría en Humanidades Digitales de la Universidad de los Andes. Un mundo 3D especulativo inspirado en los espacios narrativos de *Sin remedio* de Antonio Caballero, con acceso a una capa académica.

**Estado:** prototipo experimental; aún faltan pruebas visuales de WebGL y validación integral de los interiores, transiciones y controles. Las posiciones del mundo son escénicas y no equivalen a coordenadas cartográficas.

## Desarrollo

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre la URL local que indique Vite. Para compilar:

```bash
npm run build
```

## Despliegue

Importa este repositorio desde Vercel y selecciona el framework **Vite**, con comando `npm run build` y directorio de salida `dist`. Esta rama es de revisión; fusiona con `main` cuando esté validada.

## Contenido

- `src/world/`: planeta, materiales, arquitectura e interiores.
- `src/story/`: doce lugares y diálogos, separados de las reinterpretaciones contemporáneas.
- `src/ui/`: interfaz minimalista.
- `src/main.ts`: navegación, cámara, escenas y coordinación.

Las imágenes de referencia y el corpus completo no forman parte de esta subida de código. La versión visual final requiere modelado, dirección de arte y pruebas de rendimiento adicionales.
