import { db } from '../db.js';

// SQL для создания таблицы заказов
export const createOrdersTable = `
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// SQL для создания таблицы позиций заказа
export const createOrderItemsTable = `
  CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    image VARCHAR(500),
    type VARCHAR(20) DEFAULT 'product',
    cert_id VARCHAR(50),
    cert_title VARCHAR(100),
    time_type VARCHAR(20),
    hours VARCHAR(20),
    package_type VARCHAR(20),
    players VARCHAR(20),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Создать заказ
export async function createOrder(orderData) {
  const { phone, total_price, items } = orderData;

  const [orderResult] = await db.query(
    'INSERT INTO orders (phone, total_price, status) VALUES (?, ?, ?)',
    [phone, total_price, 'pending']
  );

  const orderId = orderResult.insertId;

  // Вставить позиции заказа
  for (const item of items) {
    if (item.type === 'product') {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, image, type)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.name, item.price, item.quantity || 1, item.image || null, 'product']
      );
    } else if (item.type === 'certificate') {
      await db.query(
        `INSERT INTO order_items (order_id, name, price, quantity, type, cert_id, cert_title, time_type, hours, package_type, players)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.certTitle || 'Сертификат',
          item.price,
          1,
          'certificate',
          item.certId || null,
          item.certTitle || null,
          item.timeType || null,
          item.hours || null,
          item.package || null,
          item.players || null
        ]
      );
    }
  }

  return orderId;
}

// Получить все заказы с позициями
export async function getAllOrders() {
  const [orders] = await db.query(
    'SELECT * FROM orders ORDER BY created_at DESC'
  );

  const result = [];
  for (const order of orders) {
    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );
    result.push({ ...order, items });
  }

  return result;
}

// Получить заказ по ID
export async function getOrderById(id) {
  const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
  if (orders.length === 0) return null;

  const [items] = await db.query(
    'SELECT * FROM order_items WHERE order_id = ?',
    [id]
  );

  return { ...orders[0], items };
}

// Обновить статус заказа
export async function updateOrderStatus(id, status) {
  const validStatuses = ['pending', 'paid', 'ready', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new Error('Невалидный статус');
  }

  await db.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );
}

// Получить заказы по телефону
export async function getOrdersByPhone(phone) {
  const [orders] = await db.query(
    'SELECT * FROM orders WHERE phone = ? ORDER BY created_at DESC',
    [phone]
  );

  const result = [];
  for (const order of orders) {
    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );
    result.push({ ...order, items });
  }

  return result;
}

// Удалить заказ
export async function deleteOrder(id) {
  await db.query('DELETE FROM orders WHERE id = ?', [id]);
}
