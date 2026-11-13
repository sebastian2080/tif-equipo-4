const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products');
const eventsRouter = require('./routes/events');
const ordersRouter = require('./routes/orders');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API REST (Arquitectura en capas)
app.use('/api/products', productsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/contact', contactRouter);

// Arrancar servidor
app.listen(PORT, () => {
    console.log(`🚌 Servidor de Último Bondi corriendo en http://localhost:${PORT}`);
});