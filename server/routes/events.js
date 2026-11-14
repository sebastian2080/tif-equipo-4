const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const eventsFilePath = path.join(__dirname, '../data/events.json');

// GET /api/events -> Lista todos los eventos culturales
router.get('/', (req, res) => {
    const events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
    res.json(events);
});

// POST /api/events -> Agrega un nuevo evento a la agenda cultural
router.post('/', (req, res) => {
    const { title, date, time, description, entry } = req.body;

    if (!title || !date) {
        return res.status(400).json({ error: 'Título y fecha son obligatorios' });
    }

    const events = JSON.parse(fs.readFileSync(eventsFilePath, 'utf-8'));
    const newEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        title,
        date,
        time: time || '20:00 hs',
        description: description || '',
        entry: entry || 'Entrada libre y gratuita'
    };

    events.push(newEvent);
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2));
    res.status(201).json({ message: 'Evento publicado', event: newEvent });
});

module.exports = router;