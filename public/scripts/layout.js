/* ============================================================================
   TODO EQUIPO 4 - DATOS DEL COMERCIO Y LOGOTIPO:
   1. Revisen y actualicen dirección, horarios, WhatsApp o links de redes si hace falta.
   2. En renderHeader(), reemplacen el texto <span class="brand-badge">UB</span>
      por la etiqueta <img src="images/logo-ultimo-bondi.png" alt="Logo"> cuando suban el logo.
   ============================================================================ */
const SITE_CONFIG = {
    name: 'ÚLTIMO BONDI',
    subtitle: 'Espacio Cultural & Bufet UNPAZ',
    address: 'Leandro N. Alem 4636, José C. Paz (Frente a UNPAZ)',
    phone: '11 3602-1477',
    whatsappNumber: '5491136021477',
    instagram: '@ultimobondi.jcp',
    instagramUrl: 'https://www.instagram.com/ultimobondi.jcp/',
    hours: 'Lun a Vie: 07:30 a 22:30 hs | Sáb: 07:30 a 14:00 hs',
    menu: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Menú y Kiosco', href: 'menu.html' },
        { label: 'Agenda Cultural', href: 'agenda.html' },
        { label: 'Nosotros', href: 'nosotros.html' },
        { label: 'Contacto', href: 'contacto.html' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    renderCartModal();
    if (typeof updateCartBadge === 'function') {
        updateCartBadge();
    }
});

function renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = SITE_CONFIG.menu.map(item => {
        const isActive = currentPage === item.href ? 'active' : '';
        return `<li><a href="${item.href}" class="${isActive}">${item.label}</a></li>`;
    }).join('');

    header.innerHTML = `
        <div class="top-banner">
            📍 ${SITE_CONFIG.address} — Pedí anticipado y retirá sin hacer fila entre clases
        </div>
        <div class="site-header">
            <div class="container navbar">
                <!-- TODO EQUIPO 4: Reemplazar el badge "UB" por la imagen oficial del logo en public/images/ -->
                <a href="index.html" class="brand">
                    <span class="brand-badge">UB</span>
                    <span class="brand-text">ÚLTIMO <span>BONDI</span></span>
                </a>

                <ul class="nav-links" id="nav-links">
                    ${navItems}
                </ul>

                <div class="nav-actions">
                    <button class="cart-btn" id="open-cart-btn" aria-label="Ver pedido">
                        🛒 Pedido (<span id="cart-count">0</span>)
                    </button>
                    <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú">☰</button>
                </div>
            </div>
        </div>
    `;

    const toggleBtn = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-links');
    toggleBtn?.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    document.getElementById('open-cart-btn')?.addEventListener('click', () => {
        if (typeof openCartModal === 'function') openCartModal();
    });
}

function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const links = SITE_CONFIG.menu.map(item =>
        `<li><a href="${item.href}">${item.label}</a></li>`
    ).join('');

    footer.innerHTML = `
        <div class="site-footer">
            <div class="container">
                <div class="footer-grid">
                    <div>
                        <h3 class="footer-title">${SITE_CONFIG.name}</h3>
                        <p style="color: var(--color-muted); font-size: 0.92rem;">
                            Espacio autogestivo creado por estudiantes de la UNPAZ. Precios populares, gastronomía casera y cultura rock frente a la universidad.
                        </p>
                    </div>
                    <div>
                        <h3 class="footer-title">Navegación</h3>
                        <ul class="footer-links">${links}</ul>
                    </div>
                    <div>
                        <h3 class="footer-title">Encontranos</h3>
                        <ul class="footer-links">
                            <li>📍 ${SITE_CONFIG.address}</li>
                            <li>🕒 ${SITE_CONFIG.hours}</li>
                            <li>📱 WhatsApp: ${SITE_CONFIG.phone}</li>
                            <li>📸 <a href="${SITE_CONFIG.instagramUrl}" target="_blank">${SITE_CONFIG.instagram}</a></li>
                            <li><a href="admin.html">⚙️ Panel Coordinadores</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    © 2026 Último Bondi - Espacio Cultural | Desarrollado por Equipo 4 (TUCE - UNPAZ)
                </div>
            </div>
        </div>
    `;
}

function renderCartModal() {
    if (document.getElementById('cart-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h2>Tu Pedido Anticipado</h2>
                <button class="close-modal" id="close-cart-btn">&times;</button>
            </div>
            <div id="cart-modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-cart-btn').addEventListener('click', () => {
        modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });
}