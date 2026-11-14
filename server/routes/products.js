const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const productsFilePath = path.join(__dirname, '../data/products.json');

// GET /api/products -> Lista todos los productos (con filtro opcional por categoría)
router.get('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const { category } = req.query;

    if (category && category !== 'Todos') {
        return res.json(products.filter(p => p.category === category));
    }

    res.json(products);
});

// POST /api/products -> Crea un nuevo producto en la carta
router.post('/', (req, res) => {
    const { name, category, price, description, urlImg } = req.body;

    if (!name || !category || price === undefined) {
        return res.status(400).json({ error: 'Nombre, categoría y precio son obligatorios' });
    }

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        category,
        price: Number(price),
        description: description || 'Preparado en el momento en Último Bondi.',
        urlImg: urlImg || 'images/products/default.jpg'
    };

    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json({ message: 'Producto agregado', product: newProduct });
});

// PUT /api/products/:id -> Actualiza precio o datos de un plato
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { price, name, category } = req.body;

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (price !== undefined) products[index].price = Number(price);
    if (name !== undefined) products[index].name = name;
    if (category !== undefined) products[index].category = category;

    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json({ message: 'Producto actualizado', product: products[index] });
});

// DELETE /api/products/:id -> Elimina un producto de la carta
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const filtered = products.filter(p => p.id !== id);

    if (filtered.length === products.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    fs.writeFileSync(productsFilePath, JSON.stringify(filtered, null, 2));
    res.json({ message: 'Producto eliminado' });
});

module.exports = router;