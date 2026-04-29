import { sendReservationEmail } from "../services/emailService.js";

/**
 * Роуты для бронирования
 */
export async function reservationRoutes(app) {
  app.post("/api/reservation", async (request, reply) => {
    try {
      const { phone, datetime, hall, players } = request.body;

      if (!phone || !datetime || !hall || !players) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Все поля обязательны",
        });
      }

      // Отправляем письмо (или логируем в mock-режиме)
      const emailResult = await sendReservationEmail({ phone, datetime, hall, players });

      return reply.status(200).send({
        message: "Заявка отправлена",
        mock: emailResult.mock || false,
        previewUrl: emailResult.previewUrl || null,
      });
    } catch (err) {
      request.log.error("Reservation error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось отправить заявку. Попробуйте позже.",
      });
    }
  });
}
