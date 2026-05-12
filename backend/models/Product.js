import { db } from '../db.js';

// SQL для создания таблицы
export const createProductsTable = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    image VARCHAR(500),
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Получить все товары
export const getAllProducts = async () => {
  const query = 'SELECT * FROM products ORDER BY id ASC';
  const [rows] = await db.query(query);
  return rows.map(product => ({
    ...product,
    features: typeof product.features === 'string' ? JSON.parse(product.features) : (product.features || [])
  }));
};

// Получить товары по категории
export const getProductsByCategory = async (category) => {
  const query = 'SELECT * FROM products WHERE category = ? ORDER BY id ASC';
  const [rows] = await db.query(query, [category]);
  return rows.map(product => ({
    ...product,
    features: typeof product.features === 'string' ? JSON.parse(product.features) : (product.features || [])
  }));
};

// Получить товар по ID
export const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = ?';
  const [rows] = await db.query(query, [id]);
  if (rows.length === 0) return null;
  const product = rows[0];
  return {
    ...product,
    features: typeof product.features === 'string' ? JSON.parse(product.features) : (product.features || [])
  };
};

// Получить все категории
export const getCategories = async () => {
  const query = 'SELECT DISTINCT category, category_name FROM products ORDER BY category_name ASC';
  const [rows] = await db.query(query);
  return [
    { value: 'all', label: 'Все категории' },
    ...rows.map(cat => ({
      value: cat.category,
      label: cat.category_name
    }))
  ];
};

// Создать товар
export const createProduct = async (data) => {
  const { name, description, price, category, category_name, image, features } = data;
  const query = `
    INSERT INTO products (name, description, price, category, category_name, image, features) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    name, description, price, category, category_name, image, JSON.stringify(features)
  ]);
  return result.insertId;
};

// Обновить товар
export const updateProduct = async (id, data) => {
  const { name, description, price, category, category_name, image, features } = data;
  const query = `
    UPDATE products SET 
      name = ?, description = ?, price = ?, category = ?, 
      category_name = ?, image = ?, features = ?
    WHERE id = ?
  `;
  await db.query(query, [
    name, description, price, category, category_name, image, JSON.stringify(features), id
  ]);
};

// Удалить товар
export const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id = ?';
  await db.query(query, [id]);
};
