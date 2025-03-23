import express from "express";
import {
  getBoards,
  createBoard,
  deleteBoard,
  updateBoard,
} from "../lib/controllers/board.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createBoardSchema } from "../lib/schema/boardSchemas.js";

const router = express.Router();

router.use(validateAuth);
router.get("/", getBoards);
router.post("/", validateBody(createBoardSchema), createBoard);
router.patch("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
