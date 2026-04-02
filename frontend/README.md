## Frontend (Nuxt + Tailwind)

### Требования

- Node.js 18+ (рекомендуется 18/20)
- npm

### Установка

Из корня репозитория:

```bash
cd frontend
npm install
```

### Запуск в dev режиме

Фронтенд запускается на **`http://localhost:8080`** (порт закреплён в `nuxt.config.ts`).

```bash
cd frontend
npm run dev
```

Если `8080` занят — сервер dev **не стартует** (это специально, чтобы не конфликтовать с backend на 3000). Освободи порт 8080 или останови процесс, который его держит.

### Конфигурация API

По умолчанию фронтенд использует backend по адресу:

- `http://localhost:3000/api`

Можно переопределить переменной окружения:

- **`NUXT_PUBLIC_API_BASE`**

Пример (PowerShell):

```powershell
$env:NUXT_PUBLIC_API_BASE="http://localhost:3000/api"
npm run dev
```

### Запуск вместе с backend

В одном терминале:

```bash
cd backend
npm install
npm start
```

В другом терминале:

```bash
cd frontend
npm run dev
```

### Доступы для логина

- `user@test.com / 123456` — пользователь
- `admin@test.com / admin123` — администратор

### Сборка и preview

Build the application for production:

```bash
cd frontend
npm run build
```

Locally preview production build:

```bash
cd frontend
npm run preview
```
