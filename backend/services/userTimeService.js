import {
  getUserTimeBalance,
  addTimeToUser as addTimeRepo,
} from "../models/UserTime.js";

/**
 * Получить баланс времени пользователя по телефону
 */
export async function getUserBalance(phone) {
  const { db } = await import("../db.js");
  const balance = await getUserTimeBalance(db, phone);
  
  if (!balance) {
    return {
      common_room_day: 0,
      common_room_night: 0,
      battle_arena_day: 0,
      battle_arena_night: 0,
      vip_room_day: 0,
      vip_room_night: 0,
      playstation_under_5: 0,
      playstation_under_7: 0,
    };
  }
  
  return {
    common_room_day: parseFloat(balance.common_room_day),
    common_room_night: parseFloat(balance.common_room_night),
    battle_arena_day: parseFloat(balance.battle_arena_day),
    battle_arena_night: parseFloat(balance.battle_arena_night),
    vip_room_day: parseFloat(balance.vip_room_day),
    vip_room_night: parseFloat(balance.vip_room_night),
    playstation_under_5: parseFloat(balance.playstation_under_5),
    playstation_under_7: parseFloat(balance.playstation_under_7),
  };
}

/**
 * Добавить время пользователю (админка)
 */
export async function addTime(phone, hall, hours) {
  try {
    const { db } = await import("../db.js");
    console.log("Adding time:", { phone, hall, hours });
    const result = await addTimeRepo(db, phone, hall, hours);
    console.log("Time added successfully:", result);
    return result;
  } catch (err) {
    console.error("Add time service error:", err);
    throw err;
  }
}

