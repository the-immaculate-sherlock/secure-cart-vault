
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get user's cart
// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    // Get cart items with product details
    const [cartItems] = await db.query(
      `SELECT c.id, c.user_id, c.product_id, c.quantity, 
              p.name, p.price, p.image_url 
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.user.id]
    );
    
    res.json(cartItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add item to cart
// POST /api/cart
router.post('/', auth, async (req, res) => {
  const { product_id, quantity } = req.body;

  try {
    // Check if product exists and has enough stock
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [product_id]
    );
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const product = products[0];
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Check if item already exists in cart
    const [existingItems] = await db.query(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [req.user.user.id, product_id]
    );
    
    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
      
      // Get updated cart item
      const [updatedItems] = await db.query(
        `SELECT c.id, c.user_id, c.product_id, c.quantity, 
                p.name, p.price, p.image_url 
         FROM cart_items c
         JOIN products p ON c.product_id = p.id
         WHERE c.id = ?`,
        [existingItems[0].id]
      );
      
      return res.json(updatedItems[0]);
    }
    
    // Add new item to cart
    const [result] = await db.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [req.user.user.id, product_id, quantity]
    );
    
    // Get new cart item with product details
    const [newItems] = await db.query(
      `SELECT c.id, c.user_id, c.product_id, c.quantity, 
              p.name, p.price, p.image_url 
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(newItems[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update cart item quantity
// PUT /api/cart/:id
router.put('/:id', auth, async (req, res) => {
  const { quantity } = req.body;

  try {
    // Check if cart item exists and belongs to user
    const [cartItems] = await db.query(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.user.id]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Update quantity
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, req.params.id]
    );
    
    // Get updated cart item
    const [updatedItems] = await db.query(
      `SELECT c.id, c.user_id, c.product_id, c.quantity, 
              p.name, p.price, p.image_url 
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    
    res.json(updatedItems[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove item from cart
// DELETE /api/cart/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if cart item exists and belongs to user
    const [cartItems] = await db.query(
      'SELECT * FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.user.id]
    );
    
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    // Delete cart item
    await db.query(
      'DELETE FROM cart_items WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Clear cart
// DELETE /api/cart
router.delete('/', auth, async (req, res) => {
  try {
    // Delete all cart items for user
    await db.query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [req.user.user.id]
    );
    
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
