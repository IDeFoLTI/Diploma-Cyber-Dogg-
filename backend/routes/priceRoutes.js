/**
 * Роуты для управления ценами на залы
 */
import { authenticateAdmin } from "../middleware/auth.js";

export async function priceRoutes(app) {
  // ================= PUBLIC ROUTES =================
  
  // Получить все цены для отображения на странице
  app.get("/api/prices", async (request, reply) => {
    try {
      const { db } = await import("../db.js");
      const [prices] = await db.query(
        `SELECT zp.*, pz.name as zone_name, pz.computer_count, pz.zone_type 
         FROM zone_prices zp 
         JOIN price_zones pz ON zp.zone_id = pz.id 
         ORDER BY pz.sort_order, pz.id, zp.period, zp.duration`
      );
      
      // Группировать цены по зонам
      const zones = {};
      for (const price of prices) {
        if (!zones[price.zone_id]) {
          zones[price.zone_id] = {
            id: `zone_${price.zone_id}`,
            name: price.zone_name,
            computer_count: price.computer_count,
            zone_type: price.zone_type,
            prices: []
          };
        }
        zones[price.zone_id].prices.push({
          id: price.id,
          period: price.period,
          duration: price.duration,
          price: parseFloat(price.price),
          time_range: price.time_range
        });
      }
      
      return reply.status(200).send({ zones: Object.values(zones) });
    } catch (err) {
      request.log.error("Get prices error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось загрузить цены",
      });
    }
  });

  // ================= ADMIN ROUTES =================
  
  // Получить все зоны (админ)
  app.get("/api/admin/prices/zones", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { db } = await import("../db.js");
      const [zones] = await db.query("SELECT * FROM price_zones ORDER BY sort_order, id");
      return reply.status(200).send({ zones });
    } catch (err) {
      request.log.error("Admin get zones error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить зоны",
      });
    }
  });

  // Добавить зону (админ)
  app.post("/api/admin/prices/zones", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { name, computerCount, zoneType, sortOrder } = request.body;
      
      if (!name) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Необходимо указать название зоны",
        });
      }
      
      const { db } = await import("../db.js");
      const [result] = await db.query(
        "INSERT INTO price_zones (name, computer_count, zone_type, sort_order) VALUES (?, ?, ?, ?)",
        [name, computerCount || null, zoneType || 'gaming', sortOrder || 0]
      );

      return reply.status(201).send({
        message: "Зона добавлена",
        zoneId: result.insertId,
      });
    } catch (err) {
      request.log.error("Add zone error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось добавить зону",
      });
    }
  });

  // Обновить зону (админ)
  app.put("/api/admin/prices/zones/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, computerCount, zoneType, sortOrder } = request.body;
      
      const { db } = await import("../db.js");
      await db.query(
        "UPDATE price_zones SET name = ?, computer_count = ?, zone_type = ?, sort_order = ? WHERE id = ?",
        [name, computerCount, zoneType, sortOrder, id]
      );

      return reply.status(200).send({ message: "Зона обновлена" });
    } catch (err) {
      request.log.error("Update zone error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось обновить зону",
      });
    }
  });

  // Удалить зону (админ)
  app.delete("/api/admin/prices/zones/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { db } = await import("../db.js");
      
      // Удаление каскадное благодаря FOREIGN KEY ... ON DELETE CASCADE
      await db.query("DELETE FROM price_zones WHERE id = ?", [id]);

      return reply.status(200).send({ message: "Зона удалена" });
    } catch (err) {
      request.log.error("Delete zone error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить зону",
      });
    }
  });

  // Получить цены зоны (админ)
  app.get("/api/admin/prices/zones/:id/prices", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { db } = await import("../db.js");
      const [prices] = await db.query(
        "SELECT * FROM zone_prices WHERE zone_id = ? ORDER BY period, duration",
        [id]
      );
      return reply.status(200).send({ prices });
    } catch (err) {
      request.log.error("Get prices error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить цены",
      });
    }
  });

  // Добавить цену (админ)
  app.post("/api/admin/prices", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { zoneId, period, duration, price, timeRange } = request.body;
      
      if (!zoneId || !period || !duration || !price) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Необходимо указать zoneId, period, duration и price",
        });
      }
      
      const { db } = await import("../db.js");
      const [result] = await db.query(
        "INSERT INTO zone_prices (zone_id, period, duration, price, time_range) VALUES (?, ?, ?, ?, ?)",
        [zoneId, period, duration, price, timeRange || null]
      );

      return reply.status(201).send({
        message: "Цена добавлена",
        priceId: result.insertId,
      });
    } catch (err) {
      request.log.error("Add price error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось добавить цену",
      });
    }
  });

  // Обновить цену (админ)
  app.put("/api/admin/prices/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { price } = request.body;
      
      const { db } = await import("../db.js");
      await db.query(
        "UPDATE zone_prices SET price = ? WHERE id = ?",
        [price, id]
      );

      return reply.status(200).send({ message: "Цена обновлена" });
    } catch (err) {
      request.log.error("Update price error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось обновить цену",
      });
    }
  });

  // Удалить цену (админ)
  app.delete("/api/admin/prices/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { db } = await import("../db.js");
      await db.query("DELETE FROM zone_prices WHERE id = ?", [id]);

      return reply.status(200).send({ message: "Цена удалена" });
    } catch (err) {
      request.log.error("Delete price error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить цену",
      });
    }
  });
}
