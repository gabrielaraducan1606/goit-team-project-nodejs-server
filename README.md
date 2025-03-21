# GOIT Team Project - Node.js Server

This project is an Express server configured with support for **CORS**, **dotenv**, and **Nodemon** for development mode.

## 🚀 Features

- **Express.js** – fast framework for Node.js
- **CORS** – allows cross-origin requests
- **dotenv** – manages environment variables
- **Nodemon** – automatically restarts the server in development

---

## 🛠️ Installation

1. **Clone the project:**

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file and add:**
   ```env
   PORT=5000
   ```

---

## ▶️ Start Server

### 🔹 **In production:**

```bash
npm start
```

### 🔹 **In development (with Nodemon):**

```bash
npm run dev
```

The server will start at: `http://localhost:5000`

---

## 📂 Project Structure

```bash
GOIT-TEAM-PROJECT-NODEJS-SERVER/
├── node_modules/
├── public/
├── src/
│   ├── db/
│   ├── lib/
│   ├── middlewares/
│   ├── routes/
│   ├── app.js
│   ├── cors.js
├── server.js
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
```

---

## 📌 Available Routes

### ✅ `GET /`

- **Description:** Main endpoint, checks if the server is running.
- **Response:**

```json
{
  "message": "🚀 The Express server is running perfectly!!"
}
```

---

---

Developed with ❤️ using Node.js, Express.
