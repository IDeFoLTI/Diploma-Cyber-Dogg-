import {
  sendResetCode,
  verifyResetCode,
  resetPassword,
  resendResetCode
} from "../services/passwordResetService.js";

/**
 * POST /api/auth/send-reset-code
 * Отправить код восстановления на email
 */
export async function sendResetCodeHandler(request, reply) {
  try {
    const { email } = request.body;

    if (!email) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Обязательное поле: email",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Введите корректный email",
      });
    }

    await sendResetCode(email);
    return reply.status(200).send({
      message: "Код восстановления отправлен на email"
    });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message: "Пользователь с таким email не найден",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}

/**
 * POST /api/auth/verify-reset-code
 * Проверить код восстановления
 */
export async function verifyResetCodeHandler(request, reply) {
  try {
    const { email, code } = request.body;

    if (!email || !code) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Обязательные поля: email, code",
      });
    }

    const isValid = await verifyResetCode(email, code);
    return reply.status(200).send({
      message: "Код подтверждён",
      valid: isValid
    });
  } catch (err) {
    if (err.message === "CODE_NOT_FOUND") {
      return reply.status(404).send({
        error: "CODE_NOT_FOUND",
        message: "Код не найден. Запросите новый код",
      });
    }
    if (err.message === "INVALID_CODE") {
      return reply.status(400).send({
        error: "INVALID_CODE",
        message: "Неверный код",
      });
    }
    if (err.message === "CODE_EXPIRED") {
      return reply.status(400).send({
        error: "CODE_EXPIRED",
        message: "Код истёк. Запросите новый код",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}

/**
 * POST /api/auth/resend-reset-code
 * Повторно отправить код восстановления
 */
export async function resendResetCodeHandler(request, reply) {
  try {
    const { email } = request.body;

    if (!email) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Обязательное поле: email",
      });
    }

    await resendResetCode(email);
    return reply.status(200).send({
      message: "Код восстановления повторно отправлен на email"
    });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message: "Пользователь с таким email не найден",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}

/**
 * POST /api/auth/reset-password
 * Сбросить пароль с помощью кода
 */
export async function resetPasswordHandler(request, reply) {
  try {
    const { email, code, newPassword } = request.body;

    if (!email || !code || !newPassword) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Обязательные поля: email, code, newPassword",
      });
    }

    if (newPassword.length < 6) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: "Пароль должен быть не менее 6 символов",
      });
    }

    await resetPassword(email, code, newPassword);
    return reply.status(200).send({
      message: "Пароль успешно изменён"
    });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return reply.status(404).send({
        error: "USER_NOT_FOUND",
        message: "Пользователь с таким email не найден",
      });
    }
    if (err.message === "CODE_NOT_FOUND") {
      return reply.status(404).send({
        error: "CODE_NOT_FOUND",
        message: "Код не найден. Запросите новый код",
      });
    }
    if (err.message === "INVALID_CODE") {
      return reply.status(400).send({
        error: "INVALID_CODE",
        message: "Неверный код",
      });
    }
    if (err.message === "CODE_EXPIRED") {
      return reply.status(400).send({
        error: "CODE_EXPIRED",
        message: "Код истёк. Запросите новый код",
      });
    }
    request.log.error(err);
    return reply.status(500).send({ error: "INTERNAL_ERROR" });
  }
}
