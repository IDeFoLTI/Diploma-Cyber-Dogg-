import { db } from './db.js';

async function createTrigger() {
  try {
    // Удалить старый триггер если есть
    try {
      await db.query('DROP TRIGGER IF EXISTS before_user_delete');
      console.log('Old trigger dropped');
    } catch (e) {
      console.log('No old trigger to drop');
    }
    
    // Создать триггер для удаления записей игрового времени при удалении пользователя
    const triggerSQL = `
      CREATE TRIGGER before_user_delete
      BEFORE DELETE ON users
      FOR EACH ROW
      DELETE FROM user_game_time WHERE phone = OLD.phone
    `;
    
    await db.query(triggerSQL);
    console.log('Trigger created successfully!');
    console.log('Now when a user is deleted, their game time record will also be deleted');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createTrigger();