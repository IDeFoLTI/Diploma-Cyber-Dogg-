import {
  sendResetCodeHandler,
  verifyResetCodeHandler,
  resendResetCodeHandler,
  resetPasswordHandler
} from "../controllers/passwordResetController.js";

/**
 * Маршруты для сброса пароля
 */
export async function passwordResetRoutes(fastify) {
  // Отправить код восстановления
  fastify.post(
    "/api/auth/send-reset-code",
    {
      schema: {
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" }
          }
        }
      }
    },
    sendResetCodeHandler
  );

  // Проверить код восстановления
  fastify.post(
    "/api/auth/verify-reset-code",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "code"],
          properties: {
            email: { type: "string", format: "email" },
            code: { type: "string", minLength: 4, maxLength: 10 }
          }
        }
      }
    },
    verifyResetCodeHandler
  );

  // Повторно отправить код
  fastify.post(
    "/api/auth/resend-reset-code",
    {
      schema: {
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" }
          }
        }
      }
    },
    resendResetCodeHandler
  );

  // Сбросить пароль
  fastify.post(
    "/api/auth/reset-password",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "code", "newPassword"],
          properties: {
            email: { type: "string", format: "email" },
            code: { type: "string", minLength: 4, maxLength: 10 },
            newPassword: { type: "string", minLength: 6 }
          }
        }
      }
    },
    resetPasswordHandler
  );
}

export default passwordResetRoutes;
