import {
  registerHandler,
  loginHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../controllers/userController.js";

/**
 * Роуты для аутентификации
 */
export async function authRoutes(app) {
  app.post("/api/auth/register", registerHandler);
  app.post("/api/auth/login", loginHandler);
}

/**
 * Роуты для пользователей
 */
export async function userRoutes(app) {
  app.get("/api/users/:id", getUserHandler);
  app.put("/api/users/:id", updateUserHandler);
  app.delete("/api/users/:id", deleteUserHandler);
}
