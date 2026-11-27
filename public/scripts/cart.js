let cart = JSON.parse(localStorage.getItem('ub_cart')) || [];

function saveCart() {
    localStorage.setItem('ub_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    badge.textContent = totalItems;
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    saveCart();
    openCartModal();
}

function changeQuantity(id, delta) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }
    saveCart();
    renderCartContent();
}

function openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    renderCartContent();
    modal.classList.add('open');
}

function renderCartContent() {
    const body = document.getElementById('cart-modal-body');
    if (!body) return;

    if (cart.length === 0) {
        body.innerHTML = `
            <p style="color: var(--color-muted); text-align: center; padding: 2rem 0;">
                Todavía no agregaste productos a tu pedido. ¡Explorá el menú y armá tu combo!
            </p>
            <a href="menu.html" class="btn btn-primary" style="width: 100%;">Ir al Menú</a>
        `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const itemsHtml = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <div style="font-size: 0.85rem; color: var(--color-muted);">$${item.price} c/u</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <strong style="min-width: 70px; text-align: right; color: var(--color-primary);">
                    $${item.price * item.quantity}
                </strong>
            </div>
        </div>
    `).join('');

    body.innerHTML = `
        <div>${itemsHtml}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; font-size:1.25rem;">
            <strong>Total a pagar:</strong>
            <strong style="color: var(--color-primary);">$${total}</strong>
        </div>
        <form id="checkout-form" class="checkout-form">
            <input type="text" id="customer-name" class="input-field" placeholder="Tu nombre (ej: Suyay)" required>
            <select id="order-modality" class="select-field" required>
                <option value="Retiro en el local">Modalidad: Retiro en el local</option>
                <option value="Comer en el local">Modalidad: Comer en el local</option>
            </select>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <input type="date" id="pickup-date" class="input-field" required>
                <input type="time" id="pickup-time" class="input-field" value="18:00" required>
            </div>
           <label for="payment-method">Método de pago:</label>
<select id="payment-method" class="select-field" required>
    <option value="mercadopago">💳 Pagar con Mercado Pago</option>
    <option value="local">🏪 Pagar en el local</option>
</select>
<button type="submit" class="btn btn-primary" style="width: 100%;">
    Confirmar pedido ($${total})
</button>
        </form>
    `;

    // Setear fecha actual por defecto
    const dateInput = document.getElementById('pickup-date');
    if (dateInput) dateInput.valueAsDate = new Date();

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await processMercadoPagoOrder(total);
    });
}

async function processMercadoPagoOrder(total) {
    const customerName = document.getElementById('customer-name').value;
    const modality = document.getElementById('order-modality').value;
    const pickupDate = document.getElementById('pickup-date').value;
    const pickupTime = document.getElementById('pickup-time').value;
    const paymentMethod = document.getElementById('payment-method').value;

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName,
                items: cart,
                total,
                modality,
                pickupDate,
                pickupTime,
                paymentMethod
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al procesar pago');
        if (paymentMethod === 'local') {
            cart = [];
            saveCart();
            renderLocalReceipt(data.order);
            return;
        }
        // Si el equipo configuró MP_ACCESS_TOKEN en .env, redirige al Checkout Pro real/sandbox
        if (data.initPoint) {
            window.location.href = data.initPoint;
            return;
        }

        // Si aún no cargaron el token, muestra directamente el comprobante simulado
        cart = [];
        saveCart();
        renderApprovedReceipt(data.order);
    } catch (err) {
        alert('Hubo un problema al conectar con el servidor: ' + err.message);
    }
}
function renderLocalReceipt(order) {
    const modal = document.getElementById('cart-modal');
    const body = document.getElementById('cart-modal-body');
    if (!body) return;

    const summaryList = order.items
        .map(i => `<li>${i.quantity}x ${i.name} ($${i.price * i.quantity})</li>`)
        .join('');

    const waText = encodeURIComponent(
        `Hola Último Bondi! Confirmé mi pedido con pago en el local.\nOrden: *${order.orderId}*\nCliente: ${order.customerName}\nModalidad: ${order.modality}\nFecha: ${order.pickupDate} a las ${order.pickupTime} hs\nTotal pendiente de pago: $${order.total}`
    );

    body.innerHTML = `
        <div class="mp-receipt">
            <span class="mp-badge">Pago pendiente en el local</span>
            <h3 style="color: var(--color-success);">
                ✔ ¡Pedido confirmado!
            </h3>
            <p>Orden N° <strong>${order.orderId}</strong></p>
            <p>Cliente: <strong>${order.customerName}</strong></p>
            <p>Modalidad: ${order.modality}</p>
            <p>Fecha: ${order.pickupDate} - ${order.pickupTime} hs</p>

            <div style="text-align: left; padding: 1rem;">
                <strong>Resumen del pedido:</strong>
                <ul>${summaryList}</ul>
            </div>

            <h3 style="color: var(--color-primary);">
                Total a pagar: $${order.total}
            </h3>
            <p>Aboná tu pedido directamente en el local.</p>

            <a href="https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${waText}" target="_blank" class="btn btn-primary" style="width: 100%; background-color: #25D366; color: #121212;">
                📲 Enviar pedido por WhatsApp
            </a>
        </div>
    `;

    if (modal) modal.classList.add('open');
}
function renderApprovedReceipt(order) {
    const modal = document.getElementById('cart-modal');
    const body = document.getElementById('cart-modal-body');
    if (!body) return;

    const summaryList = order.items
        .map(i => `<li>${i.quantity}x ${i.name} ($${i.price * i.quantity})</li>`)
        .join('');

    const waText = encodeURIComponent(
        `Hola Último Bondi! Ya aboné por Mercado Pago.\nOrden: *${order.orderId}*\nCliente: ${order.customerName}\nModalidad: ${order.modality}\nRetiro: ${order.pickupDate} a las ${order.pickupTime} hs\nTotal abonado: $${order.total}`
    );

    body.innerHTML = `
        <div class="mp-receipt">
            <span class="mp-badge">Mercado Pago • Pago Aprobado</span>
            <h3 style="color: var(--color-success); font-size: 1.5rem; margin-bottom: 0.5rem;">
                ✔ ¡Pago confirmado!
            </h3>
            <p style="font-size: 0.9rem; color: var(--color-muted); margin-bottom: 1rem;">
                Orden N° <strong>${order.orderId}</strong> registrada a nombre de <strong>${order.customerName}</strong>
            </p>
            <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem;">
                Total: $${order.total}
            </div>
            <div style="text-align: left; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <strong>Resumen del pedido:</strong>
                <ul style="margin: 0.5rem 0 0 1.2rem; font-size: 0.9rem;">${summaryList}</ul>
                <p style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--color-primary);">
                    📅 ${order.modality}: <strong>${order.pickupDate} — ${order.pickupTime} hs</strong>
                </p>
            </div>
            <a href="https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${waText}" target="_blank" class="btn btn-primary" style="width: 100%; background-color: #25D366; color: #121212;">
                📲 Enviar comprobante por WhatsApp
            </a>
        </div>
    `;

    if (modal) modal.classList.add('open');
}

/* ============================================================================
   RETORNO DESDE MERCADO PAGO (Checkout Pro)
   ============================================================================ */
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const mpStatus = params.get('mp_status');
    const orderId = params.get('order');

    if (mpStatus === 'approved' && orderId) {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' })
            });

            if (res.ok) {
                const { order } = await res.json();
                cart = [];
                saveCart();
                renderApprovedReceipt(order);
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
            console.error('Error al confirmar retorno de Mercado Pago:', err);
        }
    } else if (mpStatus === 'failure') {
        alert('❌ El pago en Mercado Pago fue rechazado o cancelado. Podés volver a intentarlo desde tu carrito.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});