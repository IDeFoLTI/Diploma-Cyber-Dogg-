# Cyber Dogg

Веб-приложение для развлекательного центра Cyber Dogg.


### Frontend
- **Vue 3** (Composition API, `<script setup>`)
- **Vite** — сборка и dev-сервер
- **Vue Router** — маршрутизация с защитой роутов
- **CSS3** — кастомные стили с CSS-переменными

### Backend
- **Fastify** — Node.js фреймворк
- **MySQL** — база данных
- **EmailJS** — отправка email без SMTP
- **reservations.json** — хранение бронирований


### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Заполните .env необходимыми переменными
npm run dev
```


```
cyber-dogg/
├── frontend/
│   ├── src/
│   │   ├── components/       # Переиспользуемые компоненты
│   │   │   ├── header/       # Компоненты шапки
│   │   │   ├── footer/       # Компоненты подвала
│   │   │   ├── homepage/     # Компоненты главной страницы
│   │   │   ├── TemplateButton.vue
│   │   │   └── CertificateBlock.vue
│   │   ├── views/            # Страницы приложения
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── Profile.vue
│   │   │   ├── AdminPanel.vue  # Админ-панель
│   │   │   └── ...
│   │   ├── router/           # Маршрутизация
│   │   ├── main.js           # Точка входа
│   │   └── styles.css        # Глобальные стили
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── controllers/          # Контроллеры
    ├── routes/               # API маршруты
    ├── services/             # Бизнес-логика
    ├── models/               # Модели БД
    ├── repositories/         # Работа с БД
    ├── server.js             # Точка входа
    ├── db.js                 # Конфигурация БД
    ├── reservations.json     # Хранение бронирований
    └── .env                  # Переменные окружения
```


### Страницы
- **Главная** — информация о заведении, бронирование
- **Бронирование** — форма заявки с валидацией
- **Подарочные сертификаты** — выбор типа сертификата и опций
- **Авторизация/Регистрация** — вход, регистрация, восстановление пароля
- **Личный кабинет** — профиль пользователя
- **Админ-панель** — управление бронированиями и пользователями (только для admin)

### Админ-панель
- ✅ Просмотр всех бронирований
- ✅ Удаление бронирований
- ✅ Просмотр пользователей
- ✅ Добавление игрового времени (в разработке)
- ✅ Активация сертификатов (в разработке)
- ✅ Управление аккаунтами (в разработке)


### Подарочные сертификаты
- 4 типа сертификатов (Common room, Battle Arena, VIP room, PlayStation)
- Выбор времени суток (день/вечер)
- Выбор продолжительности (3/5 часов)
- Пакетные предложения (Кибер сутки, Ночь)
- Динамическое ценообразование


### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cyber_dogg
PORT=3000

# EmailJS (уже настроено)
EMAILJS_SERVICE_ID=service_ctrd0i9
EMAILJS_TEMPLATE_ID=template_z6s4j67
EMAILJS_PUBLIC_KEY=YyNDL10cpIcLaZL1U
TO_EMAIL=broken.halo000000@gmail.com
```

### Тестовые пользователи
- **Админ:** `admin` / `admin111`
- **Обычный пользователь:** создать через регистрацию


```bash
cd frontend
npm run build
```
