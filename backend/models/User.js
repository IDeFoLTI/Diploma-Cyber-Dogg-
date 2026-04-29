/**
 * Модель пользователя
 * 
 * Таблица: users
 * Поля:
 *   id         - INT AUTO_INCREMENT PRIMARY KEY
 *   username   - VARCHAR(50) UNIQUE NOT NULL
 *   email      - VARCHAR(255) UNIQUE NOT NULL
 *   phone      - VARCHAR(20)
 *   password   - VARCHAR(255) NOT NULL (хеш bcrypt)
 *   role       - ENUM('user', 'admin') DEFAULT 'user'
 *   created_at - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 *   updated_at - TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 */

export const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;
