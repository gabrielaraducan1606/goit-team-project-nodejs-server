import express from "express";
import passport from "passport";
import authController from "../lib/controllers/authController.js";
import schemas from "../lib/schema/userSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const router = express.Router();

/* REGISTER - POST localhost:5001/auth/register */
router.post(
  "/register",
  validateBody(schemas.registerSchema),
  async (req, res) => {
    try {
      const newUser = await authController.signup(req.body);
      res.status(201).json({
        status: "success",
        code: 201,
        data: {
          user: newUser,
        },
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

/* LOGIN - POST localhost:5001/auth/login */
router.post("/login", validateBody(schemas.loginSchema), async (req, res) => {
  try {
    const token = await authController.login(req.body);
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
      },
    });
  } catch (error) {
    if (error.message === "Email or password is incorrect") {
      res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is incorrect",
      });
    } else {
      res.status(500).json({
        status: "error",
        code: 500,
        message: error.message,
      });
    }
  }
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const jwt = await authController.generateGoogleToken(req.user);

    const redirectUrl = `http://localhost:3000/dashboard?token=${jwt}`;
    res.redirect(redirectUrl);
  }
);
router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Refresh token is required",
    });
  }

  try {
    const newAccessToken = await authController.refreshAccessToken(
      refreshToken
    );
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "error",
      code: 401,
      message: error.message,
    });
  }
});

export default router;
