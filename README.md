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

```bash
npm run dev       # Development
npm start         # Production
```

The server will start at: `http://localhost:5000`

---

## 🔐 Auth Routes ( `/auth` )

### `POST /auth/register`

Register a new user.

**Request Body:**

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "testpassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "code": 201,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "name": "Test User",
      "email": "test@example.com",
      "verify": false,
      "_id": "user_id"
    }
  }
}
```

➡️ Email with verification link is sent to the user.

---

### `GET /auth/verify/:verificationToken`

Verifies the email using the token from email.

**Response:**

```json
{
  "message": "Verification successful"
}
```

---

### `POST /auth/verify`

Resend email verification.

**Request Body:**

```json
{
  "email": "test@example.com"
}
```

**Response:**

```json
{
  "message": "Verification email sent"
}
```

---

### `POST /auth/login`

Login and get access/refresh tokens.

**Request Body:**

```json
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```

**Response:**

```json
{
  "accessToken": "...",
  "refreshToken": "...",
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

Request a new access token.

**Request Body:**

```json
{
  "refreshToken": "..."
}
```

**Response:**

```json
{
  "accessToken": "..."
}
```

---

### `PATCH /auth/profile`

Update user name or password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "name": "Updated Name",
  "password": "newpass123"
}
```

**Response:**

```json
{
  "user": {
    "name": "Updated Name",
    "email": "test@example.com",
    "avatarURL": "/avatars/example.jpg"
  }
}
```

---

### `POST /auth/avatar`

Upload avatar image.

**Headers:** `Authorization: Bearer <token>`

**Form-Data:**

- `avatar`: (file)

**Response:**

```json
{
  "user": {
    "avatarURL": "/avatars/filename.jpg"
  }
}
```

---

### `POST /auth/need-help`

Send a help request via email.

**Request Body:**

```json
{
  "email": "test@example.com",
  "comment": "I'm having trouble accessing my tasks."
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Help request sent successfully"
}
```

---

## 🧱 Board Routes (`/boards`)

### `GET /boards`

Returns all boards of the user.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "_id": "...",
    "title": "Project",
    "background": "/images/blue.jpg",
    "icon": "/icons/rocket.png",
    "owner": "user_id"
  }
]
```

---

### `POST /boards`

Create a new board.

**Request Body:**

```json
{
  "title": "Development",
  "background": "http://localhost:5000/images/blue.jpg",
  "icon": "http://localhost:5000/icons/rocket.png"
}
```

**Response:**

```json
{
  "_id": "...",
  "title": "Development",
  "background": "/images/blue.jpg",
  "icon": "/icons/rocket.png",
  "owner": "user_id"
}
```

---

### `PATCH /boards/:id`

Update board.

**Request Body:**

```json
{
  "title": "Updated Board",
  "background": "http://localhost:5000/images/sky.jpg",
  "icon": "http://localhost:5000/icons/star.png"
}
```

---

### `DELETE /boards/:id`

Delete board.

---

## 📦 Column Routes (`/columns`)

### `GET /columns/:boardId`

Get all columns for a board.

---

### `POST /columns`

Create a new column.

**Request Body:**

```json
{
  "title": "To Do",
  "boardId": "..."
}
```

---

### `PATCH /columns/:id`

Update a column's title or order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "title": "In Progress",
  "order": 2
}
```

**Response:**

```json
{
  "_id": "...",
  "title": "In Progress",
  "order": 2,
  "boardId": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### `DELETE /columns/:id`

Delete a column and all its cards.

---

## 📂 Card Routes (`/cards`)

### `GET /cards/:columnId`

Get cards from a column. Supports `priority=low|medium|high|none`.

---

### `POST /cards`

Create a card.

**Request Body:**

```json
{
  "title": "Implement login",
  "description": "Use JWT",
  "priority": "high",
  "deadline": "2024-12-01",
  "columnId": "..."
}
```

---

### `PATCH /cards/:id`

Update a card (can also move between columns).

---

### `DELETE /cards/:id`

Delete a card.

---

## 🎨 Assets (`/assets`)

### `GET /assets/backgrounds`

Returns image URLs for board backgrounds.

---

### `GET /assets/icons`

Returns icon image URLs for boards.

---

## 🖼 Static File Access

Access public files like this:

- `http://localhost:5000/images/<filename>`
- `http://localhost:5000/icons/<filename>`
- `http://localhost:5000/avatars/<filename>`

---

## ✅ Authorization Header

Send this header with all protected requests:

```
Authorization: Bearer <accessToken>
```

---

# 🔑 Google OAuth2 Login - Task Manager Backend

This backend allows users to **login or register with their Google account** using OAuth2 and Passport.js.

---

## 🧠 How it works (Simplified)

1. Frontend redirects to backend: `GET /auth/google`
2. User logs in with Google
3. Google redirects back to backend at `/auth/google/callback`
4. Backend:
   - Creates account (if new)
   - Generates `accessToken` and `refreshToken`
5. User is redirected to frontend with tokens in URL:

```
http://localhost:3000/dashboard?token.accessToken=...&token.refreshToken=...
```

---

## 📦 Backend Endpoints

### `GET /auth/google`

- Starts Google Login flow

### `GET /auth/google/callback`

- Handles Google's redirect
- Sends tokens to frontend in URL

---

## 💻 Frontend Integration (React)

### 🔹 Start Google Login

```tsx
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:5000/auth/google";
};
```

### 🔹 Handle Redirect with Tokens

```tsx
useEffect(() => {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get("token.accessToken");
  const refreshToken = url.searchParams.get("token.refreshToken");

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    // fetch user or redirect to main app
  }
}, []);
```

---

## ✅ Things to Know

- No email verification needed for Google users
- You get tokens directly in the redirect URL
- Use `accessToken` to call protected routes in backend
- User data is saved in MongoDB like this:

```json
{
  "email": "user@gmail.com",
  "name": "User Name",
  "verify": true,
  "avatarURL": "https://..."
}
```

---

That’s it — easy Google login for your app! 🚀

Developed with ❤️ using Node.js, Express, MongoDB.
