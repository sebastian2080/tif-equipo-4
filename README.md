# Último Bondi - Plataforma Web y Pedidos Anticipados 🚌🎸

Proyecto Integrador Final (TIF) — **Equipo 4** (Tecnicatura Universitaria en Comercio Electrónico - UNPAZ).

## Arquitectura del Proyecto (En Capas)
- **Presentación (`public/`):** HTML5, CSS3 modular y JavaScript Vanilla (`fetch` hacia la API).
- **Servidor (`server/`):** Node.js + Express con rutas separadas (`/api/products`, `/api/events`, `/api/orders`, `/api/contact`).
- **Datos (`server/data/`):** Persistencia en archivos JSON (`products.json`, `events.json`, `orders.json`, `messages.json`).

## Cómo levantar el proyecto en local
1. Instalar dependencias: `npm install`
2. Iniciar servidor: `npm start` (o `npm run dev` para recarga automática)
3. Abrir en el navegador: `http://localhost:3000`

## Tareas pendientes del Equipo 4 (Checklist para Jira y GitHub)
- [ ] **Catálogo (`server/data/products.json`):** Hay 10 productos cargados. Agregar **10 productos más** (IDs 11 al 20) manteniendo las 4 categorías (`Menú del Día`, `Comidas Rápidas`, `Bebidas`, `Kiosco y Cafetería`).
- [ ] **Imágenes (`public/images/products/`):** Subir las fotos correspondientes a cada `urlImg` y el logotipo oficial en `public/images/`.
- [ ] **Identidad Visual (`public/styles/style.css` y `public/scripts/layout.js`):** Ajustar variables de color, tipografías e insertar el logotipo en el header.
- [ ] **Agenda Cultural (`server/data/events.json`):** Actualizar o agregar próximos eventos y peñas del espacio.
- [ ] **API Mercado Pago (`server/routes/orders.js` y `public/scripts/cart.js`):** Revisar la estructura de datos del pedido según el documento de Etapa 3 y probar el flujo completo de checkout.