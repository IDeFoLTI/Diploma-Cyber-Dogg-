import { createProduct } from '../models/Product.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Чтение JSON файла
const productsData = JSON.parse(
  readFileSync(join(__dirname, '../data/sampleProducts.json'), 'utf-8')
);

/**
 * Скрипт для заполнения базы данных тестовыми товарами
 * Запускается: node scripts/seedProducts.js
 */

async function seedProducts() {
  console.log('🌱 Начало заполнения базы данных товарами...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const product of productsData) {
    try {
      const id = await createProduct(product);
      console.log(`✅ Успешно добавлен: ${product.name} (ID: ${id})`);
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
  console.log(`   Всего товаров: ${productsData.length}`);
  console.log('='.repeat(50));

  if (errorCount === 0) {
    console.log('\n✨ Все товары успешно добавлены в базу данных!');
  } else {
    console.log('\n⚠️ Некоторые товары не были добавлены. Проверьте ошибки выше.');
  }
}

// Запуск скрипта
seedProducts().catch(console.error);
