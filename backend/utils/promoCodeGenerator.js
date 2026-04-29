/**
 * Генерация уникального 10-значного промокода
 */
export function generatePromoCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Исключаем похожие символы: I, O, 0, 1
  let code = '';
  
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
}

/**
 * Проверка уникальности промокода в БД
 */
export async function checkPromoCodeUnique(db, promoCode) {
  const [rows] = await db.query(
    "SELECT id FROM certificate_orders WHERE promo_code = ?",
    [promoCode]
  );
  return rows.length === 0;
}

/**
 * Генерация уникального промокода с проверкой на дубликаты
 */
export async function generateUniquePromoCode(db, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const promoCode = generatePromoCode();
    const isUnique = await checkPromoCodeUnique(db, promoCode);
    
    if (isUnique) {
      return promoCode;
    }
  }
  
  throw new Error("Не удалось сгенерировать уникальный промокод");
}