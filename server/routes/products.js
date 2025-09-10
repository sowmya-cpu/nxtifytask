// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products?sort=asc|desc
router.get('/', async (req, res) => {
  try {
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const products = await Product.find().sort({ price: sort });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// PUT /api/products/:id
// routes/products.js (add / replace the PUT handler)
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT /api/products/' + req.params.id, 'body:', req.body);

    const updates = req.body; // accept whatever fields client sends
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updatedProduct);
  } catch (err) {
    console.error('PUT /api/products/:id error ->', err);
    // send back the error message so client can show it
    return res.status(500).json({ error: err.message || 'Server error' });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    if (!name || price === undefined) return res.status(400).json({ error: 'Name and price are required' });

    const product = new Product({ name, price, description, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    await p.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
