import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../repositories/userRepository.js";

const SALT_ROUNDS = 10;

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

  // Хешируем пароль с помощью bcrypt
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Проверяем, есть ли уже пользователи в системе
  const allUsers = await getAllUsers();
  const isFirstUser = allUsers.length === 0;
  const role = isFirstUser ? "admin" : "user";

  // Создаём пользователя
  const user = await createUser({
    username,
    email,
    phone,
    password: hashedPassword,
    role,
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

  // Проверяем пароль с помощью bcrypt
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
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

  // Если меняется пароль — хешировать с bcrypt
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
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
