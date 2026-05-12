/**
 * Роуты для управления меню
 */
import { authenticateAdmin } from "../middleware/auth.js";

export async function menuRoutes(app) {
  // Получить все категории меню (публичный доступ)
  app.get("/api/menu/categories", async (request, reply) => {
    try {
      const { db } = await import("../db.js");
      const [categories] = await db.query(
        "SELECT id, name, sort_order FROM menu_categories ORDER BY sort_order, id"
      );
      
      // Получить все товары для каждой категории
      const categoriesWithItems = [];
      for (const category of categories) {
        const [items] = await db.query(
          "SELECT id, name, description, weight, price, popular, vegetarian FROM menu_items WHERE category_id = ? ORDER BY sort_order, id",
          [category.id]
        );
        categoriesWithItems.push({
          id: `cat_${category.id}`,
          name: category.name,
          items
        });
      }
      
      return reply.status(200).send({ categories: categoriesWithItems });
    } catch (err) {
      request.log.error("Get menu categories error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить меню",
      });
    }
  });

  // Получить одну категорию меню (публичный доступ)
  app.get("/api/menu/categories/:id", async (request, reply) => {
    try {
      const { db } = await import("../db.js");
      const categoryId = request.params.id.replace('cat_', '');
      
      const [categories] = await db.query(
        "SELECT id, name FROM menu_categories WHERE id = ?",
        [categoryId]
      );
      
      if (categories.length === 0) {
        return reply.status(404).send({
          error: "NOT_FOUND",
          message: "Категория не найдена",
        });
      }
      
      const [items] = await db.query(
        "SELECT id, name, description, weight, price, popular, vegetarian FROM menu_items WHERE category_id = ? ORDER BY sort_order, id",
        [categoryId]
      );
      
      return reply.status(200).send({
        id: `cat_${categoryId}`,
        name: categories[0].name,
        items
      });
    } catch (err) {
      request.log.error("Get category error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить категорию",
      });
    }
  });

  // ================= ADMIN ROUTES =================
  
  // Получить все категории (админ)
  app.get("/api/admin/menu/categories", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { db } = await import("../db.js");
      const [categories] = await db.query(
        "SELECT * FROM menu_categories ORDER BY sort_order, id"
      );
      return reply.status(200).send({ categories });
    } catch (err) {
      request.log.error("Admin get categories error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить категории",
      });
    }
  });

  // Добавить категорию (админ)
  app.post("/api/admin/menu/categories", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { name, sortOrder } = request.body;
      
      if (!name) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Необходимо указать название категории",
        });
      }
      
      const { db } = await import("../db.js");
      const [result] = await db.query(
        "INSERT INTO menu_categories (name, sort_order) VALUES (?, ?)",
        [name, sortOrder || 0]
      );

      return reply.status(201).send({
        message: "Категория добавлена",
        categoryId: result.insertId,
      });
    } catch (err) {
      request.log.error("Add category error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось добавить категорию",
      });
    }
  });

  // Обновить категорию (админ)
  app.put("/api/admin/menu/categories/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { name, sortOrder } = request.body;
      
      const { db } = await import("../db.js");
      await db.query(
        "UPDATE menu_categories SET name = ?, sort_order = ? WHERE id = ?",
        [name, sortOrder, id]
      );

      return reply.status(200).send({ message: "Категория обновлена" });
    } catch (err) {
      request.log.error("Update category error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось обновить категорию",
      });
    }
  });

  // Удалить категорию (админ)
  app.delete("/api/admin/menu/categories/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { db } = await import("../db.js");
      
      // Сначала удалить все товары категории
      await db.query("DELETE FROM menu_items WHERE category_id = ?", [id]);
      // Затем удалить категорию
      await db.query("DELETE FROM menu_categories WHERE id = ?", [id]);

      return reply.status(200).send({ message: "Категория удалена" });
    } catch (err) {
      request.log.error("Delete category error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить категорию",
      });
    }
  });

  // Получить товары категории (админ)
  app.get("/api/admin/menu/categories/:id/items", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { db } = await import("../db.js");
      const [items] = await db.query(
        "SELECT * FROM menu_items WHERE category_id = ? ORDER BY sort_order, id",
        [id]
      );
      return reply.status(200).send({ items });
    } catch (err) {
      request.log.error("Get items error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось получить товары",
      });
    }
  });

  // Добавить товар (админ)
  app.post("/api/admin/menu/items", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { categoryId, name, description, weight, price, popular, vegetarian, sortOrder } = request.body;
      
      if (!categoryId || !name || !price) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "Необходимо указать categoryId, name и price",
        });
      }
      
      const { db } = await import("../db.js");
      const [result] = await db.query(
        "INSERT INTO menu_items (category_id, name, description, weight, price, popular, vegetarian, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [categoryId, name, description || '', weight || '', price, popular || false, vegetarian || false, sortOrder || 0]
      );

      return reply.status(201).send({
        message: "Товар добавлен",
        itemId: result.insertId,
      });
    } catch (err) {
      request.log.error("Add item error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось добавить товар",
      });
    }
  });

  // Обновить товар (админ)
  app.put("/api/admin/menu/items/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { categoryId, name, description, weight, price, popular, vegetarian, sortOrder } = request.body;
      
      const { db } = await import("../db.js");
      await db.query(
        "UPDATE menu_items SET category_id = ?, name = ?, description = ?, weight = ?, price = ?, popular = ?, vegetarian = ?, sort_order = ? WHERE id = ?",
        [categoryId, name, description, weight, price, popular, vegetarian, sortOrder, id]
      );

      return reply.status(200).send({ message: "Товар обновлен" });
    } catch (err) {
      request.log.error("Update item error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось обновить товар",
      });
    }
  });

  // Удалить товар (админ)
  app.delete("/api/admin/menu/items/:id", {
    preHandler: authenticateAdmin,
  }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { db } = await import("../db.js");
      await db.query("DELETE FROM menu_items WHERE id = ?", [id]);

      return reply.status(200).send({ message: "Товар удален" });
    } catch (err) {
      request.log.error("Delete item error:", err);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Не удалось удалить товар",
      });
    }
  });
}
