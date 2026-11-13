const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const ordersFilePath = path.join(__dirname, '../data/orders.json');

// GET /api/orders -> Devuelve el historial de pedidos registrados
router.get('/', (req, res) => {
    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    res.json(orders);
});

/* ============================================================================
   TODO EQUIPO 4 - INTEGRACIÓN API MERCADO PAGO (ETAPA 3):
   Acá se recibe el carrito (items, total, modalidad y horario de retiro).
   - Actualmente simula la respuesta aprobada de Mercado Pago y guarda la orden.
   - Si conectan el SDK real de Mercado Pago (Checkout Pro), acá deben crear la
     preferencia con el Access Token y devolver el init_point o estado del pago.
   ============================================================================ */
router.post('/', (req, res) => {
    const { items, total, modality, pickupDate, pickupTime, customerName } = req.body;

    if (!items || items.length === 0 || !total) {
        return res.status(400).json({ error: 'Faltan datos obligatorios del pedido.' });
    }

    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    const orderNumber = `UB-${1000 + orders.length + 1}`;

    const newOrder = {
        orderId: orderNumber,
        customerName: customerName || 'Estudiante UNPAZ',
        items,
        total,
        modality: modality || 'Retiro en el local',
        pickupDate: pickupDate || 'Hoy',
        pickupTime: pickupTime || '18:00',
        paymentProvider: 'Mercado Pago',
        paymentStatus: 'approved',
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    res.status(201).json({
        message: 'Pago aprobado y orden registrada correctamente',
        order: newOrder
    });
});

module.exports = router;