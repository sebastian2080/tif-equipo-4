document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const resultDiv = document.getElementById('contact-result');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar');

            resultDiv.innerHTML = `
                <div style="background: rgba(34,197,94,0.15); border: 1px solid var(--color-success); color: var(--color-success); padding: 1rem; border-radius: 8px;">
                    ✔ ¡Gracias ${name}! Tu mensaje fue recibido por el equipo de Último Bondi.
                </div>
            `;
            form.reset();
        } catch (err) {
            resultDiv.innerHTML = `
                <div style="background: rgba(239,68,68,0.15); border: 1px solid var(--color-danger); color: var(--color-danger); padding: 1rem; border-radius: 8px;">
                    ✖ ${err.message}
                </div>
            `;
        }
    });
});