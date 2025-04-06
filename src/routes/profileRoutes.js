import express from "express";
import multer from "multer";
import path from "path";
import {
  getAvatar,
  getImage,
  updateProfile,
  uploadAvatar,
} from "../lib/controllers/profileController.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "public/avatars",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${req.user._id}${ext}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Rute pentru profilul utilizatorului autentificat
 */

/**
 * @swagger
 * /auth/profile:
 *   patch:
 *     summary: Actualizează profilul utilizatorului (nume, avatar, parolă)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alina Popescu
 *               avatarURL:
 *                 type: string
 *                 example: /avatars/65f01f123abc.jpg
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: newSecurePassword123
 *     responses:
 *       200:
 *         description: Profil actualizat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatarURL:
 *                           type: string
 *       500:
 *         description: Eroare internă
 */

/**
 * @swagger
 * /auth/avatar:
 *   post:
 *     summary: Încarcă un avatar pentru utilizatorul autentificat
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar încărcat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         avatarURL:
 *                           type: string
 *                           example: /avatars/65f01f123abc.jpg
 *       500:
 *         description: Eroare la încărcare
 */

router.patch("/profile", validateAuth, async (req, res) => {
  try {
    const user = await updateProfile(req.user._id, req.body);
    res.status(200).json({
      status: "success",
      code: 200,
      data: { user },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

router.post("/avatar", validateAuth, upload.single("avatar"), uploadAvatar);
router.get("/avatars/:filename",  getAvatar);
router.get("/image/:filename", getImage);

export default router;
