const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET /api/products (permite filtrar por ?category=...)
router.get('/', (req, res) => {
    const { category } = req.query;
    if (category) {
        const filtered = products.filter(
            p => p.category.toLowerCase() === category.toLowerCase()
        );
        return res.json(filtered);
    }
    res.json(products);
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

module.exports = router;