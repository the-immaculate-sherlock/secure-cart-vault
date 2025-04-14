
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get user's orders
// GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    // Get orders with order items
    const [orders] = await db.query(
      `SELECT id, user_id, total_price, status, created_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.user.id]
    );
    
    // Get order items for each order
    for (let order of orders) {
      const [orderItems] = await db.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price, 
                p.name, p.image_url 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      
      order.items = orderItems;
    }
    
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single order
// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    // Get order
    const [orders] = await db.query(
      `SELECT id, user_id, total_price, status, created_at 
       FROM orders 
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    
    // Get order items
    const [orderItems] = await db.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price, 
              p.name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    
    order.items = orderItems;
    
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create order from cart
// POST /api/orders
router.post('/', auth, async (req, res) => {
  // Start transaction
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT c.id, c.product_id, c.quantity, p.price, p.stock 
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.user.id]
    );
    
    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Calculate total price and check stock
    let totalPrice = 0;
    
    for (let item of cartItems) {
      if (item.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          message: `Not enough stock for product ID ${item.product_id}` 
        });
      }
      
      totalPrice += item.price * item.quantity;
    }
    
    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_price, status, created_at) 
       VALUES (?, ?, 'processing', NOW())`,
      [req.user.user.id, totalPrice]
    );
    
    const orderId = orderResult.insertId;
    
    // Create order items and update product stock
    for (let item of cartItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      await connection.query(
        `UPDATE products SET stock = stock - ? WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }
    
    // Clear cart
    await connection.query(
      `DELETE FROM cart_items WHERE user_id = ?`,
      [req.user.user.id]
    );
    
    // Commit transaction
    await connection.commit();
    
    // Get created order with items
    const [orders] = await connection.query(
      `SELECT id, user_id, total_price, status, created_at 
       FROM orders 
       WHERE id = ?`,
      [orderId]
    );
    
    const order = orders[0];
    
    const [orderItems] = await connection.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price, 
              p.name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    order.items = orderItems;
    
    res.status(201).json(order);
  } catch (err) {
    await connection.rollback();
    console.error(err.message);
    res.status(500).send('Server error');
  } finally {
    connection.release();
  }
});

module.exports = router;
