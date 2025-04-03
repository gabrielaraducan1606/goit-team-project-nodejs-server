import express from "express";
import {
  getBackgrounds,
  getIcons,
} from "../lib/controllers/assets.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Assets
 *     description: Rute pentru resurse vizuale (background-uri, iconițe etc.)
 */

/**
 * @swagger
 * /assets/backgrounds:
 *   get:
 *     summary: Obține lista completă de background-uri disponibile
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: Listă cu URL-urile background-urilor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: http://localhost:5000/images/backgrounds/bg1.jpg
 */


router.get("/backgrounds", getBackgrounds);


/**
 * @swagger
 * /assets/icons:
 *   get:
 *     summary: Obține lista completă de iconițe disponibile
 *     tags: [Assets]
 *     responses:
 *       200:
 *         description: Listă cu URL-urile iconițelor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: http://localhost:5000/icons/icon1.svg
 */
router.get("/icons", getIcons);

export default router;
