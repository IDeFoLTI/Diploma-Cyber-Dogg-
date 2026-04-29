/**
 * Таблица игрового времени пользователей
 * 
 * Таблица: user_game_time
 * Поля:
 *   id                      - INT AUTO_INCREMENT PRIMARY KEY
 *   phone                   - VARCHAR(20) UNIQUE NOT NULL (основной идентификатор)
 *   common_room_day         - DECIMAL(10,2) DEFAULT 0.00 (Common room - дневное время)
 *   common_room_night       - DECIMAL(10,2) DEFAULT 0.00 (Common room - ночное время)
 *   battle_arena_day        - DECIMAL(10,2) DEFAULT 0.00 (Battle Arena - дневное время)
 *   battle_arena_night      - DECIMAL(10,2) DEFAULT 0.00 (Battle Arena - ночное время)
 *   vip_room_day            - DECIMAL(10,2) DEFAULT 0.00 (VIP room - дневное время)
 *   vip_room_night          - DECIMAL(10,2) DEFAULT 0.00 (VIP room - ночное время)
 *   playstation_under_5     - DECIMAL(10,2) DEFAULT 0.00 (PlayStation - до 5 человек)
 *   playstation_under_7     - DECIMAL(10,2) DEFAULT 0.00 (PlayStation - до 7 человек)
 *   created_at              - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *   updated_at              - TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 */

export const createUserTimeTable = `
  CREATE TABLE IF NOT EXISTS user_game_time (
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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

/**
 * Получить баланс времени пользователя по телефону
 */
export async function getUserTimeBalance(db, phone) {
  const [rows] = await db.query(
    "SELECT * FROM user_game_time WHERE phone = ?",
    [phone]
  );
  return rows[0] || null;
}

/**
 * Добавить время пользователю по телефону
 */
export async function addTimeToUser(db, phone, hall, hours) {
  // Проверить, есть ли запись
  const existing = await getUserTimeBalance(db, phone);
  
  if (existing) {
    // Обновить существующий баланс
    const field = hall === 'common_room_day' ? 'common_room_day' :
                  hall === 'common_room_night' ? 'common_room_night' :
                  hall === 'battle_arena_day' ? 'battle_arena_day' :
                  hall === 'battle_arena_night' ? 'battle_arena_night' :
                  hall === 'vip_room_day' ? 'vip_room_day' :
                  hall === 'vip_room_night' ? 'vip_room_night' :
                  hall === 'playstation_under_5' ? 'playstation_under_5' :
                  hall === 'playstation_under_7' ? 'playstation_under_7' : null;
    
    if (!field) {
      throw new Error("INVALID_HALL");
    }
    
    const newBalance = parseFloat(existing[field]) + hours;
    
    await db.query(
      `UPDATE user_game_time SET ${field} = ? WHERE phone = ?`,
      [newBalance, phone]
    );
    
    const updated = await getUserTimeBalance(db, phone);
    return updated;
  } else {
    // Создать новую запись
    const field = hall === 'common_room_day' ? 'common_room_day' :
                  hall === 'common_room_night' ? 'common_room_night' :
                  hall === 'battle_arena_day' ? 'battle_arena_day' :
                  hall === 'battle_arena_night' ? 'battle_arena_night' :
                  hall === 'vip_room_day' ? 'vip_room_day' :
                  hall === 'vip_room_night' ? 'vip_room_night' :
                  hall === 'playstation_under_5' ? 'playstation_under_5' :
                  hall === 'playstation_under_7' ? 'playstation_under_7' : null;
    
    if (!field) {
      throw new Error("INVALID_HALL");
    }
    
    const [result] = await db.query(
      "INSERT INTO user_game_time (phone, common_room_day, common_room_night, battle_arena_day, battle_arena_night, vip_room_day, vip_room_night, playstation_under_5, playstation_under_7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [phone, 
       hall === 'common_room_day' ? hours : 0,
       hall === 'common_room_night' ? hours : 0,
       hall === 'battle_arena_day' ? hours : 0,
       hall === 'battle_arena_night' ? hours : 0,
       hall === 'vip_room_day' ? hours : 0,
       hall === 'vip_room_night' ? hours : 0,
       hall === 'playstation_under_5' ? hours : 0,
       hall === 'playstation_under_7' ? hours : 0]
    );
    
    return await getUserTimeBalance(db, phone);
  }
}

