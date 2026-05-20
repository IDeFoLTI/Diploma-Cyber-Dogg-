import { authenticateAdmin, authenticateUser } from "../middleware/auth.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByPhone,
  updateOrderStatus,
  deleteOrder
} from "../models/Order.js";

export async function orderRoutes(app) {
  // Создать заказ (требуется авторизация)
  app.post("/api/orders", {
    preHandler: authenticateUser,
  }, async (request, reply) => {
    try {
      const { phone, items, total_price } = request.body;

      if (!phone || !items || !Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Обязательные поля: phone, items",
        });
      }

      const orderId = await createOrder({
        phone,
        total_price: total_price || 0,
        items
      });

      return reply.status(201).send({
        message: "Заказ создан успешно",
        orderId,
      });
    } catch (err) {
      request.log.error("Create order error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось создать заказ",
      });
    }
  });

  // Получить мои заказы (по телефону из авторизации)
  app.get("/api/orders/my", async (request, reply) => {
    try {
      const userStr = request.headers["x-user"];
      if (!userStr) {
        return reply.status(401).send({
          error: "UNAUTHORIZED",
          message: "Требуется авторизация",
        });
      }

      const user = JSON.parse(decodeURIComponent(userStr));
      if (!user.phone) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "У пользователя не указан телефон",
        });
      }

      const orders = await getOrdersByPhone(user.phone);
      return reply.status(200).send({ orders });
    } catch (err) {
      request.log.error("Get my orders error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить заказы",
      });
    }
  });

  // Получить все заказы (админка)
  app.get("/api/admin/orders", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const orders = await getAllOrders();
      return reply.status(200).send({ orders });
    } catch (err) {
      request.log.error("Get orders error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить заказы",
      });
    }
  });

  // Получить заказ по ID (админка)
  app.get("/api/admin/orders/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const order = await getOrderById(id);

      if (!order) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Заказ не найден",
        });
      }

      return reply.status(200).send({ order });
    } catch (err) {
      request.log.error("Get order error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить заказ",
      });
    }
  });

  // Обновить статус заказа (админка)
  app.patch("/api/admin/orders/:id/status", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const { status } = request.body;

      const validStatuses = ['pending', 'paid', 'ready', 'completed', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Невалидный статус. Допустимые: pending, paid, ready, completed, cancelled",
        });
      }

      const order = await getOrderById(id);
      if (!order) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Заказ не найден",
        });
      }

      await updateOrderStatus(id, status);

      return reply.status(200).send({
        message: "Статус обновлён",
        status,
      });
    } catch (err) {
      request.log.error("Update order status error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось обновить статус",
      });
    }
  });

  // Удалить заказ (админка)
  app.delete("/api/admin/orders/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      await deleteOrder(id);
      return reply.status(200).send({ message: "Заказ удалён" });
    } catch (err) {
      request.log.error("Delete order error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить заказ",
      });
    }
  });
}
