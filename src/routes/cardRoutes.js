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

/**
 * @swagger
 * tags:
 *   - name: Cards
 *     description: Rute pentru gestionarea cardurilor
 */

/**
 * @swagger
 * /cards/{columnId}:
 *   get:
 *     summary: Obține toate cardurile dintr-o coloană
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: columnId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul coloanei
 *     responses:
 *       200:
 *         description: Lista de carduri din coloană
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65f0a1c2e4babc00123de456
 *                   title:
 *                     type: string
 *                     example: Creează wireframe pentru homepage
 *                   description:
 *                     type: string
 *                     example: Nu uita responsive + dark mode
 *                   priority:
 *                     type: string
 *                     example: High
 *                   columnId:
 *                     type: string
 */

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Creează un card nou
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - columnId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finalizează autentificarea cu Google
 *               description:
 *                 type: string
 *                 example: Redirecționează corect pe dashboard
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 example: Medium
 *               columnId:
 *                 type: string
 *                 example: 65f022efcba123456
 *     responses:
 *       201:
 *         description: Card creat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 columnId:
 *                   type: string
 */

/**
 * @swagger
 * /cards/{id}:
 *   patch:
 *     summary: Actualizează un card existent
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul cardului
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Titlu actualizat
 *               description:
 *                 type: string
 *                 example: Detalii noi pentru task
 *               priority:
 *                 type: string
 *                 example: Low
 *     responses:
 *       200:
 *         description: Card actualizat
 *       404:
 *         description: Cardul nu a fost găsit
 */

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Șterge un card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID-ul cardului
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Card șters cu succes
 *       404:
 *         description: Cardul nu a fost găsit
 */



router.use(validateAuth);
router.get("/:columnId", getCards);
router.post("/", validateBody(createCardSchema), createCard);
router.patch("/:id", updateCard);
router.delete("/:id", deleteCard);

export default router;
