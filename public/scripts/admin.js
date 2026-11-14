const ADMIN_PASS = 'bondi2026';

document.addEventListener('DOMContentLoaded', () => {
    // Si ya inició sesión en esta pestaña, entra directo
    if (sessionStorage.getItem('ub_admin_auth') === 'true') {
        unlockDashboard();
    }

    document.getElementById('admin-login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('admin-pass').value;
        if (input === ADMIN_PASS) {
            sessionStorage.setItem('ub_admin_auth', 'true');
            unlockDashboard();
        } else {
            alert('Clave incorrecta. Probá con: bondi2026');
        }
    });

    // Cambio de pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });
    // Agregar nuevo producto
    document.getElementById('admin-product-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('prod-name').value,
            category: document.getElementById('prod-category').value,
            price: Number(document.getElementById('prod-price').value),
            urlImg: document.getElementById('prod-img').value,
            description: document.getElementById('prod-desc').value
        };

        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('✅ Producto agregado a la carta.');
            e.target.reset();
            document.getElementById('prod-img').value = 'images/products/default.jpg';
            loadAdminProducts();
        } else {
            alert('❌ Error al agregar el producto.');
        }
    });

    // Publicar nuevo evento
    document.getElementById('admin-event-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('ev-title').value,
            date: document.getElementById('ev-date').value,
            time: document.getElementById('ev-time').value,
            entry: document.getElementById('ev-entry').value,
            description: document.getElementById('ev-desc').value
        };

        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('✅ Evento publicado correctamente en la Agenda Cultural.');
            e.target.reset();
        } else {
            alert('❌ Error al publicar el evento.');
        }
    });
});

function unlockDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadAdminOrders();
    loadAdminProducts();
}

async function loadAdminOrders() {
    const container = document.getElementById('admin-orders-list');
    try {
        const res = await fetch('/api/orders');
        const orders = await res.json();

        document.getElementById('stat-orders').textContent = orders.length;
        const totalRevenue = orders
            .filter(o => o.paymentStatus === 'approved')
            .reduce((acc, o) => acc + Number(o.total), 0);
        document.getElementById('stat-revenue').textContent = `$${totalRevenue}`;

        if (orders.length === 0) {
            container.innerHTML = `<p style="color: var(--admin-muted);">No hay pedidos registrados todavía.</p>`;
            return;
        }

        container.innerHTML = orders.slice().reverse().map(order => {
            const items = order.items.map(i => `<li>${i.quantity}x ${i.name}</li>`).join('');
            return `
                <article class="order-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <strong style="color: var(--admin-accent);">${order.orderId}</strong>
                        <span style="font-size:0.75rem; font-weight:700; color: var(--admin-success);">
                            ✔ ${order.paymentProvider} (${order.paymentStatus})
                        </span>
                    </div>
                    <h3>${order.customerName}</h3>
                    <p style="font-size:0.85rem; color: var(--admin-muted); margin-bottom:0.5rem;">
                        ${order.modality} • ${order.pickupDate} (${order.pickupTime} hs)
                    </p>
                    <ul style="margin-left:1.2rem; font-size:0.9rem; margin-bottom:0.75rem;">${items}</ul>
                    <div style="border-top:1px solid var(--admin-border); padding-top:0.5rem; display:flex; justify-content:space-between;">
                        <span>Total:</span>
                        <strong style="color: var(--admin-accent);">$${order.total}</strong>
                    </div>
                </article>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = `<p style="color: var(--admin-danger);">Error al cargar comandas.</p>`;
    }
}

async function loadAdminProducts() {
    const tbody = document.getElementById('admin-prices-tbody');
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        document.getElementById('stat-products').textContent = products.length;

        tbody.innerHTML = products.map(p => `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td style="color: var(--admin-muted); font-size: 0.85rem;">${p.category}</td>
                <td>
                    <input type="number" id="price-${p.id}" class="price-input" value="${p.price}" min="0">
                </td>
                <td style="display: flex; gap: 0.4rem;">
                    <button class="btn-admin" onclick="saveProductPrice(${p.id})">Guardar</button>
                    <button class="btn-outline" style="border-color: var(--admin-danger); color: var(--admin-danger);" onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')">✕</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4">Error al cargar productos.</td></tr>`;
    }
}

async function deleteProduct(id, name) {
    if (!confirm(`¿Seguro que querés eliminar "${name}" de la carta?`)) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
        loadAdminProducts();
    } else {
        alert('❌ No se pudo eliminar el producto.');
    }
}

async function saveProductPrice(id) {
    const newPrice = document.getElementById(`price-${id}`).value;
    const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(newPrice) })
    });

    if (res.ok) {
        alert('✅ Precio actualizado. Ya se refleja en la web y en la Carta A4.');
    } else {
        alert('❌ No se pudo actualizar el precio.');
    }
}