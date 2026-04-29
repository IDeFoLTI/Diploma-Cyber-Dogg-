# EmailJS Setup Guide

## 📧 Настройка отправки email через EmailJS

EmailJS работает через **HTTPS API (порт 443)**, который не блокируется фаерволами.

---

## Шаг 1: Регистрация на EmailJS

1. Перейди на [https://www.emailjs.com/](https://www.emailjs.com/)
2. Нажми **Sign Up** (бесплатный тариф: 200 email/месяц)
3. Зарегистрируйся через Google или email

---

## Шаг 2: Создать Email Service

1. В Dashboard нажми **Add New Service**
2. Выбери **Gmail** (или другой провайдер)
3. Нажми **Connect Account** и авторизуйся
4. Скопируй **Service ID** (например: `service_gmail`)

---

## Шаг 3: Создать Email Template

1. В Dashboard нажми **Email Templates** → **Create New Template**
2. В шаблоне письма используй переменные:

```
To: {{to_email}}

Новая заявка на бронирование Cyber Dogg

Параметры заявки:
------------------
Телефон: {{phone}}
Дата и время: {{datetime}}
Зал: {{hall}}
Количество игроков: {{players}}

------------------
Отправлено с сайта Cyber Dogg
```

3. Нажми **Save Template**
4. Скопируй **Template ID** (например: `template_abc123`)

---

## Шаг 4: Получить Public Key

1. В Dashboard нажми на своё имя → **Account**
2. Найди **Public Key** (например: `user_abc123xyz`)
3. Скопируй его

---

## Шаг 5: Настроить backend

Открой `backend/.env` и замени значения:

```env
EMAILJS_PUBLIC_KEY=user_abc123xyz
EMAILJS_SERVICE_ID=service_gmail
EMAILJS_TEMPLATE_ID=template_abc123
```

**Важно:** Остальные поля (`TO_EMAIL`, `SMTP_*`) можно удалить — они не нужны для EmailJS.

---

## Шаг 6: Перезапустить backend

```powershell
Stop-Process -Name node -Force
cd backend
node server.js
```

---

## Шаг 7: Протестировать

1. Открой `http://localhost:5173`
2. Заполни форму бронирования
3. Нажми "Забронировать"
4. Проверь:
   - **Письмо пришло на `broken.halo000000@gmail.com`**
   - В консоли backend: `✅ Email sent successfully via EmailJS`

---

## 🎯 Шаблон письма в EmailJS

В настройках EmailJS Template установи:

**Subject:** `Новая заявка на бронирование - Cyber Dogg`

**From Name:** `Cyber Dogg`

**To Email:** `broken.halo000000@gmail.com`

**Body:**
```
To: {{to_email}}

Новая заявка на бронирование Cyber Dogg

Параметры заявки:
------------------
Телефон: {{phone}}
Дата и время: {{datetime}}
Зал: {{hall}}
Количество игроков: {{players}}

------------------
Отправлено с сайта Cyber Dogg
```

---

## 💡 Бесплатный тариф EmailJS

- 200 email/месяц
- 1 Email Service
- 1 Email Template
- 1000 API requests/месяц

Если нужно больше — платный тариф от $0.15/email.
