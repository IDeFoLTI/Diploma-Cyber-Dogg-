/**
 * Модель для управления ценами на залы
 */

export const createPriceZonesTable = `
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
`;

export const createZonePricesTable = `
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
`;

export class PriceZone {
  /**
   * Создать зону цен
   */
  static async create({ name, computerCount, zoneType }) {
    const { db } = await import("../db.js");
    const [result] = await db.query(
      "INSERT INTO price_zones (name, computer_count, zone_type) VALUES (?, ?, ?)",
      [name, computerCount || null, zoneType || 'gaming']
    );
    return result.insertId;
  }

  /**
   * Получить все зоны цен
   */
  static async getAll() {
    const { db } = await import("../db.js");
    const [zones] = await db.query("SELECT * FROM price_zones ORDER BY sort_order, id");
    return zones;
  }

  /**
   * Получить зону по ID
   */
  static async getById(id) {
    const { db } = await import("../db.js");
    const [zones] = await db.query("SELECT * FROM price_zones WHERE id = ?", [id]);
    return zones[0] || null;
  }

  /**
   * Обновить зону
   */
  static async update(id, { name, computerCount, zoneType, sortOrder }) {
    const { db } = await import("../db.js");
    await db.query(
      "UPDATE price_zones SET name = ?, computer_count = ?, zone_type = ?, sort_order = ? WHERE id = ?",
      [name, computerCount, zoneType, sortOrder, id]
    );
  }

  /**
   * Удалить зону
   */
  static async delete(id) {
    const { db } = await import("../db.js");
    // Сначала удалить все цены этой зоны
    await db.query("DELETE FROM zone_prices WHERE zone_id = ?", [id]);
    // Затем удалить зону
    await db.query("DELETE FROM price_zones WHERE id = ?", [id]);
  }
}

/**
 * Модель для управления ценами в зонах
 */
export class ZonePrice {
  /**
   * Создать цену для зоны
   */
  static async create({ zoneId, period, duration, price, timeRange }) {
    const { db } = await import("../db.js");
    const [result] = await db.query(
      "INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
      [zoneId, period, duration, price, timeRange || null]
    );
    return result.insertId;
  }

  /**
   * Получить все цены для зоны
   */
  static async getByZoneId(zoneId) {
    const { db } = await import("../db.js");
    const [prices] = await db.query(
      "SELECT * FROM zone_prices WHERE zone_id = ? ORDER BY period, duration",
      [zoneId]
    );
    return prices;
  }

  /**
   * Получить цену по ID
   */
  static async getById(id) {
    const { db } = await import("../db.js");
    const [prices] = await db.query("SELECT * FROM zone_prices WHERE id = ?", [id]);
    return prices[0] || null;
  }

  /**
   * Обновить цену
   */
  static async update(id, { price }) {
    const { db } = await import("../db.js");
    await db.query("UPDATE zone_prices SET price = ? WHERE id = ?", [price, id]);
  }

  /**
   * Удалить цену
   */
  static async delete(id) {
    const { db } = await import("../db.js");
    await db.query("DELETE FROM zone_prices WHERE id = ?", [id]);
  }

  /**
   * Получить все цены для всех зон (для публичного использования)
   */
  static async getAllWithZones() {
    const { db } = await import("../db.js");
    const [prices] = await db.query(
      `SELECT zp.*, pz.name as zone_name, pz.computer_count, pz.zone_type 
       FROM zone_prices zp 
       JOIN price_zones pz ON zp.zone_id = pz.id 
       ORDER BY pz.sort_order, pz.id, zp.period, zp.duration`
    );
    return prices;
  }
}
