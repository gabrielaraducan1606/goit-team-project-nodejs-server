import express from "express";
import logger from "morgan";
import cors from "./cors.js";
import passport from "passport";
import connectToDb from "./db/connectToDb.js";
import { swaggerUi, swaggerSpec } from "../swaggerConfig.js"; // <- adăugat

import "./config/passport.js";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import columnRoutes from "./routes/columnRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import assetsRoutes from "./routes/assetsRoutes.js";

connectToDb();

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.json());
app.use(logger(formatsLogger));
app.use(cors);
app.use(passport.initialize());

app.use("/images", express.static("public/images"));
app.use("/icons", express.static("public/icons"));

// 🔽 Ruta pentru Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", profileRoutes);
app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);
app.use("/columns", columnRoutes);
app.use("/cards", cardRoutes);
app.use("/assets", assetsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "The Express server is running perfectly!" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    code: 500,
    message: err.message || "Internal Server Error",
  });
});

export default app;
