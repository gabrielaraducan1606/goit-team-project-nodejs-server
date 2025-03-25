# GOIT Team Project - Node.js Task Manager Backend

This is the backend for the Task Manager application built with **Node.js**, **Express.js**, and **MongoDB**. It includes full support for user authentication (JWT + Google OAuth2 + Refresh Tokens), board/column/card management, theme customization, and avatar upload.

---

## 🚀 Features

- **JWT Authentication** (Login / Register)
- **Google OAuth2 Login**
- **Access & Refresh Token Support**
- **Boards** with title, icon, background image
- **Columns** per board
- **Cards** per column with priorities, deadlines, and migration support
- **Upload and update user avatar** (local storage)
- **Static assets serving** (backgrounds, icons, avatars)
- **Validation** using Joi
- **MongoDB with Mongoose**
- **CORS**, **dotenv**, **Passport**, **Modular routing**

---

## 🛠️ Installation

1. **Clone the project:**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create a `.env.local` file:**

```env
PORT=5000
DB_HOST=<your_mongodb_connection_string>
TOKEN_SECRET=<your_jwt_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

---

## ▶️ Start Server

### 🔹 In development (with Nodemon):

```bash
npm run dev
```

### 🔹 In production:

```bash
npm start
```

The server will start at: `http://localhost:5000`

---

## 📂 Project Structure

```bash
GOIT-TASK-MANAGER-BACKEND/
├── public/
│   ├── images/
│   ├── icons/
│   └── avatars/
├── src/
│   ├── db/
│   ├── lib/
│   │   ├── assets/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── schema/
│   ├── middlewares/
│   ├── routes/
│   ├── app.js
│   └── cors.js
├── server.js
├── .env.local
├── package.json
└── README.md
```

---

## 📌 API Routes

### ✅ `GET /` — Server Check

- **Response:** `{ message: "The Express server is running perfectly!" }`

---

## 🔐 Auth Routes ( `/auth` )

### `POST /auth/register`

Registers a new user.

- **Request body:**

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "testpassword123"
}
```

---

### `POST /auth/login`

Login and return access and refresh tokens.

- **Request body:**

```json
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```

- **Response:**

```json
{
  "accessToken": "<JWT_ACCESS_TOKEN>",
  "refreshToken": "<JWT_REFRESH_TOKEN>",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "avatarURL": null
  }
}
```

---

### `POST /auth/refresh-token`

Generates new access token using a valid refresh token.

- **Request body:**

```json
{
  "refreshToken": "<your_refresh_token>"
}
```

- **Response:**

```json
{
  "accessToken": "<new_access_token>"
}
```

---

### `GET /auth/google` & `GET /auth/google/callback`

Used for Google OAuth2 login. On success, redirects to frontend with access token:

```
http://localhost:3000/dashboard?token=<access_token>
```

---

### `PATCH /auth/profile`

Update user profile.

- **Request body:**

```json
{
  "name": "Updated Name",
  "password": "newpass",
  "avatarURL": "http://localhost:5000/avatars/image.jpg"
}
```

---

### `POST /auth/avatar`

Upload a user avatar via form-data (field: `avatar`).

---

## 🧱 Board Routes ( `/boards` )

### `GET /boards`

Returns all boards created by the user.

- **Response:**

```json
[
  {
    "_id": "...",
    "title": "Design Board",
    "background": "/images/sky.jpg",
    "icon": "idea",
    "owner": "user_id"
  }
]
```

### `POST /boards`

Creates a new board.

- **Request body:**

```json
{
  "title": "Development",
  "background": "/images/blue.jpg",
  "icon": "code"
}
```

### `PATCH /boards/:id`

Updates board title, background, or icon.

### `DELETE /boards/:id`

Deletes the specified board.

---

## 📦 Column Routes ( `/columns` )

### `GET /columns/:boardId`

Returns all columns for a specific board.

### `POST /columns`

Create a column.

- **Request body:**

```json
{
  "title": "To Do",
  "boardId": "..."
}
```

### `DELETE /columns/:id`

Deletes the column and its associated cards.

---

## 📂 Card Routes ( `/cards` )

### `GET /cards/:columnId`

Get all cards in a specific column.

### `POST /cards`

Create a new card.

- **Request body:**

```json
{
  "title": "Implement login",
  "description": "Use JWT",
  "priority": "high",
  "deadline": "2024-12-01",
  "columnId": "..."
}
```

### `PATCH /cards/:id`

Update a card — including changing its column (card migration).

- **Request body:**

```json
{
  "columnId": "<new_column_id>",
  "priority": "medium"
}
```

> ✅ Use this to **migrate a card** from one column (e.g. To Do) to another (e.g. In Progress).

### `DELETE /cards/:id`

Deletes the selected card.

---

## 🎨 Assets Routes ( `/assets` )

### `GET /assets/backgrounds`

Returns URLs to background images.

### `GET /assets/icons`

Returns available icon URLs.

---

## 📥 Static File Access

- Backgrounds: `http://localhost:5000/images/<filename>`
- Icons: `http://localhost:5000/icons/<filename>`
- Avatars: `http://localhost:5000/avatars/<filename>`

---

## ✅ Auth Middleware

Use access token in header:

```http
Authorization: Bearer <access_token>
```

---

## 🪖 Validation Middleware

Each request is validated using Joi schema via `validateBody()` middleware.

---

> The backend gives you the foundation, you bring the app to life. Let’s build something cool! 💻✨

Developed with ❤️ using Node.js, Express, MongoDB.
