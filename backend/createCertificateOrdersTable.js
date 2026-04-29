import { db } from './db.js';

async function createTable() {
  try {
    // Удалить старую таблицу
    await db.query('DROP TABLE IF EXISTS certificate_orders');
    console.log('Old table dropped');
    
    const sql = `
      CREATE TABLE IF NOT EXISTS certificate_orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hall VARCHAR(50) NOT NULL,
        time_type VARCHAR(20) DEFAULT NULL,
        hours VARCHAR(20) DEFAULT NULL,
        package_type VARCHAR(20) DEFAULT NULL,
        phone VARCHAR(20) NOT NULL,
        promo_code VARCHAR(10) UNIQUE NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at),
        INDEX idx_promo_code (promo_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await db.query(sql);
    console.log('Certificate orders table created successfully!');
    console.log('Table includes unique 10-digit promo_code field');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createTable();