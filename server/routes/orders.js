require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const router = express.Router();
const ordersFilePath = path.join(__dirname, '../data/orders.json');

// GET /api/orders -> Devuelve el historial de pedidos registrados
router.get('/', (req, res) => {
    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    res.json(orders);
});

/* ============================================================================
   POST /api/orders -> REGISTRO DE ORDEN + MERCADO PAGO CHECKOUT PRO
   - Si existe MP_ACCESS_TOKEN en el archivo .env, crea una preferencia real
     en Mercado Pago y devuelve `initPoint` para redirigir al pago.
   - Si todavía no cargaron el token, funciona en modo simulador local.
   ============================================================================ */
router.post('/', async (req, res) => {
    const { items, total, modality, pickupDate, pickupTime, customerName } = req.body;

    if (!items || items.length === 0 || !total) {
        return res.status(400).json({ error: 'Faltan datos obligatorios del pedido.' });
    }

    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    const orderNumber = `UB-${1000 + orders.length + 1}`;
    const token = process.env.MP_ACCESS_TOKEN;
    const hasValidToken = token && token !== 'PEGAR_AQUI_EL_ACCESS_TOKEN_DE_MERCADO_PAGO';

    const newOrder = {
        orderId: orderNumber,
        customerName: customerName || 'Estudiante UNPAZ',
        items,
        total,
        modality: modality || 'Retiro en el local',
        pickupDate: pickupDate || 'Hoy',
        pickupTime: pickupTime || '18:00',
        paymentProvider: 'Mercado Pago',
        paymentStatus: hasValidToken ? 'pending' : 'approved',
        createdAt: new Date().toISOString()
    };

    try {
        let initPoint = null;

        if (hasValidToken) {
            const client = new MercadoPagoConfig({ accessToken: token });
            const preference = new Preference(client);
            const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

            const mpItems = items.map(item => ({
                id: String(item.id),
                title: item.name,
                quantity: Number(item.quantity),
                unit_price: Number(item.price),
                currency_id: 'ARS'
            }));

            const response = await preference.create({
                body: {
                    items: mpItems,
                    external_reference: orderNumber,
                    back_urls: {
                        success: `${baseUrl}/menu.html?mp_status=approved&order=${orderNumber}`,
                        failure: `${baseUrl}/menu.html?mp_status=failure&order=${orderNumber}`,
                        pending: `${baseUrl}/menu.html?mp_status=pending&order=${orderNumber}`
                    }
                    // auto_return: 'approved' -> comentado porque localhost no es HTTPS público
                }
            });

            // Si el token es TEST- usa sandbox_init_point; si es APP_USR- usa init_point
            initPoint = token.startsWith('TEST-')
                ? response.sandbox_init_point
                : response.init_point;
        }

        orders.push(newOrder);
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

        res.status(201).json({
            message: hasValidToken
                ? 'Preferencia de Mercado Pago generada'
                : 'Orden registrada en modo simulador (falta configurar MP_ACCESS_TOKEN en .env)',
            order: newOrder,
            initPoint
        });
    } catch (error) {
        console.error('Error al conectar con Mercado Pago:', error);
        res.status(500).json({
            error: 'No se pudo generar el link de pago con Mercado Pago. Revisá el MP_ACCESS_TOKEN.'
        });
    }
});

// PATCH /api/orders/:orderId/status -> Actualiza estado cuando vuelve aprobado de MP
router.patch('/:orderId/status', (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf-8'));
    const index = orders.findIndex(o => o.orderId === orderId);

    if (index === -1) {
        return res.status(404).json({ error: 'Orden no encontrada' });
    }

    orders[index].paymentStatus = status || 'approved';
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    res.json({ message: 'Estado actualizado', order: orders[index] });
});

module.exports = router;