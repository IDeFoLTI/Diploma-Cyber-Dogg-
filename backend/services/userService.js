/**
 * Простая хеш-функция (замените на bcrypt в production)
 * Детерминированная - одинаковый пароль = одинаковый хеш
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  deleteUser,
} from "../repositories/userRepository.js";

/**
 * Регистрация пользователя
 */
export async function registerUser({ username, email, phone, password }) {
  // Проверка: email уже занят?
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  // Проверка: username уже занят?
  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    throw new Error("USERNAME_ALREADY_EXISTS");
  }

  // Хешируем пароль (простая функция для dev)
  const hashedPassword = simpleHash(password);

  // Создаём пользователя
  const user = await createUser({
    username,
    email,
    phone,
    password: hashedPassword,
  });

  return user;
}

/**
 * Вход пользователя
 */
export async function loginUser({ username, password }) {
  // Ищем по username или email
  let user = await findUserByUsername(username);
  if (!user) {
    user = await findUserByEmail(username);
  }

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Проверяем пароль (простая проверка для dev)
  const testHash = simpleHash(password);
  if (testHash !== user.password) {
    throw new Error("INVALID_PASSWORD");
  }

  // Возвращаем пользователя без пароля
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Получить профиль пользователя
 */
export async function getUserProfile(id) {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
}

/**
 * Обновить профиль пользователя
 */
export async function updateProfile(id, data) {
  // Если меняется email — проверить уникальность
  if (data.email) {
    const existing = await findUserByEmail(data.email);
    if (existing && existing.id !== id) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
  }

  // Если меняется username — проверить уникальность
  if (data.username) {
    const existing = await findUserByUsername(data.username);
    if (existing && existing.id !== id) {
      throw new Error("USERNAME_ALREADY_EXISTS");
    }
  }

  // Если меняется пароль — хешировать
  if (data.password) {
    data.password = simpleHash(data.password);
  }

  return await updateUser(id, data);
}

/**
 * Удалить пользователя
 */
export async function removeUser(id) {
  const deleted = await deleteUser(id);
  if (!deleted) {
    throw new Error("USER_NOT_FOUND");
  }
  return true;
}
