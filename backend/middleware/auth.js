/**
 * Middleware для проверки админа
 */
export async function authenticateAdmin(request, reply) {
  const userStr = request.headers["x-user"];
  if (!userStr) {
    return reply.status(401).send({
      error: "UNAUTHORIZED",
      message: "Требуется авторизация",
    });
  }

  try {
    const user = JSON.parse(decodeURIComponent(userStr));
    if (user.role !== "admin") {
      return reply.status(403).send({
        error: "FORBIDDEN",
        message: "Доступ запрещён. Требуется роль администратора",
      });
    }
    request.user = user;
  } catch (err) {
    return reply.status(401).send({
      error: "UNAUTHORIZED",
      message: "Неверный формат токена",
    });
  }
}
