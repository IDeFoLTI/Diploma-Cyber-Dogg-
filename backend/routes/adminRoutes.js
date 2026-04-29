/**
 * Админ роуты
 */
import { authenticateAdmin } from "../middleware/auth.js";

export async function adminRoutes(app) {
  // Получить все бронирования
  app.get("/api/admin/reservations", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const reservations = await app.reservations;
      return reply.status(200).send({ reservations });
    } catch (err) {
      request.log.error("Admin reservations error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить бронирования",
      });
    }
  });

  // Удалить бронирование
  app.delete("/api/admin/reservations/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const reservations = await app.reservations;
      const index = reservations.findIndex(r => r.id === id);
      
      if (index === -1) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Бронирование не найдено",
        });
      }

      reservations.splice(index, 1);
      
      // Сохранить обратно в файл
      const fs = await import("fs");
      fs.writeFileSync(
        new URL("../reservations.json", import.meta.url),
        JSON.stringify(reservations, null, 2)
      );

      return reply.status(200).send({ message: "Бронирование удалено" });
    } catch (err) {
      request.log.error("Admin delete reservation error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить бронирование",
      });
    }
  });

  // Получить всех пользователей
  app.get("/api/admin/users", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { db } = await import("../db.js");
      const [users] = await db.query(
        "SELECT id, username, email, phone, role, created_at FROM users ORDER BY created_at DESC"
      );
      return reply.status(200).send({ users });
    } catch (err) {
      request.log.error("Admin users error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить пользователей",
      });
    }
  });

  // Добавить пользователя
  app.post("/api/admin/users", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { username, email, phone, password, role } = request.body;
      
      if (!username || !email || !password) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Обязательные поля: username, email, password",
        });
      }

      const { db } = await import("../db.js");
      
      // Проверить, существует ли пользователь
      const [existing] = await db.query(
        "SELECT id FROM users WHERE email = ? OR phone = ?",
        [email, phone || null]
      );
      
      if (existing.length > 0) {
        return reply.status(409).send({
          error: "CONFLICT",
          message: "Пользователь с таким email или телефоном уже существует",
        });
      }

      // Хэшировать пароль
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Вставить пользователя
      const [result] = await db.query(
        "INSERT INTO users (username, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        [username, email, phone || null, hashedPassword, role || 'user']
      );

      return reply.status(201).send({
        message: "Пользователь добавлен",
        userId: result.insertId,
      });
    } catch (err) {
      request.log.error("Add user error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось добавить пользователя",
      });
    }
  });

  // Удалить пользователя
  app.delete("/api/admin/users/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const { db } = await import("../db.js");
      
      // Проверить, существует ли пользователь
      const [existing] = await db.query("SELECT id FROM users WHERE id = ?", [id]);
      
      if (existing.length === 0) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Пользователь не найден",
        });
      }

      // Не позволять удалить самого себя
      const userStr = request.headers["x-user"];
      if (userStr) {
        const currentUser = JSON.parse(decodeURIComponent(userStr));
        if (currentUser.id === id) {
          return reply.status(400).send({
            error: "BAD_REQUEST",
            message: "Нельзя удалить самого себя",
          });
        }
      }

      await db.query("DELETE FROM users WHERE id = ?", [id]);

      return reply.status(200).send({ message: "Пользователь удален" });
    } catch (err) {
      request.log.error("Delete user error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить пользователя",
      });
    }
  });
}

