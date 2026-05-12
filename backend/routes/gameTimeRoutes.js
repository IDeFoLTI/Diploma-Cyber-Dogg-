/**
 * Роуты для игрового времени
 */
import { getUserBalance } from "../services/userTimeService.js";

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

}

