# GOIT Team Project - Node.js Task Manager Backend

This is the backend for the Task Manager application built with **Node.js**, **Express.js**, and **MongoDB**. It includes full support for user authentication (JWT + Google OAuth2 + Refresh Tokens), board/column/card management, theme customization, and avatar upload.

---

## 🚀 Features

- **JWT Authentication** (Login / Register)
- **Google OAuth2 Login**
- **Access & Refresh Token Support**
- **Boards** with title, icon, background image
- **Columns** per board
- **Cards** per column with priorities, deadlines
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

Register a new user.

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

Login user and receive JWT tokens.

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

Use `accessToken` in future requests:

```http
Authorization: Bearer <accessToken>
```

---

### `POST /auth/refresh-token`

Generate a new access token using a valid refresh token.

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

- **Frontend Example:**

```js
const res = await fetch("http://localhost:5000/auth/refresh-token", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refreshToken }),
});
const data = await res.json();
```

---

### `GET /auth/google`

Start Google login.

### `GET /auth/google/callback`

Google login callback. Redirects user to frontend:

```url
http://localhost:3000/dashboard?token=<access_token>
```

- **Frontend example (Vite/React):**

```js
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
if (token) localStorage.setItem("token", token);
```

---

### `PATCH /auth/profile`

Update user profile (requires token).

- **Request body:**

```json
{
  "name": "New Name",
  "avatarURL": "http://localhost:5000/avatars/photo.png",
  "password": "newPassword123"
}
```

---

### `POST /auth/avatar`

Upload user avatar image (PNG/JPG).

- **Request body:** `form-data`

  - `avatar`: File input

- **Frontend example:**

```js
const formData = new FormData();
formData.append("avatar", file);

await fetch("http://localhost:5000/auth/avatar", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

---

## 🧱 Board Routes ( `/boards` )

🔐 Requires `Authorization: Bearer <token>`

- `GET /boards`
- `POST /boards`
- `PATCH /boards/:id`
- `DELETE /boards/:id`

---

## 📦 Column Routes ( `/columns` )

- `GET /columns/:boardId`
- `POST /columns`
- `DELETE /columns/:id`

---

## 🗂️ Card Routes ( `/cards` )

- `GET /cards/:columnId`
- `POST /cards`
- `PATCH /cards/:id`
- `DELETE /cards/:id`

---

## 🎨 Assets Routes ( `/assets` )

- `GET /assets/backgrounds` — Returns URLs for backgrounds.

---

## 📥 Static File Access

- Backgrounds: `http://localhost:5000/images/<filename>`
- Icons: `http://localhost:5000/icons/<filename>`
- Avatars: `http://localhost:5000/avatars/<filename>`

---

## ✅ Auth Middleware

Protect routes with:

```http
Authorization: Bearer <access_token>
```

---

## 🧪 Validation Middleware

Each route validates data using Joi and `validateBody()` middleware.

---

Developed with ❤️ using Node.js, Express, MongoDB.
