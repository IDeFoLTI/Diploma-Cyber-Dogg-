import { db } from '../db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Скрипт для полного сброса и заполнения базы данных
 * Оставляет только: Мышки, Наушники, Коврики, Клавиатуры
 */

async function resetProducts() {
  console.log('🔄 Полный сброс и заполнение базы данных...\n');

  const allowedCategories = ['mice', 'headphones', 'mats', 'keyboards'];

  try {
    // Удалить ВСЕ товары
    console.log('🗑️  Удаление всех товаров...');
    await db.query('DELETE FROM products');
    console.log('✅ Все товары удалены\n');
    
    // Чтение JSON файла
    const productsData = JSON.parse(
      readFileSync(join(__dirname, '../data/sampleProducts.json'), 'utf-8')
    );
    
    // Фильтровать только нужные категории
    const filteredProducts = productsData.filter(p => 
      allowedCategories.includes(p.category)
    );
    
    console.log(`📊 Добавление ${filteredProducts.length} товаров...\n`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const product of filteredProducts) {
      try {
        const { name, description, price, category, category_name, image, features } = product;
        const query = `
          INSERT INTO products (name, description, price, category, category_name, image, features) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [
          name, description, price, category, category_name, image, JSON.stringify(features)
        ]);
        console.log(`✅ Добавлен: ${product.name} (ID: ${result.insertId})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Ошибка при добавлении ${product.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📊 Итоги:`);
    console.log(`   Успешно добавлено: ${successCount}`);
    console.log(`   Ошибок: ${errorCount}`);
    console.log('='.repeat(50));
    
    // Показать все товары
    const [rows] = await db.query('SELECT id, name, category FROM products ORDER BY id');
    console.log('\n✅ Все товары в базе:');
    rows.forEach(p => console.log(`   - ${p.name} (${p.category})`));
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

resetProducts().catch(console.error);
