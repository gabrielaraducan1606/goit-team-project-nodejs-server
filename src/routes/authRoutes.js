import express from "express";
import passport from "passport";
import authController from "../lib/controllers/authController.js";
import schemas from "../lib/schema/userSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import User from "../lib/models/user.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Înregistrare utilizator
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: MySecurePassword123
 *               name:
 *                 type: string
 *                 example: Alina Popescu
 *     responses:
 *       201:
 *         description: Utilizator creat
 *       409:
 *         description: Email deja înregistrat
 *       500:
 *         description: Eroare internă
 */
router.post(
  "/register",
  validateBody(schemas.registerSchema),
  async (req, res) => {
    try {
      const newUser = await authController.signup(req.body);
      res.status(201).json({
        status: "success",
        code: 201,
        message:
          "Registration successful. Please check your email to verify your account.",
        data: { user: newUser },
      });
    } catch (error) {
      if (error.message === "Email already in use") {
        res.status(409).json({
          status: "error",
          code: 409,
          message: "Email already in use",
        });
      } else {
        res.status(500).json({
          status: "error",
          code: 500,
          message: error.message,
        });
      }
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentificare utilizator
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autentificare reușită
 *       401:
 *         description: Email sau parolă incorectă
 *       500:
 *         description: Eroare internă
 */
router.post("/login", validateBody(schemas.loginSchema), async (req, res) => {
  try {
    const data = await authController.login(req.body);
    res.status(200).json({
      status: "success",
      code: 200,
      data,
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      code: 401,
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Obține un token de acces nou
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token nou generat
 *       400:
 *         description: Token lipsă
 *       401:
 *         description: Token invalid sau expirat
 */
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Missing refresh token" });
    }
    const newAccessToken = await authController.refreshAccessToken(
      refreshToken
    );
    res.status(200).json({
      status: "success",
      code: 200,
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      code: 401,
      message: error.message,
    });
  }
});

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Autentificare cu Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirecționare către Google
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Callback după autentificare Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirecționare către aplicație cu token
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const jwt = await authController.generateGoogleToken(req.user);
    const redirectUrl = `http://localhost:3000/dashboard?token=${jwt}`;
    res.redirect(redirectUrl);
  }
);

/**
 * @swagger
 * /auth/verify/{verificationToken}:
 *   get:
 *     summary: Verifică adresa de email
 *     tags: [Auth]
 *     parameters:
 *       - name: verificationToken
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verificare reușită
 *       404:
 *         description: Token invalid sau expirat
 */
router.get("/verify/:verificationToken", async (req, res) => {
  const token = req.params.verificationToken;
  try {
    const user = await authController.getUserByValidationToken(token);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or token expired" });
    }
    if (user.verify) {
      return res.status(400).json({ message: "User is already verified" });
    }
    await User.findOneAndUpdate(
      { verificationToken: token },
      { verify: true, verificationToken: null },
      { new: true }
    );
    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Retrimite emailul de verificare
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email trimis
 *       404:
 *         description: Utilizator inexistent
 */
router.post("/verify", async (req, res) => {
  const { error } = schemas.emailSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing required field email",
    });
  }

  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res.status(400).json({ message: "User is already verified" });
    }
    const newToken = user.verificationToken || uuidv4();
    await authController.updateToken(email, newToken);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

/**
 * @swagger
 * /auth/need-help:
 *   post:
 *     summary: Trimite o cerere de ajutor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, comment]
 *             properties:
 *               email:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cerere trimisă
 *       500:
 *         description: Eroare la trimitere
 */
router.post(
  "/need-help",
  validateBody(schemas.needHelpSchema),
  async (req, res) => {
    const { email, comment } = req.body;

    try {
      const result = await authController.needHelp(email, comment);
      res.status(200).json({
        status: "success",
        message: "Help request sent successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in need-help route:", error);
      res.status(500).json({
        status: "error",
        message: error.message || "Internal server error",
      });
    }
  }
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout utilizator
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout cu succes
 *       500:
 *         description: Eroare internă
 */
router.post("/logout", validateAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    await authController.logout(userId);
    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

export default router;
