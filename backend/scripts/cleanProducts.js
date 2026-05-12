import { db } from '../db.js';

/**
 * Скрипт для очистки базы данных от лишних товаров
 * Оставляет только: Мышки, Наушники, Коврики, Клавиатуры
 */

async function cleanProducts() {
  console.log('🧹 Очистка базы данных от лишних товаров...\n');

  const allowedCategories = ['mice', 'headphones', 'mats', 'keyboards'];

  try {
    // Получить все товары
    const [rows] = await db.query('SELECT id, name, category FROM products');
    
    console.log(`📊 Найдено товаров: ${rows.length}`);
    
    let deletedCount = 0;
    
    for (const product of rows) {
      if (!allowedCategories.includes(product.category)) {
        await db.query('DELETE FROM products WHERE id = ?', [product.id]);
        console.log(`❌ Удалён: ${product.name} (ID: ${product.id}, Категория: ${product.category})`);
        deletedCount++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Итоги:`);
    console.log(`   Удалено товаров: ${deletedCount}`);
    console.log(`   Осталось товаров: ${rows.length - deletedCount}`);
    console.log('='.repeat(50));
    
    // Показать оставшиеся товары
    const [remaining] = await db.query('SELECT id, name, category FROM products ORDER BY id');
    console.log('\n✅ Оставшиеся товары:');
    remaining.forEach(p => console.log(`   - ${p.name} (${p.category})`));
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

cleanProducts().catch(console.error);
