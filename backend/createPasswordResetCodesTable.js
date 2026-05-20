import { db } from "./db.js";

async function createPasswordResetCodesTable() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS password_reset_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Таблица password_reset_codes успешно создана");
  } catch (error) {
    console.error("Ошибка создания таблицы:", error);
  } finally {
    await db.end();
  }
}

createPasswordResetCodesTable();
