import fs from "fs";
import path from "path";

const TO_EMAIL = process.env.TO_EMAIL || "broken.halo000000@gmail.com";
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "";

const RESERVATIONS_FILE = path.resolve(process.cwd(), "reservations.json");

/**
 * Сохранить заявку в файл
 */
function saveReservationToFile(data) {
  try {
    let reservations = [];
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const content = fs.readFileSync(RESERVATIONS_FILE, "utf8");
      reservations = JSON.parse(content);
    }
    reservations.push({
      ...data,
      createdAt: new Date().toISOString(),
    });
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
    console.log("✅ Reservation saved to file:", RESERVATIONS_FILE);
  } catch (err) {
    console.error("❌ Failed to save reservation:", err.message);
  }
}

/**
 * Отправить письмо через EmailJS API
 */
export async function sendReservationEmail({ phone, datetime, hall, players }) {
  const hallNames = {
    "hall-1": "Зал 1",
    "hall-2": "Зал 2",
    "hall-3": "Зал 3",
  };

  const reservationData = {
    phone,
    datetime,
    hall: hallNames[hall] || hall,
    players,
  };

  // Всегда сохраняем в файл
  saveReservationToFile(reservationData);

  // Проверяем настроен ли EmailJS
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.log("📧 EmailJS not configured — reservation saved to file only");
    console.log("=".repeat(50));
    console.log("Reservation details:");
    console.log("Phone:", phone);
    console.log("Datetime:", datetime);
    console.log("Hall:", hallNames[hall] || hall);
    console.log("Players:", players);
    console.log("=".repeat(50));
    console.log("💡 To enable email: set EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID in backend/.env");
    return { 
      mock: true, 
      message: "Reservation saved to file (EmailJS not configured)" 
    };
  }

  // Отправляем через EmailJS
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: TO_EMAIL,
          from_name: "Cyber Dogg Reservation Form",
          phone: phone,
          datetime: datetime,
          hall: hallNames[hall] || hall,
          players: players,
        },
      }),
    });

    const responseText = await response.text();
    
    // EmailJS может вернуть текст "OK" вместо JSON
    if (responseText.trim() === "OK" || response.ok) {
      console.log("✅ Email sent successfully via EmailJS");
      return { 
        sent: true, 
        messageId: "emailjs-success",
        message: "Email sent successfully" 
      };
    }

    if (!response.ok) {
      console.error("❌ EmailJS error:", response.status, responseText);
      return { 
        mock: true, 
        message: "Reservation saved to file (EmailJS failed)" 
      };
    }

    const result = JSON.parse(responseText);
    console.log("✅ Email sent successfully via EmailJS:", result);
    return { 
      sent: true, 
      messageId: result.msg_id,
      message: "Email sent successfully" 
    };
  } catch (err) {
    console.error("❌ EmailJS request failed:", err.message);
    return { 
      mock: true, 
      message: "Reservation saved to file (EmailJS request failed)" 
    };
  }
}
