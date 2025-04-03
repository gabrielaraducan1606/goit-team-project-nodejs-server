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

/**
 * @swagger
 * tags:
 *   - name: Boards
 *     description: Rute pentru gestionarea board-urilor
 */

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Obține toate board-urile utilizatorului autentificat
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de board-uri
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 65f023abc1234
 *                   title:
 *                     type: string
 *                     example: Proiect GoIT
 *                   background:
 *                     type: string
 *                     example: blue
 *                   icon:
 *                     type: string
 *                     example: rocket
 *                   owner:
 *                     type: string
 *                     example: 64abc123456def
 */

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Creează un board nou
 *     tags: [Boards]
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
 *               - background
 *             properties:
 *               title:
 *                 type: string
 *                 example: Proiect Final
 *               background:
 *                 type: string
 *                 example: gradient-blue
 *               icon:
 *                 type: string
 *                 example: star
 *     responses:
 *       201:
 *         description: Board creat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 background:
 *                   type: string
 *                 icon:
 *                   type: string
 *                 owner:
 *                   type: string
 */

/**
 * @swagger
 * /boards/{id}:
 *   patch:
 *     summary: Actualizează un board existent
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID-ul boardului de actualizat
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Nume actualizat
 *               background:
 *                 type: string
 *                 example: dark-mode
 *               icon:
 *                 type: string
 *                 example: check
 *     responses:
 *       200:
 *         description: Board actualizat
 *       404:
 *         description: Board-ul nu a fost găsit sau nu ai acces
 */

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Șterge un board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID-ul boardului de șters
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Șters cu succes (fără conținut)
 */



router.use(validateAuth);
router.get("/", getBoards);
router.post("/", validateBody(createBoardSchema), createBoard);
router.patch("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
