# Cyber Dogg - Инструкция по установке и запуску

Полнофункциональное веб-приложение для развлекательного центра Cyber Dogg с бронированием, админ-панелью, системой подарочных сертификатов и управлением игровым временем.

---

## Требования

- **Node.js** v16+
- **MySQL** v8+
- **npm** или

---

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/cyber-dogg.git
cd cyber-dogg
```

### 2. Настройка базы данных MySQL

1. Запустите MySQL (например, через XAMPP, WAMP или MySQL Workbench)
2. Создайте базу данных:
   ```sql
   CREATE DATABASE cyber_dogg;
   ```
3. Запустите скрипты миграции БД (см. раздел "Миграции БД")

---

## Настройка Backend

1. Перейдите в папку `backend`:
   ```bash
   cd backend
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env` на основе `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Отредактируйте `.env` файл:
   ```env
   PORT=3000
   HOST=0.0.0.0

   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=cyber_dogg

   # EmailJS конфигурация
   EMAILJS_SERVICE_ID=service_ctrd0i9
   EMAILJS_TEMPLATE_ID=template_z6s4j67
   EMAILJS_PUBLIC_KEY=YyNDL10cpIcLaZL1U
   TO_EMAIL=broken.halo000000@gmail.com
   ```

5. **Запустите миграции БД:**
   ```bash
   # Создайте таблицу пользователей (если не создана автоматически)
   node createUsersTable.js
   
   # Создайте таблицу заказов сертификатов
   node createCertificateOrdersTable.js
   
   # Обновите таблицу игрового времени
   updateTimeTable.js
   ```

6. **Создайте администратора (опционально):**
   ```bash
   # Используя SQL
   INSERT INTO users (username, email, phone, password, role) 
   VALUES ('admin', 'admin@cyberdogg.ru', '+70000000000', 'g10hwe', 'admin');
   
   # Пароль: admin111
   ```

---

## Настройка Frontend

1. Откройте новый терминал и перейдите в папку `frontend`:
   ```bash
   cd frontend
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. (Опционально) Создайте `.env` файл для переменных окружения:
   ```bash
   cp .env.example .env
   ```

4. (Опционально) Измените API URL в `.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

---

## Запуск проекта

### Вариант 1: Разработка (рекомендуется)

**Терминал 1 - Backend:**
```bash
cd backend
npm run dev
```

**Терминал 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Откройте в браузере:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

### Вариант 2: Продакшен

1. Соберите frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Запустите backend:
   ```bash
   cd backend
   npm start
   ```

---

## Настройка EmailJS (для работы отправки email)

