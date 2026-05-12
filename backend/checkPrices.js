import { db } from './db.js';

async function checkTables() {
  try {
    const [tables] = await db.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'cyber_dogg' 
       AND table_name IN ('price_zones', 'zone_prices')`
    );
    console.log('Tables found:', tables);
    
    if (tables.length > 0) {
      const [zones] = await db.query('SELECT * FROM price_zones ORDER BY sort_order');
      console.log('Zones:', zones);
      
      const [prices] = await db.query('SELECT * FROM zone_prices ORDER BY zone_id, period, duration');
      console.log('Prices count:', prices.length);
      console.log('First 5 prices:', prices.slice(0, 5));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkTables();
