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
    renderWhatsAppFloat();
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
        return `<li><a href="item.href"class="{isActive}">${item.label}</a></li>`;
    }).join('');

    header.innerHTML = `
        <div class="top-banner">
            📍 ${SITE_CONFIG.address} — Pedí anticipado y retirá sin hacer fila entre clases
        </div>
        <div class="site-header">
            <div class="container navbar">
                <!-- TODO EQUIPO 4: Reemplazar el badge "UB" por la imagen oficial del logo en public/images/ -->
               <a href="index.html" class="brand">
    <img src="images/logo.png" alt="Logo Último Bondi" class="brand-logo">
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
        `<li><a href="item.href">{item.label}</a></li>`
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
                            <li>📸 <a href="SITECONFIG.instagramUrl"target="blank">{SITE_CONFIG.instagram}</a></li>
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
function renderWhatsAppFloat() {
    if (document.getElementById('wsp-float-btn')) return;

    const mensaje = encodeURIComponent('Hola Último Bondi! Quiero hacer una consulta.');
    const btn = document.createElement('a');
    btn.id = 'wsp-float-btn';
    btn.className = 'wsp-float';
    btn.href = `https://wa.link/k7hj2c`;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.setAttribute('aria-label', 'Contactar por WhatsApp');
    btn.innerHTML = `
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
            <path d="M16.04 2.003c-7.72 0-13.98 6.26-13.98 13.98 0 2.46.64 4.87 1.86 6.99L2 30l7.21-1.89a13.93 13.93 0 0 0 6.83 1.78h.01c7.72 0 13.98-6.26 13.98-13.98 0-3.74-1.46-7.25-4.1-9.89a13.88 13.88 0 0 0-9.89-4.02zm0 25.52h-.01a11.58 11.58 0 0 1-5.9-1.61l-.42-.25-4.28 1.12 1.14-4.17-.27-.43a11.55 11.55 0 0 1-1.78-6.2c0-6.39 5.2-11.59 11.6-11.59 3.1 0 6.01 1.21 8.2 3.4a11.52 11.52 0 0 1 3.39 8.2c0 6.39-5.2 11.53-11.67 11.53zm6.36-8.68c-.35-.17-2.06-1.02-2.38-1.13-.32-.12-.55-.17-.78.17-.23.35-.9 1.13-1.1 1.37-.2.23-.41.26-.75.09-.35-.17-1.47-.54-2.8-1.73-1.03-.92-1.73-2.06-1.93-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.52-.61.17-.2.23-.35.35-.58.12-.23.06-.44-.03-.61-.09-.17-.78-1.88-1.07-2.58-.28-.68-.57-.58-.78-.59h-.67c-.23 0-.61.09-.93.44-.32.35-1.22 1.19-1.22 2.9s1.25 3.36 1.42 3.59c.17.23 2.46 3.76 5.96 5.27.83.36 1.48.57 1.99.73.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.65.29-.81.29-1.51.2-1.65-.08-.15-.31-.23-.66-.41z"/>
        </svg>
    `;

    document.body.appendChild(btn);
}

