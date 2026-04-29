/**
 * Роуты для игрового времени
 */
import { getUserBalance, addTime } from "../services/userTimeService.js";
import { authenticateAdmin } from "../middleware/auth.js";

export async function gameTimeRoutes(app) {
  // Получить баланс времени текущего пользователя
  app.get("/api/game-time/balance", {
    preHandler: async (request, reply) => {
      const userStr = request.headers["x-user"];
      if (!userStr) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
      try {
        request.user = JSON.parse(decodeURIComponent(userStr));
      } catch (err) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
    },
  }, async (request, reply) => {
    try {
      const balance = await getUserBalance(request.user.phone);
      return reply.status(200).send({ balance });
    } catch (err) {
      request.log.error("Get balance error:", err);
      return reply.status(500).send({ error: "INTERNAL_ERROR" });
    }
  });

  // Добавить время (только админ)
  app.post("/api/admin/game-time/add", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { phone, hall, hours } = request.body;
      
      if (!phone || !hall || hours === undefined) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Обязательные поля: phone, hall, hours",
        });
      }
      
      const result = await addTime(phone, hall, hours);
      return reply.status(200).send({ 
        message: "Время добавлено",
        balance: result 
      });
    } catch (err) {
      request.log.error("Add time error:", err);
      return reply.status(500).send({ error: "INTERNAL_ERROR" });
    }
  });
}

