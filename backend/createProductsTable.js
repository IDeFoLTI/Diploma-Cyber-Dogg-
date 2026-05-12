import { db } from './db.js';

const createProductsTable = async () => {
  const createTableSQL = `
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

  try {
    await db.query(createTableSQL);
    console.log('Таблица products успешно создана');

    // Вставка тестовых данных
    const insertSQL = `
      INSERT INTO products (name, description, price, category, category_name, image, features) VALUES
      ('Игровые перчатки Pro', 'Профессиональные перчатки для точного контроля. Дышащий материал с усиленным сцеплением на пальцах для максимальной производительности.', 990, 'gloves', 'Перчатки', '/img/gloves.png', '[\"Дышащий материал\", \"Усиленное сцепление\", \"Анатомический дизайн\", \"Универсальный размер\"]'),
      ('Мышь Logitech G Pro', 'Высокоточный сенсор HERO 25K DPI, вес всего 80г. Идеальный выбор для профессионального киберспорта и длительных игровых сессий.', 12490, 'mice', 'Мышки', '/img/mouse-logitech.png', '[\"Сенсор HERO 25K\", \"Вес 80г\", \"Беспроводная связь LIGHTSPEED\", \"6 программируемых кнопок\"]'),
      ('Мышь Razer DeathAdder', 'Легендарная эргономичная мышь для правой руки. Сенсор Focus+ 20K DPI и фирменная подсветка Chroma RGB.', 8990, 'mice', 'Мышки', '/img/mouse-razer.png', '[\"Сенсор Focus+ 20K DPI\", \"Эргономичный дизайн\", \"8 программируемых кнопок\", \"Подсветка Chroma RGB\"]'),
      ('Коврик SteelSeries QcK', 'Классический игровой коврик размером 450x400мм. Оптимальное скольжение для всех типов сенсов и стилей игры.', 1990, 'mats', 'Коврики', '/img/mat-steelseries.png', '[\"Размер: 450x400x2мм\", \"Тканевая поверхность\", \"Резиновое основание\", \"Водоотталкивающая пропитка\"]'),
      ('Коврик HyperX Fury S XL', 'Крупный игровой коврик XL размера 900x400мм. Мягкая тканевая поверхность для максимального комфорта.', 2490, 'mats', 'Коврики', '/img/mat-hyperx.png', '[\"Размер: 900x400x4мм\", \"Мягкая тканевая поверхность\", \"Противоскользящее основание\", \"Окантовка по краям\"]'),
      ('Наушники HyperX Cloud II', 'Игровая гарнитура с объёмным звуком 7.1. Невероятный комфорт на долгих игровых сессиях благодаря памяти с эффектом формы.', 11990, 'headphones', 'Наушники', '/img/headphones-hyperx.png', '[\"Объёмный звук 7.1\", \"Память с эффектом формы\", \"Отсоединяемый микрофон\", \"Вес 320г\"]'),
      ('Наушники Razer BlackShark V2', 'Продвинутая игровая гарнитура с THX 7.1 Spatial Audio. Лёгкая конструкция всего 260г и превосходная звуковая изоляция.', 13490, 'headphones', 'Наушники', '/img/headphones-razer.png', '[\"THX 7.1 Spatial Audio\", \"Драйверы 50мм Tritanium\", \"Микрофон с шумоподавлением\", \"Вес 260г\"]'),
      ('Перчатки Corsair Gaming GL80', 'Премиальные игровые перчатки с дышащим материалом и силиконовыми вставками. Максимальный комфорт и контроль.', 1490, 'gloves', 'Перчатки', '/img/gloves-corsair.png', '[\"Дышащий материал\", \"Силиконовые вставки\", \"Вентилируемая ладонь\", \"Логотип Corsair RGB\"]');
    `;

    await db.query('DELETE FROM products');
    await db.query(insertSQL);
    console.log('Тестовые данные успешно вставлены');
  } catch (error) {
    console.error('Ошибка при создании таблицы:', error);
  } finally {
    db.end();
  }
};

createProductsTable();
