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
    images JSON,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const normalizeProduct = (product) => {
  const parsedFeatures = typeof product.features === 'string' ? JSON.parse(product.features) : (product.features || []);
  let parsedImages = [];

  if (product.images) {
    parsedImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  }

  if ((!Array.isArray(parsedImages) || parsedImages.length === 0) && product.image) {
    parsedImages = [product.image];
  }

  return {
    ...product,
    features: parsedFeatures,
    images: Array.isArray(parsedImages) ? parsedImages : []
  };
};

// Получить все товары
export const getAllProducts = async () => {
  const query = 'SELECT * FROM products ORDER BY id ASC';
  const [rows] = await db.query(query);
  return rows.map(normalizeProduct);
};

// Получить товары по категории
export const getProductsByCategory = async (category) => {
  const query = 'SELECT * FROM products WHERE category = ? ORDER BY id ASC';
  const [rows] = await db.query(query, [category]);
  return rows.map(normalizeProduct);
};

// Получить товар по ID
export const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = ?';
  const [rows] = await db.query(query, [id]);
  if (rows.length === 0) return null;
  return normalizeProduct(rows[0]);
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
  const { name, description, price, category, category_name, images, features } = data;
  const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
  const query = `
    INSERT INTO products (name, description, price, category, category_name, image, images, features) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [
    name,
    description,
    price,
    category,
    category_name,
    firstImage,
    JSON.stringify(images || []),
    JSON.stringify(features || [])
  ]);
  return result.insertId;
};

// Обновить товар
export const updateProduct = async (id, data) => {
  const { name, description, price, category, category_name, images, features } = data;

  // Если переданы новые изображения, обновляем их
  let updateData = {
    name,
    description,
    price,
    category,
    category_name,
    features
  };

  if (images && Array.isArray(images) && images.length > 0) {
    updateData.image = images[0]; // первое изображение для обратной совместимости
    updateData.images = JSON.stringify(images);
  }

  const setParts = [];
  const values = [];

  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      setParts.push(`${key} = ?`);
      values.push(key === 'features' ? JSON.stringify(updateData[key]) : updateData[key]);
    }
  });

  if (setParts.length === 0) {
    throw new Error('Нет данных для обновления');
  }

  const query = `UPDATE products SET ${setParts.join(', ')} WHERE id = ?`;
  values.push(id);

  await db.query(query, values);
};

// Удалить товар
export const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id = ?';
  await db.query(query, [id]);
};
