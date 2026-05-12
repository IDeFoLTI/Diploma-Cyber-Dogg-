import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fs from "fs";
import "dotenv/config";
import { db } from "./db.js";
import { createUserTable } from "./models/User.js";
import { createUserTimeTable } from "./models/UserTime.js";
import { createCertificateOrdersTable } from "./models/CertificateOrder.js";
import { createMenuTables, createMenuItemsTable } from "./models/Menu.js";
import { createPriceZonesTable, createZonePricesTable } from "./models/PriceZone.js";
import { createProductsTable } from "./models/Product.js";
import { authRoutes, userRoutes } from "./routes/userRoutes.js";
import { reservationRoutes } from "./routes/reservationRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { gameTimeRoutes } from "./routes/gameTimeRoutes.js";
import { certificateRoutes } from "./routes/certificateRoutes.js";
import { menuRoutes } from "./routes/menuRoutes.js";
import { priceRoutes } from "./routes/priceRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";

const app = Fastify({ logger: true });

// Запуск сервера
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const start = async () => {
  try {
    console.log("🔄 Starting server...");
    
    // Подключаем CORS ДО роутов
    console.log("🔄 Registering CORS...");
    await app.register(cors, {
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true
    });
    console.log("✅ CORS registered");
    
    // Регистрируем загрузку файлов и статические ресурсы
    const uploadsPath = new URL('./uploads', import.meta.url);
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    const productsUploadsPath = new URL('./uploads/products', import.meta.url);
    if (!fs.existsSync(productsUploadsPath)) {
      fs.mkdirSync(productsUploadsPath, { recursive: true });
    }

    await app.register(multipart, {
      attachFieldsToBody: false,
      limits: {
        files: 3,
        fieldNameSize: 100,
        fileSize: 10 * 1024 * 1024
      }
    });

    await app.register(fastifyStatic, {
      root: uploadsPath,
      prefix: '/uploads/',
    });

    // Инициализация БД ПЕРЕД роутами
    console.log("🔄 Initializing database...");
    await db.query(createUserTable);
    console.log("✅ Users table initialized");
    await db.query(createUserTimeTable);
    console.log("✅ User game time table initialized");
    await db.query(createCertificateOrdersTable);
    console.log("✅ Certificate orders table initialized");
    await db.query(createMenuTables);
    console.log("✅ Menu categories table initialized");
    await db.query(createMenuItemsTable);
    console.log("✅ Menu items table initialized");
    await db.query(createPriceZonesTable);
    console.log("✅ Price zones table initialized");
    await db.query(createZonePricesTable);
    console.log("✅ Zone prices table initialized");
    await db.query(createProductsTable);
    console.log("✅ Products table initialized");
    console.log("✅ Database initialized");
    
    // Роуты
    app.get("/health", async (request, reply) => {
      try {
        const [rows] = await db.query("SELECT 1 AS ok");
        return { status: "ok", db: rows[0]?.ok === 1 };
      } catch (err) {
        console.error("DB error:", err);
        return { status: "error", db: false };
      }
    });

    app.get("/", async () => {
      return { message: "Cyber Dogg API" };
    });

    // Подключаем роуты пользователей
    console.log("🔄 Registering auth routes...");
    authRoutes(app);
    console.log("✅ Auth routes registered");
    
    console.log("🔄 Registering user routes...");
    userRoutes(app);
    console.log("✅ User routes registered");
    
    // Подключаем роуты бронирования
    console.log("🔄 Registering reservation routes...");
    reservationRoutes(app);
    console.log("✅ Reservation routes registered");
    
    // Подключаем админ роуты
    console.log("🔄 Registering admin routes...");
    adminRoutes(app);
    console.log("✅ Admin routes registered");
    
    // Подключаем роуты игрового времени
    console.log("🔄 Registering game time routes...");
    gameTimeRoutes(app);
    console.log("✅ Game time routes registered");
    
    // Подключаем роуты сертификатов
    console.log("🔄 Registering certificate routes...");
    certificateRoutes(app);
    console.log("✅ Certificate routes registered");
    
    // Подключаем роуты меню
    console.log("🔄 Registering menu routes...");
    menuRoutes(app);
    console.log("✅ Menu routes registered");
    
    // Подключаем роуты цен
    console.log("🔄 Registering price routes...");
    priceRoutes(app);
    console.log("✅ Price routes registered");
    
    // Подключаем роуты товаров
    console.log("🔄 Registering product routes...");
    productRoutes(app);
    console.log("✅ Product routes registered");
    
    // Запуск сервера
    console.log(`🔄 Starting server on http://${host}:${port}...`);
    await app.listen({ port, host });
    console.log(`🚀 Server running on http://${host}:${port}`);
  } catch (err) {
    console.error("❌ Startup error:", err);
    console.error("❌ Stack:", err.stack);
    process.exit(1);
  }
};

start();

