## Backend API (Node.js + Express + SQLite)

### Требования

- Node.js 18+ (рекомендуется 18/20)
- npm

### Установка и запуск

Из корня репозитория:

```bash
cd backend
npm install
npm start
```

По умолчанию API стартует на `http://localhost:3000/api`.

### Конфигурация (.env)

Файл `.env` опциональный.

- **PORT**: порт бэкенда (по умолчанию `3000`)
- **JWT_SECRET**: ключ подписи JWT (по умолчанию `very-secret-jwt-key`)

Пример:

```env
PORT=3000
JWT_SECRET=replace-me
```

### Аутентификация

1) Логин:

- `POST /api/auth/login`
- Body:

```json
{
  "email": "user@test.com",
  "password": "123456"
}
```

Ответ содержит `token` (JWT) и `user`:

```json
{
  "token": "<jwt>",
  "user": { "email": "user@test.com", "role": "user" }
}
```

2) Авторизация:

Для всех эндпоинтов `/api/tasks/*` нужен заголовок:

- `Authorization: Bearer <jwt>`

JWT содержит `email` и `role`. Роль используется для прав доступа:

- **admin**: может редактировать/удалять любые задачи
- **user**: может редактировать/удалять только свои задачи (где `createdBy === email`)

### Tasks API

- `GET /api/tasks` — список задач
- `GET /api/tasks/:id` — задача по id
- `POST /api/tasks` — создать задачу
- `PUT /api/tasks/:id` — обновить задачу
- `DELETE /api/tasks/:id` — удалить задачу

#### Формат задачи

```json
{
  "id": 3,
  "title": "Test task",
  "description": "Description",
  "dueDate": "2026-04-10",
  "isCompleted": true,
  "createdBy": "user@test.com"
}
```

#### dueDate

API принимает `dueDate` в форматах:

- `YYYY-MM-DD` (рекомендуется)
- `DD.MM.YYYY` (будет автоматически нормализован в `YYYY-MM-DD`)

### SQLite база

Файл БД лежит в `backend/database/database.sqlite`.

Если нужно “с нуля”, можно остановить сервер и удалить файл БД — при следующем запуске таблица будет создана заново.