1. **Зарегистрируйтесь на [EmailJS](https://www.emailjs.com/)**
2. **Создайте сервис:**
   - Перейдите в Email Templates → Create Template
   - Или используйте существующий template_z6s4j67

3. **Настройте безопасность:**
   - Зайдите в Account → Security
   - Включите **"API access from non-browser environments"**
   
4. **Проверьте настройки в `.env` файле**

---

## 📊 Эндпоинты API

### Публичные
- `GET /` - Приветствие API
- `GET /health` - Проверка здоровья
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/reservation` - Создание бронирования

### Защищённые (требуют авторизации)
- `GET /api/users/:id` - Профиль пользователя
- `PUT /api/users/:id` - Обновление профиля
- `DELETE /api/users/:id` - Удаление пользователя
- `GET /api/game-time/:phone` - Получить игровое время пользователя
- `POST /api/game-time/add` - Добавить игровое время (admin)

### Сертификаты
- `POST /api/certificates/order` - Создать заказ сертификата
- `GET /api/certificates/promo/:phone` - Получить сертификаты пользователя
- `POST /api/certificates/activate` - Активировать сертификат (admin)

### Админские (требуют role: 'admin')
- `GET /api/admin/reservations` - Все бронирования
- `DELETE /api/admin/reservations/:id` - Удаление бронирования
- `GET /api/admin/users` - Все пользователи
- `DELETE /api/admin/users/:id` - Удаление пользователя
- `GET /api/admin/certificates` - Все заказы сертификатов
- `PUT /api/admin/certificates/:id/status` - Изменить статус сертификата

---

## 🗄️ Структура проекта

```
cyber-dogg/
├── frontend/                 # Vue 3 + Vite приложение
│   ├── src/
│   │   ├── components/      # Переиспользуемые компоненты
│   │   │   ├── header/      # Компоненты шапки
│   │   │   ├── footer/      # Компоненты подвала
│   │   │   ├── homepage/    # Компоненты главной страницы
│   │   │   ├── CertificateBlock.vue
│   │   │   ├── CertificateOptions.vue
│   │   │   ├── PlaystationOptions.vue
│   │   │   └── TemplateButton.vue
│   │   ├── views/           # Страницы приложения
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Profile.vue
│   │   │   ├── AdminPanel.vue
│   │   │   ├── Price.vue
│   │   │   ├── Menu.vue
│   │   │   ├── GiftCertificates.vue
│   │   │   ├── BuyCertificate.vue
│   │   │   ├── Sale.vue
│   │   │   └── ForgotPassword.vue
│   │   ├── router/          # Маршрутизация (с защитой админ-панели)
│   │   └── main.js          # Точка входа
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Fastify + MySQL приложение
│   ├── routes/              # Маршруты API
│   ├── services/            # Бизнес-логика
│   ├── models/              # Модели БД
│   ├── utils/               # Утилиты
│   ├── createCertificateOrdersTable.js  # Миграция таблицы сертификатов
│   ├── updateTimeTable.js               # Миграция таблицы игрового времени
│   ├── server.js            # Точка входа
│   ├── db.js                # Конфигурация БД
│   ├── reservations.json    # Файл хранения бронирований
│   └── .env                 # Переменные окружения
├── README.md                # Основное описание
├── INSTALLATION.md          # Эта инструкции
└── EMAILJS_SETUP.md         # Настройка EmailJS
```

---

## Аутентификация и авторизация

### JWT-подобная система (упрощённая)
1. **Вход** → backend проверяет пароль
2. **Успех** → возвращает данные пользователя (включая `role`)
3. **Frontend** сохраняет пользователя в `localStorage`
4. **Для защищённых запросов** отправляет заголовок `X-User` с JSON пользователя
5. **Backend** проверяет роль пользователя из заголовка

### Роли:
- **user** - обычный пользователь, доступ к профилю
- **admin** - администратор, доступ к админ-панели

---

## Отправка email (EmailJS)

Система использует три уровня fallback:
1. **Primary:** EmailJS (работает через HTTPS порт 443)
2. **Fallback 1:** Ethereal тестовый SMTP
3. **Fallback 2:** Сохранение в файл (`reservations.json`) + вывод в консоль

**Все бронирования сохраняются в `backend/reservations.json`**

---

## 🛠️ Устранение неполадок

### ❌ "Не удалось подключиться к серверу"
1. Проверьте, запущен ли backend: `http://localhost:3000`
2. Проверьте `.env` настройки
3. Проверьте подключение к MySQL

### ❌ "Неверный логин или пароль"
1. Проверьте хеш пароля в БД
2. Проверьте функцию `simpleHash` в `backend/services/userService.js`
3. Используйте тестового админа: `admin` / `admin111`

### ❌ "Доступ запрещён" при входе в админ-панель
1. Проверьте, что пользователь имеет `role: 'admin'` в БД
2. Проверьте заголовок `X-User` в запросах
3. Обновите данные в `localStorage`

### ❌ Email не отправляется
1. Проверьте настройки EmailJS в `.env`
2. Проверьте API ключи в [EmailJS Dashboard](https://dashboard.emailjs.com/)
3. Убедитесь, что включён **"API access from non-browser environments"**

### ❌ БД не подключается
1. Проверьте MySQL сервер
2. Проверьте логин/пароль в `.env`
3. Создайте БД: `CREATE DATABASE cyber_dogg;`

### ❌ Ошибка миграции БД
1. Запустите скрипты миграции вручную:
   ```bash
   cd backend
   node createCertificateOrdersTable.js
   node updateTimeTable.js
   ```
2. Проверьте, что таблица `users` существует

### ❌ Сертификат не активируется
1. Проверьте, что таблица `certificate_orders` создана
2. Убедитесь, что пользователь с таким телефоном существует
3. Проверьте статус сертификата (должен быть `pending` или `paid`)

### ❌ Игровое время не добавляется
1. Проверьте таблицу `user_game_time`
2. Убедитесь, что телефон пользователя существует в таблице
3. Проверьте триггер `before_user_delete` для cascade delete

---

### Полезные команды

**Проверить статус серверов:**
```bash
# Проверить порты
netstat -an | findstr :3000
netstat -an | findstr :5173

# Проверить логи
cat backend/server.log
```

**Сбросить пароль админа:**
```bash
# Обновить хеш пароля
cd backend
node -e "
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
console.log('Hash для admin111:', simpleHash('admin111'));
"
