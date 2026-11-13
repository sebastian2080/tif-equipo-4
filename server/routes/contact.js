const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const messagesPath = path.join(__dirname, '../data/messages.json');

router.get('/', (req, res) => {
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
    res.json(messages);
});

router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
    const newMessage = {
        id: Date.now(),
        name,
        email,
        message,
        date: new Date().toISOString()
    };

    messages.push(newMessage);
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

    res.status(201).json({ message: 'Consulta enviada con éxito' });
});

module.exports = router;