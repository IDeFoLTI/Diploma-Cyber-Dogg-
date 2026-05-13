/**
 * Админ роуты
 */
import { authenticateAdmin } from "../middleware/auth.js";
import { createProduct, getAllProducts, updateProduct, deleteProduct } from "../models/Product.js";
import { db } from "../db.js";
import fs from "fs";

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

  // Добавить игровое время пользователю
  app.post("/api/admin/game-time/add", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { phone, hall, hours } = request.body;

      if (!phone || !hall || !hours || hours <= 0) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Необходимы: phone, hall, hours (>0)",
        });
      }

      // Проверить, существует ли пользователь с таким телефоном
      const [users] = await db.query(
        "SELECT id FROM users WHERE phone = ?",
        [phone]
      );
      
      if (users.length === 0) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Пользователь с таким телефоном не найден",
        });
      }

      // Преобразовать hall в соответствующее имя столбца в user_game_time
      let columnName;
      if (hall === 'common_room_day') {
        columnName = 'common_room_day';
      } else if (hall === 'common_room_night') {
        columnName = 'common_room_night';
      } else if (hall === 'battle_arena_day') {
        columnName = 'battle_arena_day';
      } else if (hall === 'battle_arena_night') {
        columnName = 'battle_arena_night';
      } else if (hall === 'vip_room_day') {
        columnName = 'vip_room_day';
      } else if (hall === 'vip_room_night') {
        columnName = 'vip_room_night';
      } else if (hall === 'playstation_under_5') {
        columnName = 'playstation_under_5';
      } else if (hall === 'playstation_under_7') {
        columnName = 'playstation_under_7';
      } else {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Неверный формат hall",
        });
      }

      // Проверить или создать запись в user_game_time для этого телефона
      const [existing] = await db.query(
        "SELECT id FROM user_game_time WHERE phone = ?",
        [phone]
      );

      if (existing.length === 0) {
        // Создать новую запись
        await db.query(
          "INSERT INTO user_game_time (phone) VALUES (?)",
          [phone]
        );
      }

      // Добавить часы к существующему значению
      await db.query(
        `UPDATE user_game_time SET ${columnName} = ${columnName} + ? WHERE phone = ?`,
        [hours, phone]
      );

      return reply.status(200).send({
        message: "Время добавлено",
        phone,
        hours,
        hall,
      });
    } catch (err) {
      request.log.error("Add game time error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось добавить время",
      });
    }
  });

  // Получить заказы сертификатов
  app.get("/api/admin/certificates/orders", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
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

  // Получить все товары для админа
  app.get("/api/admin/products", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const products = await getAllProducts();
      return reply.status(200).send({ success: true, data: products });
    } catch (err) {
      request.log.error("Admin get products error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить товары",
      });
    }
  });

  // Добавить товар с изображениями
  app.post("/api/admin/products", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const parts = request.parts();
      const data = {};
      const images = [];

      for await (const part of parts) {
        if (part.type === 'file') {
          if (images.length >= 3) {
            await part.toBuffer();
            continue;
          }

          const safeName = part.filename
            ? part.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
            : `image_${Date.now()}`;
          const filename = `${Date.now()}-${safeName}`;
          const targetPath = new URL(`../uploads/products/${filename}`, import.meta.url);
          const buffer = await part.toBuffer();
          fs.writeFileSync(targetPath, buffer);
          images.push(`/uploads/products/${filename}`);
        } else {
          data[part.fieldname] = part.value;
        }
      }

      const name = data.name?.trim();
      const description = data.description?.trim() || '';
      const price = parseFloat(data.price);
      const category = data.category?.trim();
      const category_name = data.category_name?.trim();

      let features = [];
      if (data.features) {
        const raw = data.features.trim();
        if (raw.startsWith('[')) {
          try { features = JSON.parse(raw); } catch { features = []; }
        } else {
          features = raw.split(',').map(item => item.trim()).filter(Boolean);
        }
      }

      if (!name || !category || !category_name || Number.isNaN(price)) {
        return reply.status(400).send({
          success: false,
          message: 'Поля name, price, category и category_name обязательны'
        });
      }

      const productId = await createProduct({
        name,
        description,
        price,
        category,
        category_name,
        images,
        features
      });

      return reply.status(201).send({ success: true, id: productId });
    } catch (err) {
      request.log.error("Admin create product error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось добавить товар: " + err.message,
      });
    }
  });

  // Редактировать товар с изображениями
  app.put("/api/admin/products/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const parts = request.parts();
      const data = {};
      const images = [];

      for await (const part of parts) {
        if (part.type === 'file') {
          if (images.length >= 3) {
            await part.toBuffer();
            continue;
          }

          const safeName = part.filename
            ? part.filename.replace(/[^a-zA-Z0-9._-]/g, '_')
            : `image_${Date.now()}`;
          const filename = `${Date.now()}-${safeName}`;
          const targetPath = new URL(`../uploads/products/${filename}`, import.meta.url);
          const buffer = await part.toBuffer();
          fs.writeFileSync(targetPath, buffer);
          images.push(`/uploads/products/${filename}`);
        } else {
          data[part.fieldname] = part.value;
        }
      }

      const name = data.name?.trim();
      const description = data.description?.trim() || '';
      const price = parseFloat(data.price);
      const category = data.category?.trim();
      const category_name = data.category_name?.trim();
      const status = data.status?.trim() || 'in_stock';

      let features = [];
      if (data.features) {
        const raw = data.features.trim();
        if (raw.startsWith('[')) {
          try { features = JSON.parse(raw); } catch { features = []; }
        } else {
          features = raw.split(',').map(item => item.trim()).filter(Boolean);
        }
      }

      if (!name || !category || !category_name || Number.isNaN(price)) {
        return reply.status(400).send({
          success: false,
          message: 'Поля name, price, category и category_name обязательны'
        });
      }

      await updateProduct(id, {
        name,
        description,
        price,
        category,
        category_name,
        status,
        images: images.length > 0 ? images : undefined,
        features
      });

      return reply.status(200).send({ success: true });
    } catch (err) {
      request.log.error("Admin update product error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось обновить товар: " + err.message,
      });
    }
  });

  // Удалить товар
  app.delete("/api/admin/products/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      await deleteProduct(id);
      return reply.status(200).send({ success: true });
    } catch (err) {
      request.log.error("Admin delete product error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить товар",
      });
    }
  });
}

