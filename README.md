# GOIT Team Project - Node.js Task Manager Backend

This is the backend for the Task Manager application built with **Node.js**, **Express.js**, and **MongoDB**. It includes full support for authentication, board/column/card management, and theme customization using static image assets.

---

## 🚀 Features

- **JWT Authentication** (Login / Register , Refresh Token Support)
- **Boards** with title, icon, background image
- **Columns** per board
- **Cards** per column with priorities, deadlines
- **Upload and update user avatar**
- **Static assets serving** (backgrounds & icons)
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
```

---

## ▶️ Start Server

### 🔹 **In development (with Nodemon):**

```bash
npm run dev
```

### 🔹 **In production:**

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
│   │   └── connectToDb.js
│   ├── lib/
│   │   ├── assets/
│   │   │   └── backgrounds.js
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

- **Body:**

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "testpassword123"
}
```

---

### `POST /auth/login`

- **Body:**

```json
{
  "email": "testuser@example.com",
  "password": "testpassword123"
}
```

- **Response:**

```json
{
  "token": "<JWT_TOKEN>",
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "testuser@example.com",
    "avatarURL": null
  }
}
```

---

### `PATCH /auth/profile`

🔐 Requires Bearer Token in `Authorization` header.

- **Body:** (any or all fields)

```json
{
  "name": "New Name",
  "avatarURL": "http://localhost:5000/avatars/photo.png",
  "password": "newSecurePass123"
}
```

- **Response:**

```json
{
  "user": {
    "_id": "...",
    "name": "New Name",
    "email": "testuser@example.com",
    "avatarURL": "http://localhost:5000/avatars/photo.png"
  }
}
```

---

### `POST /auth/avatar`

🔐 Requires Bearer Token in `Authorization` header.

- **Body (form-data):**

  - `avatar`: (type: File) — user uploads a PNG/JPG file

- **Response:**

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "user": {
      "_id": "...",
      "name": "Test User",
      "email": "test@example.com",
      "avatarURL": "/avatars/<filename>.jpg"
    }
  }
}
```

- **Frontend integration (example):**

```js
const formData = new FormData();
formData.append("avatar", file);

fetch("http://localhost:5000/auth/avatar", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

## 🔁 Refresh Token Support

### `POST /auth/refresh-token`

- **Description:** Generate a new access token using a valid refresh token.
- **Body:**

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

## 🔐 Google OAuth2 Login

### `GET /auth/google`

- Starts the Google login flow (opens browser popup or redirect).

### `GET /auth/google/callback`

- Google redirects here after user login.
- On success, the user is redirected to:

```
http://localhost:3000/dashboard?token=<access_token>
```

- **Frontend (Vite/React) Example:**

```js
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  localStorage.setItem("token", token);
}
```

---

### 🔧 Make sure your `.env.local` contains:

````env
TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

---

## 🧱 Board Routes ( `/boards` )

🔐 Requires Bearer Token in `Authorization` header.

### `GET /boards`

- **Description:** Get all boards for the logged-in user

### `POST /boards`

- **Body:** `{ title, background (optional), icon (optional) }`
- **Response:** Created board

### `PATCH /boards/:id`

- **Body:** Fields to update: `title`, `background`, `icon`

### `DELETE /boards/:id`

- **Description:** Deletes a board owned by the user

---

## 📦 Column Routes ( `/columns` )

🔐 Requires Bearer Token

### `GET /columns/:boardId` — Columns for a board

### `POST /columns` — Create column (`{ title, boardId }`)

### `DELETE /columns/:id` — Delete column

---

## 📂 Card Routes ( `/cards` )

🔐 Requires Bearer Token

### `GET /cards/:columnId` — Cards for a column

### `POST /cards` — Create card

```json
{
  "title": "Task name",
  "description": "Details...",
  "columnId": "...",
  "priority": "low | medium | high",
  "deadline": "2024-12-31"
}
````

### `PATCH /cards/:id` — Update card

### `DELETE /cards/:id` — Delete card

---

## 🎨 Assets Routes ( `/assets` )

### `GET /assets/backgrounds`

- **Description:** Returns full URLs to background images stored in `public/images`
- **Response:**

```json
[
  "http://localhost:5000/images/blue-sea.jpg",
  "http://localhost:5000/images/star-sky.jpg",
  ...
]
```

Use this list on frontend to display background options when creating/editing a board.

---

## 📅 Static Files Access

- Backgrounds: `http://localhost:5000/images/<filename>`
- Icons: `http://localhost:5000/icons/<filename>`
- Avatars: `http://localhost:5000/avatars/<filename>`

---

## ✅ Auth Middleware

Protected routes use `validateAuth` to check JWT token:

```ts
Authorization: Bearer<token>;
```

---

## 🧪 Validation Middleware

Every route using `validateBody(schema)` ensures incoming data is validated with Joi before continuing.

---

Developed with ❤️ using Node.js, Express, MongoDB.
