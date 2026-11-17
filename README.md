 **Equipo 4 (UNPAZ)** 

```markdown
# Último Bondi - Plataforma Web y Pedidos Anticipados 🚌🎸

Proyecto Integrador Final (TIF) — **Equipo 4** (Tecnicatura Universitaria en Comercio Electrónico - UNPAZ).

## Arquitectura del Proyecto (En Capas) 🏗️
- **Presentación (`public/`):** HTML5, CSS3 modular y JavaScript Vanilla (`fetch` hacia la API).
- **Servidor (`server/`):** Node.js + Express con rutas separadas (`/api/products`, `/api/events`, `/api/orders`, `/api/contact`).
- **Datos (`server/data/`):** Persistencia en archivos JSON (`products.json`, `events.json`, `orders.json`, `messages.json`).

## Instalación y cómo levantar el proyecto en local ⚙️

**1. Cloná el repositorio:** 📥
Abrí Git Bash o la terminal de VS Code en la carpeta donde guardás tus proyectos y ejecutá:

```bash
git clone [https://github.com/sebastian2080/tif-equipo-4.git]

```

**2. Entrá a la carpeta del proyecto:** 🗂️

```bash
cd tif-equipo-4

```

**3. Instalá las dependencias con npm:** 🛠️

```bash
npm install

```

**4. Configurá las variables de entorno (para Mercado Pago Sandbox):** 🔐

* Duplicá el archivo `.env.example` y renombralo a `.env`.
* Pegá tu Access Token de prueba (`TEST-...`) en `MP_ACCESS_TOKEN`.

**5. Iniciá el servidor de desarrollo con npm:** 🏁

```bash
npm start

```

*(O `npm run dev` si querés que se reinicie automáticamente al guardar cambios).*

**6. Abrí el sitio en el navegador:** 🌐
Entrá a [http://localhost:3000](http://localhost:3000)

> ⚠️ **Importante:** El sitio debe abrirse siempre desde `http://localhost:3000`. Si abrís `index.html` con doble clic o con Live Server, los productos y eventos no van a cargar porque las páginas necesitan conectarse al servidor Node.js.

---

## Cómo adaptarlo y editar el proyecto ✏️

1. **Cambiá los datos de los productos:** Editá `server/data/products.json` (o hacelo directo desde el panel `http://localhost:3000/admin.html`, clave `bondi2026`). Cada elemento necesita un `id` único. Recordá que en JSON las claves y los textos van entre comillas dobles y no se permiten comas al final del último elemento.
2. **Organizá por categorías:** Cada producto tiene un campo `category` (`"Menú del Día"`, `"Comidas Rápidas"`, `"Bebidas"`, `"Kiosco y Cafetería"`). El filtro del catálogo se arma automáticamente con las categorías que aparecen en los productos; escribilas siempre con las mismas mayúsculas y tildes.
3. **Agregá tus imágenes:**
* Fotos de platos/productos: guardalas en `public/images/products/` y escribí la ruta en `urlImg` (ej: `images/products/milanesa.jpg`).
* Banners del carrusel: guardalos en `public/images/banners/`.
* Plantilla A4 de Canva para la carta imprimible: guardala como `public/images/plantilla-carta.png` y se carga sola en `carta-imprimible.html`.


4. **Cambiá los datos del sitio:** El nombre, teléfono, email, dirección, horarios, redes sociales y opciones del menú están en el objeto `SITE` al principio de `public/scripts/layout.js`. Se actualizan en todas las páginas a la vez.
5. **Cambiá los textos de cada página:** Editá `index.html`, `menu.html`, `agenda.html`, `nosotros.html` y `contacto.html`.
6. **Cambiá los colores y estilos:**
* Para la web pública: editá las variables `:root` al principio de `public/styles/style.css` (`--color-primary`, `--font-title`, `--radius`, etc.).
* Para el Panel del Coordinador (`admin.html`): editá las variables `:root` al principio de `public/styles/admin.css`.



### Personalizar el estilo 🎨

Todas las páginas públicas comparten las mismas clases para mantener un diseño uniforme:

| Clase | Para qué sirve |
| --- | --- |
| `.section` | Bloque de contenido con espacio arriba y abajo |
| `.section-light` | Variante de `.section` con fondo claro |
| `.section-title` | Título de una sección |
| `.page-header` | Banner con el título de cada página |
| `.info-card` | Tarjeta con ícono, título y texto |
| `.text-block` | Caja para textos largos o formularios |
| `.product-item` | Tarjeta de producto |
| `.product-category` | Etiqueta con la categoría del producto |
| `.btn-site` | Botón con los colores principales del sitio |

### Agregar una página nueva 📄

1. Copiá `nosotros.html` y renombrala (por ejemplo `promos.html`).
2. Cambiá el `<title>` y el contenido de `<main>`. No hace falta tocar el encabezado ni el pie: `layout.js` los agrega solos.
3. Agregá la opción al menú en `public/scripts/layout.js`:

```js
menu: [
    { label: 'Inicio', href: 'index.html' },
    { label: 'Menú y Pedidos', href: 'menu.html' },
    { label: 'Agenda Cultural', href: 'agenda.html' },
    { label: 'Nosotros', href: 'nosotros.html' },
    { label: 'Contacto', href: 'contacto.html' }
]

```

La opción nueva aparece automáticamente en la barra de navegación y en el pie de todas las páginas.

```

```