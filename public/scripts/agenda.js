document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('events-list');
    if (!container) return;

    try {
        const res = await fetch('/api/events');
        const events = await res.json();

        container.innerHTML = events.map(ev => `
            <article class="info-card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="event-meta">
                        <span>📅 ${ev.date}</span>
                        <span>🕒 ${ev.time}</span>
                    </div>
                    <span style="display:inline-block; background: rgba(245,184,0,0.15); color: var(--color-primary); padding: 0.15rem 0.6rem; border-radius: 6px; font-size: 0.78rem; font-weight: 700; margin-bottom: 0.75rem;">
                        ${ev.category}
                    </span>
                    <h3>${ev.title}</h3>
                    <p style="color: var(--color-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">
                        ${ev.description}
                    </p>
                </div>
                <div style="border-top: 1px solid var(--color-border); padding-top: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: var(--color-primary); font-size: 0.9rem;">🎟 ${ev.entry}</strong>
                    <a href="https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent('Hola Último Bondi! Quiero consultar por el evento: ' + ev.title)}" target="_blank" class="btn btn-outline" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;">
                        Consultar
                    </a>
                </div>
            </article>
        `).join('');
    } catch (error) {
        container.innerHTML = `<p style="color: var(--color-danger);">Error al cargar los eventos culturales.</p>`;
    }
});