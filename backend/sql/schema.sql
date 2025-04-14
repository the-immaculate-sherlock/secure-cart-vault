
-- Drop database if it exists (be careful with this in production)
-- DROP DATABASE IF EXISTS ecommerce_db;

-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Users table with AES encrypted address
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  address TEXT, -- AES encrypted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cards table with AES encrypted card_number and cvv
CREATE TABLE IF NOT EXISTS cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  card_number TEXT NOT NULL, -- AES encrypted
  card_holder VARCHAR(100) NOT NULL,
  expiry_date VARCHAR(5) NOT NULL,
  cvv TEXT NOT NULL, -- AES encrypted
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status ENUM('processing', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'processing',
  payment_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES cards(id) ON DELETE SET NULL
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY user_product (user_id, product_id)
);

-- Sample product data (optional)
INSERT INTO products (name, description, price, stock, image_url) VALUES
('Smartphone X', 'Latest smartphone with advanced features', 999.99, 50, 'https://via.placeholder.com/300'),
('Laptop Pro', 'High-performance laptop for professionals', 1299.99, 30, 'https://via.placeholder.com/300'),
('Wireless Headphones', 'Premium noise-cancelling headphones', 199.99, 100, 'https://via.placeholder.com/300'),
('Smart Watch', 'Fitness and health tracking smartwatch', 249.99, 75, 'https://via.placeholder.com/300'),
('Tablet Ultra', 'Ultra-thin tablet with stunning display', 499.99, 40, 'https://via.placeholder.com/300');
