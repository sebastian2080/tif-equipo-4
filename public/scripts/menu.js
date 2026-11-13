let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadCatalogProducts();

    document.getElementById('search-input')?.addEventListener('input', applyFilters);
    document.getElementById('category-select')?.addEventListener('change', applyFilters);
    document.getElementById('sort-select')?.addEventListener('change', applyFilters);
});

async function loadCategories() {
    const select = document.getElementById('category-select');
    if (!select) return;

    try {
        const res = await fetch('/api/products/categories');
        const categories = await res.json();

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

async function loadCatalogProducts() {
    const container = document.getElementById('catalog-list');
    if (!container) return;

    try {
        const res = await fetch('/api/products');
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (error) {
        container.innerHTML = `<p style="color: var(--color-danger);">Error al conectar con el servidor.</p>`;
    }
}

function applyFilters() {
    const search = document.getElementById('search-input').value.toLowerCase().trim();
    const category = document.getElementById('category-select').value;
    const sort = document.getElementById('sort-select').value;

    let filtered = allProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
        const matchesCategory = category === '' || p.category === category;
        return matchesSearch && matchesCategory;
    });

    if (sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(filtered);
}

function renderProducts(list) {
    const container = document.getElementById('catalog-list');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<p style="color: var(--color-muted); grid-column: 1 / -1; text-align: center; padding: 2rem;">No encontramos productos que coincidan con tu búsqueda.</p>`;
        return;
    }

    container.innerHTML = list.map(product => {
        const fallbackImg = `https://placehold.co/600x400/1e1e1e/f5b800?text=${encodeURIComponent(product.name)}`;
        const oldPriceHtml = product.oldPrice ? `<span class="price-old">$${product.oldPrice}</span>` : '';
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
                            ${oldPriceHtml}
                            <span class="price-current">$${product.price}</span>
                        </div>
                        <button class="btn-add" onclick="addToCart(${safeProduct})">
                            + Agregar
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}