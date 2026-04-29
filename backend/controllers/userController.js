import { registerUser, loginUser, getUserProfile, updateProfile, removeUser } from "../services/userService.js";

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 */
export async function registerHandler(request, reply) {
  try {
    const { username, email, phone, password } = request.body;

    if (!username || !email || !password) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Обязательные поля: username, email, password",
      });
    }

    if (password.length < 6) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Пароль должен быть не менее 6 символов",
      });
    }

    const user = await registerUser({ username, email, phone, password });
    return reply.status(201).send({ user });
  } catch (err) {
    if (err.message === "EMAIL_ALREADY_EXISTS") {
      return reply.status(409).send({
        error: "EMAIL_ALREADY_EXISTS",
        message: "Пользователь с таким email уже существует",
      });
    }
    if (err.message === "USERNAME_ALREADY_EXISTS") {
      return reply.status(409).send({
        error: "USERNAME_ALREADY_EXISTS",
        message: "Пользователь с таким логином уже существует",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}

/**
 * POST /api/auth/login
 * Вход пользователя
 */
export async function loginHandler(request, reply) {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Обязательные поля: username, password",
      });
    }

    const user = await loginUser({ username, password });
    return reply.status(200).send({ user });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND" || err.message === "INVALID_PASSWORD") {
      return reply.status(401).send({
        error: "INVALID_CREDENTIALS",
        message: "Неверный логин или пароль",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}

/**
 * GET /api/users/:id
 * Получить профиль пользователя
 */
export async function getUserHandler(request, reply) {
  try {
    const user = await getUserProfile(request.params.id);
    return reply.status(200).send({ user });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message: "Пользователь не найден",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}

/**
 * PUT /api/users/:id
 * Обновить профиль пользователя
 */
export async function updateUserHandler(request, reply) {
  try {
    const user = await updateProfile(request.params.id, request.body);
    return reply.status(200).send({ user });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message: "Пользователь не найден",
      });
    }
    if (err.message === "EMAIL_ALREADY_EXISTS") {
      return reply.status(409).send({
        error: "EMAIL_ALREADY_EXISTS",
        message: "Пользователь с таким email уже существует",
      });
    }
    if (err.message === "USERNAME_ALREADY_EXISTS") {
      return reply.status(409).send({
        error: "USERNAME_ALREADY_EXISTS",
        message: "Пользователь с таким логином уже существует",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}

/**
 * DELETE /api/users/:id
 * Удалить пользователя
 */
export async function deleteUserHandler(request, reply) {
  try {
    await removeUser(request.params.id);
    return reply.status(200).send({ message: "Пользователь удалён" });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message: "Пользователь не найден",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}
