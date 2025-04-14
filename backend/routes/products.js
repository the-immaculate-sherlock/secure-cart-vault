
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all products
// GET /api/products
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single product
// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin routes (protected)
// Add a product
// POST /api/products
router.post('/', auth, async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;

  try {
    // Insert product into database
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock, image_url]
    );
    
    // Get the newly created product
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(products[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a product
// PUT /api/products/:id
router.put('/:id', auth, async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;

  try {
    // Update product in database
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
      [name, description, price, stock, image_url, req.params.id]
    );
    
    // Get the updated product
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a product
// DELETE /api/products/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Delete product from database
    const [result] = await db.query(
      'DELETE FROM products WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
