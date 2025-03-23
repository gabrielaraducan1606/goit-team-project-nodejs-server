import express from "express";
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
} from "../lib/controllers/card.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { createCardSchema } from "../lib/schema/cardSchemas.js";

const router = express.Router();

router.use(validateAuth);
router.get("/:columnId", getCards);
router.post("/", validateBody(createCardSchema), createCard);
router.patch("/:id", updateCard);
router.delete("/:id", deleteCard);

export default router;
