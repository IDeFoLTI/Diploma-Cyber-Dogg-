import { db } from "./db.js";

const [rows] = await db.execute("SELECT id, username, email FROM users");
console.log("Пользователи в БД:");
console.table(rows);

await db.end();
