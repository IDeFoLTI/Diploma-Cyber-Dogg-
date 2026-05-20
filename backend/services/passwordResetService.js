import bcrypt from "bcrypt";
import { findUserByEmail, updateUser } from "../repositories/userRepository.js";
import { db } from "../db.js";

/**
 * Генерация 6-значного кода
 */
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Отправить код восстановления на email
 */
export async function sendResetCode(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Генерируем код
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

  // Удаляем старые неиспользованные коды для этого email
  await db.execute(
    `DELETE FROM password_reset_codes WHERE email = ? AND used = FALSE`,
    [email]
  );

  // Сохраняем новый код (хэшируем для безопасности)
  const hashedCode = await bcrypt.hash(code, 10);
  await db.execute(
    `INSERT INTO password_reset_codes (email, code, expires_at, used) VALUES (?, ?, ?, FALSE)`,
    [email, hashedCode, expiresAt]
  );

  // TODO: Отправить email с кодом
  // Здесь нужно подключить SMTP или сервис отправки email
  console.log(`[EMAIL] Код восстановления для ${email}: ${code}`);

  return { message: "Код отправлен на email", code }; // Для тестирования возвращаем код
}

/**
 * Проверить код восстановления
 */
export async function verifyResetCode(email, code) {
  // Получаем последний код для этого email
  const [codeRows] = await db.execute(
    `SELECT * FROM password_reset_codes WHERE email = ? AND used = FALSE ORDER BY created_at DESC LIMIT 1`,
    [email]
  );

  if (codeRows.length === 0) {
    throw new Error("CODE_NOT_FOUND");
  }

  const storedCode = codeRows[0];
  const isValid = await bcrypt.compare(code, storedCode.code);
  
  if (!isValid) {
    throw new Error("INVALID_CODE");
  }

  if (new Date() > new Date(storedCode.expires_at)) {
    throw new Error("CODE_EXPIRED");
  }

  return true;
}

/**
 * Отметить код как использованный
 */
export async function markCodeAsUsed(email, code) {
  // Находим код и помечаем как использованный
  const [rows] = await db.execute(
    `SELECT id FROM password_reset_codes WHERE email = ? AND code = ? AND used = FALSE ORDER BY created_at DESC LIMIT 1`,
    [email, await bcrypt.hash(code, 10)]
  );
  
  if (rows.length > 0) {
    await db.execute(
      `UPDATE password_reset_codes SET used = TRUE WHERE id = ?`,
      [rows[0].id]
    );
  }
}

/**
 * Сбросить пароль
 */
export async function resetPassword(email, code, newPassword) {
  // Проверяем код
  await verifyResetCode(email, code);

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Хешируем новый пароль
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Обновляем пароль
  await updateUser(user.id, { password: hashedPassword });

  // Отмечаем код как использованный
  await markCodeAsUsed(email, code);

  return { message: "Пароль успешно изменён" };
}

/**
 * Повторно отправить код
 */
export async function resendResetCode(email) {
  return await sendResetCode(email);
}
