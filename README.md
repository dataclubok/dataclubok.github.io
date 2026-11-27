# dataclubok.github.io

Web de Data Club (Paraná, Entre Ríos).

## Cómo se actualiza el stock

Los productos salen de la planilla de Google "Data Club · Catálogo web"
(pestaña `Catalogo`), compartida como "cualquier persona con el enlace".
Cambiar un precio, marcar `Mostrar = NO` o agregar una fila se refleja
en la web sin tocar código.

## Estructura

- `index.html` y las carpetas `productos/`, `nosotros/`, `envios/`,
  `mayoristas/`, `preguntas/` — páginas generadas
- `estilo.css` — estilos de todo el sitio
- `app.js` — catálogo, carrito y feed de Instagram
- `build.py` — genera las páginas. Correr `python3 build.py` después
  de editarlo; no editar los `index.html` a mano
