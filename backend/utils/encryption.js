
const crypto = require('crypto');

// Get encryption keys from environment variables
const AES_KEY = process.env.AES_KEY;
const AES_IV = process.env.AES_IV;

// AES-256-CBC encryption
const encrypt = (text) => {
  if (!text) return null;
  
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(AES_KEY), Buffer.from(AES_IV));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
};

// AES-256-CBC decryption
const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(AES_KEY), Buffer.from(AES_IV));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
};

module.exports = {
  encrypt,
  decrypt
};
