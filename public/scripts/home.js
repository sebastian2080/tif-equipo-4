document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    loadUpcomingEvents();
});

async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const featured = products.filter(p => p.featured).slice(0, 4);

        container.innerHTML = featured.map(product => createProductCard(product)).join('');
    } catch (error) {
        container.innerHTML = `<p style="color: var(--color-muted);">No se pudieron cargar los destacados.</p>`;
    }
}

async function loadUpcomingEvents() {
    const container = document.getElementById('home-events');
    if (!container) return;

    try {
        const res = await fetch('/api/events');
        const events = await res.json();

        container.innerHTML = events.slice(0, 3).map(ev => `
            <div class="info-card">
                <div class="event-meta">
                    <span>📅 ${ev.date}</span>
                    <span>🕒 ${ev.time}</span>
                </div>
                <h3>${ev.title}</h3>
                <p style="color: var(--color-muted); font-size: 0.92rem; margin-bottom: 1rem;">
                    ${ev.description}
                </p>
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary);">
                    🎟 ${ev.entry}
                </span>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = `<p style="color: var(--color-muted);">No se pudo cargar la agenda cultural.</p>`;
    }
}

function createProductCard(product) {
    const fallbackImg = `https://placehold.co/600x400/1e1e1e/f5b800?text=${encodeURIComponent(product.name)}`; const oldPriceHtml = product.oldPrice ? `<span class="price-old">$${product.oldPrice}</span>`
        : '';

    const safeProduct = JSON.stringify(product).replace(/"/g, '&quot;');

    return `
        <article class="product-card">
            <div class="product-img-wrapper">
                <span class="product-category-badge">${product.category}</span>
                <img src="${product.urlImg}" alt="${product.name}" onerror="this.onerror=null; this.src='${fallbackImg}';">
            </div>
            <div class="product-body">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <div class="price-group">
                        ${oldPriceHtml} <span class="price-current">$${product.price}</span>
                    </div>
                    <button class="btn-add" onclick="addToCart(${safeProduct})">
                        + Agregar
                    </button>
                </div>
            </div>
        </article>
    `;
}