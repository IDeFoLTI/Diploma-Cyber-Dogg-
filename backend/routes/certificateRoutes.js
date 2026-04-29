/**
 * Роуты для сертификатов
 */
import { generateUniquePromoCode } from "../utils/promoCodeGenerator.js";

export async function certificateRoutes(app) {
  // Создать заказ на сертификат
  app.post("/api/certificates/order", async (request, reply) => {
    try {
      const {
        hall,
        timeType,
        hours,
        package: packageType,
        phone,
        price
      } = request.body;

      // Валидация
      if (!hall || !phone || !price) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Обязательные поля: hall, phone, price",
        });
      }

      const { db } = await import("../db.js");

      // Генерировать уникальный промокод
      const promoCode = await generateUniquePromoCode(db);

      // Создать запись заказа
      const [result] = await db.query(
        `INSERT INTO certificate_orders 
         (hall, time_type, hours, package_type, phone, promo_code, price, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          hall,
          timeType || null,
          hours || null,
          packageType || null,
          phone,
          promoCode,
          price
        ]
      );

      return reply.status(201).send({
        message: "Заказ создан успешно",
        orderId: result.insertId,
        promoCode: promoCode,
      });
    } catch (err) {
      request.log.error("Create certificate order error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось создать заказ",
      });
    }
  });

  // Получить все заказы (админка)
  app.get("/api/certificates/orders", {
    preHandler: async (request, reply) => {
      const userStr = request.headers["x-user"];
      if (!userStr) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        if (user.role !== "admin") {
          return reply.status(403).send({ error: "FORBIDDEN" });
        }
        request.user = user;
      } catch (err) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
    },
  }, async (request, reply) => {
    try {
      const { db } = await import("../db.js");
      const [orders] = await db.query(
        "SELECT * FROM certificate_orders ORDER BY created_at DESC"
      );
      return reply.status(200).send({ orders });
    } catch (err) {
      request.log.error("Get certificate orders error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить заказы",
      });
    }
  });

  // Обновить статус сертификата (админка)
  app.patch("/api/admin/certificates/:id/status", {
    preHandler: async (request, reply) => {
      const userStr = request.headers["x-user"];
      if (!userStr) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        if (user.role !== "admin") {
          return reply.status(403).send({ error: "FORBIDDEN" });
        }
        request.user = user;
      } catch (err) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
    },
  }, async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const { status } = request.body;

      const validStatuses = ['pending', 'paid', 'used', 'cancelled'];
      if (!status || !validStatuses.includes(status)) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Невалидный статус. Допустимые: pending, paid, used, cancelled",
        });
      }

      const { db } = await import("../db.js");

      // Проверить существование заказа
      const [existing] = await db.query(
        "SELECT id FROM certificate_orders WHERE id = ?",
        [id]
      );

      if (existing.length === 0) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Заказ не найден",
        });
      }

      // Обновить статус
      await db.query(
        "UPDATE certificate_orders SET status = ? WHERE id = ?",
        [status, id]
      );

      return reply.status(200).send({
        message: "Статус обновлён",
        status,
      });
    } catch (err) {
      request.log.error("Update certificate status error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось обновить статус",
      });
    }
  });

  // Активировать промокод (админка)
  app.post("/api/admin/certificates/activate", {
    preHandler: async (request, reply) => {
      const userStr = request.headers["x-user"];
      if (!userStr) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        if (user.role !== "admin") {
          return reply.status(403).send({ error: "FORBIDDEN" });
        }
        request.user = user;
      } catch (err) {
        return reply.status(401).send({ error: "UNAUTHORIZED" });
      }
    },
  }, async (request, reply) => {
    try {
      const { promoCode, phone } = request.body;

      if (!promoCode || !phone) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Обязательные поля: promoCode, phone",
        });
      }

      const { db } = await import("../db.js");

      // Найти заказ по промокоду
      const [orders] = await db.query(
        "SELECT * FROM certificate_orders WHERE promo_code = ?",
        [promoCode]
      );

      if (orders.length === 0) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Промокод не найден",
        });
      }

      const order = orders[0];

      // Проверить статус
      if (order.status === 'used') {
        return reply.status(400).send({
          error: "ALREADY_USED",
          message: "Промокод уже использован",
        });
      }

      if (order.status === 'cancelled') {
        return reply.status(400).send({
          error: "CANCELLED",
          message: "Промокод отменён",
        });
      }

      if (order.status !== 'paid') {
        return reply.status(400).send({
          error: "NOT_PAID",
          message: "Сертификат ещё не оплачен",
        });
      }

      // Проверить, существует ли пользователь с таким телефоном
      const [users] = await db.query(
        "SELECT id, username, phone FROM users WHERE phone = ?",
        [phone]
      );

      if (users.length === 0) {
        return reply.status(404).send({
          error: "USER_NOT_FOUND",
          message: `Пользователь с телефоном ${phone} не найден`,
        });
      }

      const user = users[0];

      // Определить hall для добавления времени
      let hall = null;
      let hours = 0;

      // Логика определения зала и времени
      if (order.hall === 'standart') {
        hall = order.time_type === 'night' ? 'common_room_night' : 'common_room_day';
      } else if (order.hall === 'battle') {
        hall = order.time_type === 'night' ? 'battle_arena_night' : 'battle_arena_day';
      } else if (order.hall === 'vip') {
        hall = order.time_type === 'night' ? 'vip_room_night' : 'vip_room_day';
      } else if (order.hall === 'playstation') {
        hall = order.package_type === 'cyberday' ? 'playstation_under_5' : 'playstation_under_7';
      }

      // Определить количество часов
      if (order.hours === '3hours') {
        hours = 3;
      } else if (order.hours === '5hours') {
        hours = 5;
      } else if (order.package_type === 'cyberday') {
        hours = 24; // Кибер сутки = 24 часа
      } else if (order.package_type === 'night') {
        hours = 8; // Ночь = 8 часов
      }

      // Добавить время пользователю
      const { addTimeToUser } = await import("../models/UserTime.js");
      const result = await addTimeToUser(db, phone, hall, hours);

      // Обновить статус заказа
      await db.query(
        "UPDATE certificate_orders SET status = 'used' WHERE id = ?",
        [order.id]
      );

      return reply.status(200).send({
        message: "Промокод активирован успешно",
        promoCode,
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone
        },
        addedTime: {
          hall: hall,
          hours: hours
        },
        balance: result
      });
    } catch (err) {
      request.log.error("Activate certificate error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось активировать промокод",
      });
    }
  });
}