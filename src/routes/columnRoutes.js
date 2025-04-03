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

/**
 * @swagger
 * tags:
 *   - name: Columns
 *     description: Rute pentru gestionarea coloanelor
 */

/**
 * @swagger
 * /columns/{boardId}:
 *   get:
 *     summary: Obține toate coloanele unui board
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: boardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul boardului
 *     responses:
 *       200:
 *         description: Lista de coloane pentru boardul dat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65f0abc123456
 *                   title:
 *                     type: string
 *                     example: To Do
 *                   boardId:
 *                     type: string
 *                     example: 65f0def789123
 */

/**
 * @swagger
 * /columns:
 *   post:
 *     summary: Creează o coloană nouă într-un board
 *     tags: [Columns]
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
 *               - boardId
 *             properties:
 *               title:
 *                 type: string
 *                 example: In Progress
 *               boardId:
 *                 type: string
 *                 example: 65f0def789123
 *     responses:
 *       201:
 *         description: Coloană creată cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 boardId:
 *                   type: string
 */

/**
 * @swagger
 * /columns/{id}:
 *   delete:
 *     summary: Șterge o coloană și toate cardurile din ea
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul coloanei
 *     responses:
 *       204:
 *         description: Coloană și carduri șterse cu succes
 *       404:
 *         description: Coloană inexistentă
 *       500:
 *         description: Eroare internă
 */



router.use(validateAuth);
router.get("/:boardId", getColumns);
router.post("/", validateBody(createColumnSchema), createColumn);
router.delete("/:id", deleteColumn);
router.patch("/:id", updateColumn);

export default router;
