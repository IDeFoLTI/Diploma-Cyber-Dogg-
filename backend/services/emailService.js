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
 * Отправить письмо о бронировании
 */
export async function sendReservationEmail({ phone, datetime, hall, players }) {
  // Проверяем, настроен ли EmailJS
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn("⚠️ EmailJS not configured, saving to file instead");
    saveReservationToFile({ phone, datetime, hall, players });
    return { success: true, mock: true };
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
          hall: hall,
          players: players,
          message: `Телефон: ${phone}\nВремя: ${datetime}\nЗал: ${hall}\nИгроков: ${players}`,
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
      saveReservationToFile({ phone, datetime, hall, players });
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
    saveReservationToFile({ phone, datetime, hall, players });
    return { 
      mock: true, 
      message: "Reservation saved to file (EmailJS request failed)" 
    };
  }
}

/**
 * Отправить письмо с подтверждением сертификата
 */
export async function sendCertificateEmail({
  to,
  recipientName,
  hall,
  timeType,
  hours,
  packageType,
  price,
  orderId
}) {
  // Проверяем, настроен ли EmailJS
  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.warn("⚠️ EmailJS not configured for certificate email");
    return { success: true, mock: true };
  }

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
          to_email: to,
          recipient_name: recipientName,
          hall: hall,
          time_type: timeType,
          hours: hours,
          package_type: packageType,
          price: price,
          order_id: orderId,
        },
      }),
    });

    const responseText = await response.text();
    
    if (responseText.trim() === "OK" || response.ok) {
      console.log("✅ Certificate email sent successfully via EmailJS");
      return { sent: true };
    }

    console.error("❌ EmailJS certificate email error:", response.status, responseText);
    return { sent: false, message: "EmailJS failed" };
  } catch (err) {
    console.error("❌ EmailJS certificate email request failed:", err.message);
    return { sent: false, message: "EmailJS request failed" };
  }
}

