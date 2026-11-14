document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel();
    loadFeaturedProducts();
    loadUpcomingEvents();
});

function initHeroCarousel() {
    const track = document.getElementById('hero-track');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const dotsContainer = document.getElementById('hero-dots');
    const carousel = document.getElementById('hero-carousel');

    if (!track) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoplay;

    slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${idx + 1}`);
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

    const startAuto = () => {
        autoplay = setInterval(() => goToSlide(currentIndex + 1), 6000);
    };
    const stopAuto = () => clearInterval(autoplay);

    carousel?.addEventListener('mouseenter', stopAuto);
    carousel?.addEventListener('mouseleave', startAuto);

    startAuto();
}

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
    const fallbackImg = `https://placehold.co/600x400/1e1e1e/f5b800?text=${encodeURIComponent(product.name)}`;
    const oldPriceHtml = product.oldPrice
        ? `<span class="price-old">$${product.oldPrice}</span>`
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
}