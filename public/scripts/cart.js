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
                <strong>${item.name}</strong> <div style="font-size: 0.85rem; color: var(--color-muted);">$${item.price} c/u</div>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button> <strong style="min-width: 70px; text-align: right; color: var(--color-primary);"> $${item.price * item.quantity}
                </strong>
            </div>
        </div>
    `).join('');

    body.innerHTML = `
        <div>${itemsHtml}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; font-size:1.25rem;">
            <strong>Total a pagar:</strong>
            <strong style="color: var(--color-primary);">$${total}</strong> </div>          <form id="checkout-form" class="checkout-form"> <input type="text" id="customer-name" class="input-field" placeholder="Tu nombre (ej: Suyay)" required>  <select id="order-modality" class="select-field" required> <option value="Retiro en el local">Modalidad: Retiro en el local</option> <option value="Comer en el local">Modalidad: Comer en el local</option> </select>              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;"> <input type="date" id="pickup-date" class="input-field" required> <input type="time" id="pickup-time" class="input-field" value="18:00" required> </div>              <button type="submit" class="btn btn-primary" style="width: 100\%; background-color: #009ee3; color: #fff;"> 💳 Pagar con Mercado Pago ($${total})
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
                pickupTime
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al procesar pago');

        const order = data.order;
        const summaryList = order.items
            .map(i => `<li>${i.quantity}x ${i.name} ($${i.price * i.quantity})</li>`)
            .join('');

        // Mensaje opcional para WhatsApp (integrando Etapa 1 + Etapa 3)
        const waText = encodeURIComponent(
            `Hola Último Bondi! Ya aboné por Mercado Pago.\nOrden: *${order.orderId}*\nCliente:${order.customerName}\nModalidad: ${order.modality}\nRetiro:${order.pickupDate} a las ${order.pickupTime} hs\nTotal abonado:$${order.total}`
        );

        // Vaciar carrito tras pago aprobado
        cart = [];
        saveCart();

        document.getElementById('cart-modal-body').innerHTML = `
            <div class="mp-receipt">
                <span class="mp-badge">Mercado Pago • Pago Aprobado</span>
                <h3 style="color: var(--color-success); font-size: 1.5rem; margin-bottom: 0.5rem;">
                    ✔ ¡Pago confirmado!
                </h3>
                <p style="font-size: 0.9rem; color: var(--color-muted); margin-bottom: 1rem;">
                    Orden N° <strong>${order.orderId}</strong> registrada a nombre de <strong>${order.customerName}</strong> </p> <div style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary); margin-bottom: 1rem;"> Total: $${order.total}
                </div>
                <div style="text-align: left; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong>Resumen del pedido:</strong>
                    <ul style="margin: 0.5rem 0 0 1.2rem; font-size: 0.9rem;">${summaryList}</ul>
                    <p style="margin-top: 0.75rem; font-size: 0.9rem; color: var(--color-primary);">
                        📅 ${order.modality}: <strong>${order.pickupDate} —${order.pickupTime} hs</strong>
                    </p>
                </div>
                <a href="https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${waText}" target="_blank" class="btn btn-primary" style="width: 100%; background-color: #25D366; color: #121212;">
                    📲 Enviar comprobante por WhatsApp
                </a>
            </div>
        `;
    } catch (err) {
        alert('Hubo un problema al conectar con el servidor: ' + err.message);
    }
}