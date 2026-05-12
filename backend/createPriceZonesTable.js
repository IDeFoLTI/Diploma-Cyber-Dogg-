/**
 * Миграция для создания таблиц управления ценами на залы
 */

async function createPriceZonesTable() {
  const { db } = await import("./db.js");

  try {
    // Создать таблицу price_zones (зоны/залы)
    await db.query(`
      CREATE TABLE IF NOT EXISTS price_zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL COMMENT 'Название зала/зоны',
        computer_count INT DEFAULT NULL COMMENT 'Количество компьютеров',
        zone_type VARCHAR(50) DEFAULT 'gaming' COMMENT 'Тип зоны: gaming, playstation, vip',
        sort_order INT DEFAULT 0 COMMENT 'Порядок отображения',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_sort_order (sort_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Создать таблицу zone_prices (цены для зон)
    await db.query(`
      CREATE TABLE IF NOT EXISTS zone_prices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        zone_id INT NOT NULL COMMENT 'ID зоны',
        period VARCHAR(50) NOT NULL COMMENT 'Период: weekday (ПН-ЧТ), weekend (ПТ-ВС)',
        duration VARCHAR(50) NOT NULL COMMENT 'Длительность: day, evening, night, 1hour, 3hours, 5hours, cyberday, full',
        price DECIMAL(10,2) NOT NULL COMMENT 'Цена в рублях',
        time_range VARCHAR(100) DEFAULT NULL COMMENT 'Диапазон времени (например, 22:00-08:00)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (zone_id) REFERENCES price_zones(id) ON DELETE CASCADE,
        INDEX idx_zone_period (zone_id, period),
        UNIQUE KEY unique_zone_period_duration (zone_id, period, duration)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Вставить стартовые данные для price_zones
    const [existingZones] = await db.query("SELECT COUNT(*) as count FROM price_zones");
    if (existingZones[0].count === 0) {
      await db.query("INSERT INTO price_zones (name, computer_count, zone_type, sort_order) VALUES (?, ?, ?, ?)",
        ["Common room", 20, "gaming", 1]);
      await db.query("INSERT INTO price_zones (name, computer_count, zone_type, sort_order) VALUES (?, ?, ?, ?)",
        ["Battlle arena", 10, "gaming", 2]);
      await db.query("INSERT INTO price_zones (name, computer_count, zone_type, sort_order) VALUES (?, ?, ?, ?)",
        ["VIP", 5, "vip", 3]);
      await db.query("INSERT INTO price_zones (name, computer_count, zone_type, sort_order) VALUES (?, ?, ?, ?)",
        ["Playstation 5", null, "playstation", 4]);
    }

    // Вставить стартовые данные для zone_prices (текущие цены из Price.vue)
    const [existingPrices] = await db.query("SELECT COUNT(*) as count FROM zone_prices");
    if (existingPrices[0].count === 0) {
      const zones = await db.query("SELECT * FROM price_zones ORDER BY sort_order");
      const [commonRoom] = zones[0].filter(z => z.name === "Common room");
      const [battleArena] = zones[0].filter(z => z.name === "Battlle arena");
      const [vip] = zones[0].filter(z => z.name === "VIP");
      const [playstation] = zones[0].filter(z => z.name === "Playstation 5");

      // Common room - ПН-ЧТ
      if (commonRoom) {
        // ПН-ЧТ - ДЕНЬ
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekday", "day", 80]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekday", "3hours", 200]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekday", "5hours", 290]);
        
        // ПН-ЧТ - ВЕЧЕР
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekday", "evening", 110]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekday", "evening3hours", 280]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekday", "evening5hours", 400]);
        
        // Ночь
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [commonRoom.id, "night", "night", 550, "22:00-08:00"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "any", "cyberday", 1200]);
      }

      // Common room - ПТ-ВС
      if (commonRoom) {
        // ПТ-ВС - ДЕНЬ
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekend", "day", 90]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekend", "3hours", 240]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekend", "5hours", 330]);
        
        // ПТ-ВС - ВЕЧЕР
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekend", "evening", 120]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekend", "evening3hours", 320]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "weekend", "evening5hours", 480]);
        
        // Ночь
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [commonRoom.id, "night", "night", 600, "22:00-08:00"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [commonRoom.id, "any", "weekend_cyberday", 1600]);
      }

      // Battlle arena - ПН-ЧТ
      if (battleArena) {
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekday", "day", 110]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekday", "3hours", 280]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekday", "5hours", 400]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekday", "evening", 140]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekday", "evening3hours", 360]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekday", "evening5hours", 490]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [battleArena.id, "night", "night", 700, "22:00-08:00"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "any", "cyberday", 1600]);
      }

      // Battlle arena - ПТ-ВС
      if (battleArena) {
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekend", "day", 130]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekend", "3hours", 340]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekend", "5hours", 480]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekend", "evening", 160]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekend", "evening3hours", 420]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "weekend", "evening5hours", 590]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [battleArena.id, "night", "night", 800, "22:00-08:00"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [battleArena.id, "any", "weekend_cyberday", 1800]);
      }

      // VIP - ПН-ЧТ
      if (vip) {
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekday", "day", 140]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekday", "3hours", 360]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekday", "5hours", 490]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekday", "evening", 170]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekday", "evening3hours", 430]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekday", "evening5hours", 600]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [vip.id, "night", "night", 850, "22:00-08:00"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "any", "cyberday", 1950]);
      }

      // VIP - ПТ-ВС
      if (vip) {
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekend", "day", 160]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekend", "3hours", 410]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekend", "5hours", 560]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekend", "evening", 190]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekend", "evening3hours", 500]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "weekend", "evening5hours", 690]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [vip.id, "night", "night", 950, "22:00-08:00"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price) VALUES (?, ?, ?, ?)",
          [vip.id, "any", "weekend_cyberday", 2200]);
      }

      // Playstation 5 - ПН-ЧТ (до 7 человек)
      if (playstation) {
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekday", "day_7people", 200, "ДО 7 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekday", "3hours_7people", 500, "ДО 7 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekday", "5hours_7people", 750, "ДО 7 ЧЕЛОВЕК"]);
        
        // Playstation 5 - ПТ-ВС (до 7 человек)
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekend", "day_7people", 250, "ДО 7 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekend", "3hours_7people", 600, "ДО 7 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekend", "5hours_7people", 900, "ДО 7 ЧЕЛОВЕК"]);
        
        // Playstation 5 - ПН-ЧТ (до 5 человек)
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekday", "day_5people", 150, "ДО 5 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekday", "3hours_5people", 400, "ДО 5 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekday", "5hours_5people", 600, "ДО 5 ЧЕЛОВЕК"]);
        
        // Playstation 5 - ПТ-ВС (до 5 человек)
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekend", "day_5people", 200, "ДО 5 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekend", "3hours_5people", 500, "ДО 5 ЧЕЛОВЕК"]);
        await db.query("INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [playstation.id, "weekend", "5hours_5people", 750, "ДО 5 ЧЕЛОВЕК"]);
      }
    }

    console.log("Price zones tables created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating price zones tables:", err);
    process.exit(1);
  }
}

createPriceZonesTable();
