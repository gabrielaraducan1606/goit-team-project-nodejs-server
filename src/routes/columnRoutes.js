import express from "express";
import {
  getColumns,
  createColumn,
  deleteColumn,
  updateColumn,
} from "../lib/controllers/column.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createColumnSchema } from "../lib/schema/columnSchemas.js";

const router = express.Router();

router.use(validateAuth);
router.get("/:boardId", getColumns);
router.post("/", validateBody(createColumnSchema), createColumn);
router.delete("/:id", deleteColumn);
router.patch("/:id", updateColumn);

export default router;
