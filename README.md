# Cyber Dogg

Веб-приложение для развлекательного центра Cyber Dogg.


### Frontend
- **Vue 3** (Composition API, `<script setup>`)
- **Vite** — сборка и dev-сервер
- **Vue Router** — маршрутизация
- **CSS3** — кастомные стили с CSS-переменными

### Backend
- **Fastify** — Node.js фреймворк
- **MySQL** — база данных


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
│   │   │   ├── CertificateBlock.vue
│   │   │   ├── CertificateOptions.vue
│   │   │   └── TemplateButton.vue
│   │   ├── views/            # Страницы приложения
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   ├── ForgotPassword.vue
│   │   │   ├── ResetPassword.vue
│   │   │   └── GiftCertificates.vue
│   │   ├── assets/           # Шрифты, изображения
│   │   ├── public/           # Статические файлы
│   │   ├── App.vue           # Корневой компонент
│   │   ├── main.js           # Точка входа
│   │   └── styles.css        # Глобальные стили
│   ├── package.json
│   └── vite.config.js
└── backend/
    ├── src/
    ├── package.json
    └── .env.example
```


### Страницы
- **Главная** — информация о заведении, бронирование
- **Бронирование** — форма заявки с валидацией
- **Подарочные сертификаты** — выбор типа сертификата и опций
- **Авторизация/Регистрация** — вход, регистрация, восстановление пароля
- **Личный кабинет** — профиль пользователя

### Формы с валидацией
Все формы включают клиентскую валидацию:
- ✅ Проверка обязательных полей
- ✅ Валидация email
- ✅ Проверка телефона (минимум 10 цифр)
- ✅ Проверка пароля (минимум 6 символов)
- ✅ Визуальная обратная связь (красная обводка, сообщения об ошибках)
- ✅ Блокировка кнопок до заполнения формы

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
```


```bash
cd frontend
npm run build
```
