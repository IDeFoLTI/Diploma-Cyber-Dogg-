import { db } from './db.js';

async function addMissingPrices() {
  try {
    const zones = await db.query('SELECT * FROM price_zones ORDER BY id');
    
    const [battleArena] = zones[0].filter(z => z.name === "Battlle arena");
    const [vip] = zones[0].filter(z => z.name === "VIP");
    const [playstation] = zones[0].filter(z => z.name === "Playstation 5");
    
    const pricesToAdd = [
      // Battle Arena
      { zoneId: battleArena.id, period: "weekday", duration: "day", price: 110 },
      { zoneId: battleArena.id, period: "weekday", duration: "3hours", price: 280 },
      { zoneId: battleArena.id, period: "weekday", duration: "5hours", price: 400 },
      { zoneId: battleArena.id, period: "weekday", duration: "evening", price: 140 },
      { zoneId: battleArena.id, period: "weekday", duration: "evening3hours", price: 360 },
      { zoneId: battleArena.id, period: "weekday", duration: "evening5hours", price: 490 },
      { zoneId: battleArena.id, period: "night", duration: "night", price: 700, timeRange: "22:00-08:00" },
      { zoneId: battleArena.id, period: "any", duration: "cyberday", price: 1600 },
      { zoneId: battleArena.id, period: "weekend", duration: "day", price: 130 },
      { zoneId: battleArena.id, period: "weekend", duration: "3hours", price: 340 },
      { zoneId: battleArena.id, period: "weekend", duration: "5hours", price: 480 },
      { zoneId: battleArena.id, period: "weekend", duration: "evening", price: 160 },
      { zoneId: battleArena.id, period: "weekend", duration: "evening3hours", price: 420 },
      { zoneId: battleArena.id, period: "weekend", duration: "evening5hours", price: 590 },
      { zoneId: battleArena.id, period: "night", duration: "night", price: 800, timeRange: "22:00-08:00" },
      { zoneId: battleArena.id, period: "any", duration: "weekend_cyberday", price: 1800 },
      
      // VIP
      { zoneId: vip.id, period: "weekday", duration: "day", price: 140 },
      { zoneId: vip.id, period: "weekday", duration: "3hours", price: 360 },
      { zoneId: vip.id, period: "weekday", duration: "5hours", price: 490 },
      { zoneId: vip.id, period: "weekday", duration: "evening", price: 170 },
      { zoneId: vip.id, period: "weekday", duration: "evening3hours", price: 430 },
      { zoneId: vip.id, period: "weekday", duration: "evening5hours", price: 600 },
      { zoneId: vip.id, period: "night", duration: "night", price: 850, timeRange: "22:00-08:00" },
      { zoneId: vip.id, period: "any", duration: "cyberday", price: 1950 },
      { zoneId: vip.id, period: "weekend", duration: "day", price: 160 },
      { zoneId: vip.id, period: "weekend", duration: "3hours", price: 410 },
      { zoneId: vip.id, period: "weekend", duration: "5hours", price: 560 },
      { zoneId: vip.id, period: "weekend", duration: "evening", price: 190 },
      { zoneId: vip.id, period: "weekend", duration: "evening3hours", price: 500 },
      { zoneId: vip.id, period: "weekend", duration: "evening5hours", price: 690 },
      { zoneId: vip.id, period: "night", duration: "night", price: 950, timeRange: "22:00-08:00" },
      { zoneId: vip.id, period: "any", duration: "weekend_cyberday", price: 2200 },
      
      // Playstation 5
      { zoneId: playstation.id, period: "weekday", duration: "day_7people", price: 200, timeRange: "ДО 7 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekday", duration: "3hours_7people", price: 500, timeRange: "ДО 7 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekday", duration: "5hours_7people", price: 750, timeRange: "ДО 7 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekend", duration: "day_7people", price: 250, timeRange: "ДО 7 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekend", duration: "3hours_7people", price: 600, timeRange: "ДО 7 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekend", duration: "5hours_7people", price: 900, timeRange: "ДО 7 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekday", duration: "day_5people", price: 150, timeRange: "ДО 5 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekday", duration: "3hours_5people", price: 400, timeRange: "ДО 5 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekday", duration: "5hours_5people", price: 600, timeRange: "ДО 5 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekend", duration: "day_5people", price: 200, timeRange: "ДО 5 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekend", duration: "3hours_5people", price: 500, timeRange: "ДО 5 ЧЕЛОВЕК" },
      { zoneId: playstation.id, period: "weekend", duration: "5hours_5people", price: 750, timeRange: "ДО 5 ЧЕЛОВЕК" },
    ];
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const price of pricesToAdd) {
      try {
        await db.query(
          "INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
          [price.zoneId, price.period, price.duration, price.price, price.timeRange || null]
        );
        addedCount++;
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          skippedCount++;
        } else {
          throw err;
        }
      }
    }
    
    const [allPrices] = await db.query('SELECT COUNT(*) as count FROM zone_prices');
    console.log(`Added: ${addedCount}, Skipped (duplicates): ${skippedCount}`);
    console.log(`Total prices in database: ${allPrices[0].count}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

addMissingPrices();
