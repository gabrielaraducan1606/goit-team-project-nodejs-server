import express from "express";
import passport from "passport";
import authController from "../lib/controllers/authController.js";
import schemas from "../lib/schema/userSchemas.js";
import { validateBody } from "../middlewares/validateBody.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import User from "../lib/models/user.js";

const router = express.Router();

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

router.post("/login", validateBody(schemas.loginSchema), async (req, res) => {
  try {
    const data = await authController.login(req.body);
    res.status(200).json({
      status: "success",
      code: 200,
      data,
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
    console.error("Verification error:", error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

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
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    if (user.verify) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Verification has already been passed",
      });
    }

    const newToken = user.verificationToken || uuidv4();
    await authController.updateToken(email, newToken);

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error",
    });
  }
});

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

router.post("/logout", validateAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    await authController.logout(userId);

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

export default router;
