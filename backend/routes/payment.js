
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');
const { encrypt } = require('../utils/encryption');

// Process payment
// POST /api/payment
router.post('/', auth, async (req, res) => {
  const { 
    cardNumber, 
    cardHolder, 
    expiryDate, 
    cvv, 
    orderId 
  } = req.body;

  // Start transaction
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Check if order exists and belongs to user
    const [orders] = await connection.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, req.user.user.id]
    );
    
    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Encrypt sensitive data
    const encryptedCardNumber = encrypt(cardNumber);
    const encryptedCvv = encrypt(cvv);
    
    // Store card information
    const [cardResult] = await connection.query(
      `INSERT INTO cards (user_id, card_number, card_holder, expiry_date, cvv) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.user.id,
        encryptedCardNumber,
        cardHolder,
        expiryDate,
        encryptedCvv
      ]
    );
    
    // Update order status
    await connection.query(
      `UPDATE orders SET status = 'paid', payment_id = ? WHERE id = ?`,
      [cardResult.insertId, orderId]
    );
    
    // Commit transaction
    await connection.commit();
    
    res.json({ message: 'Payment processed successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err.message);
    res.status(500).send('Server error');
  } finally {
    connection.release();
  }
});

module.exports = router;
