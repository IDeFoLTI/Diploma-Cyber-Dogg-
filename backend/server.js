import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { db } from "./db.js";
import { createUserTable } from "./models/User.js";
import { createUserTimeTable } from "./models/UserTime.js";
import { authRoutes, userRoutes } from "./routes/userRoutes.js";
import { reservationRoutes } from "./routes/reservationRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { gameTimeRoutes } from "./routes/gameTimeRoutes.js";

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
    
    // Инициализация БД
    console.log("🔄 Initializing database...");
    await db.query(createUserTable);
    await db.query(createUserTimeTable);
    console.log("✅ Database initialized");
    
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

