import express from "express";
import cors from "./cors.js";

const app = express();

app.use(express.json());
app.use(cors);

app.get("/", (req, res) => {
  res.json({ message: "🚀 The Express server is running perfectly!" });
});

export default app;
