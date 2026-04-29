import { db } from './db.js';

async function recreateTable() {
  try {
    // Удалить старую таблицу
    await db.query('DROP TABLE IF EXISTS user_game_time');
    console.log('Table dropped');
    
    // Создать новую таблицу с триггером для удаления при удалении пользователя
    const sql = `
      CREATE TABLE user_game_time (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        common_room_day DECIMAL(10,2) DEFAULT 0.00,
        common_room_night DECIMAL(10,2) DEFAULT 0.00,
        battle_arena_day DECIMAL(10,2) DEFAULT 0.00,
        battle_arena_night DECIMAL(10,2) DEFAULT 0.00,
        vip_room_day DECIMAL(10,2) DEFAULT 0.00,
        vip_room_night DECIMAL(10,2) DEFAULT 0.00,
        playstation_under_5 DECIMAL(10,2) DEFAULT 0.00,
        playstation_under_7 DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await db.query(sql);
    console.log('Table recreated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

recreateTable();
