import { db } from "../db.js";

/**
 * Создать нового пользователя
 */
export async function createUser({ username, email, phone, password, role = "user" }) {
  const [result] = await db.execute(
    `INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)`,
    [username, email, phone || null, password, role]
  );
  return { id: result.insertId, username, email, phone, role };
}

/**
 * Найти пользователя по ID
 */
export async function findUserById(id) {
  const [rows] = await db.execute(
    `SELECT id, username, email, phone, role, created_at, updated_at FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Найти пользователя по email
 */
export async function findUserByEmail(email) {
  const [rows] = await db.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
}

/**
 * Найти пользователя по username
 */
export async function findUserByUsername(username) {
  const [rows] = await db.execute(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );
  return rows[0] || null;
}

/**
 * Обновить данные пользователя
 */
export async function updateUser(id, { username, email, phone, password, role }) {
  const fields = [];
  const values = [];

  if (username !== undefined) { fields.push("username = ?"); values.push(username); }
  if (email !== undefined) { fields.push("email = ?"); values.push(email); }
  if (phone !== undefined) { fields.push("phone = ?"); values.push(phone); }
  if (password !== undefined) { fields.push("password = ?"); values.push(password); }
  if (role !== undefined) { fields.push("role = ?"); values.push(role); }

  if (fields.length === 0) return null;

  values.push(id);
  await db.execute(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
  return findUserById(id);
}

/**
 * Удалить пользователя
 */
export async function deleteUser(id) {
  const [result] = await db.execute(
    `DELETE FROM users WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

/**
 * Получить всех пользователей (с пагинацией)
 */
export async function getAllUsers({ limit = 50, offset = 0 } = {}) {
  const [rows] = await db.execute(
    `SELECT id, username, email, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
}
