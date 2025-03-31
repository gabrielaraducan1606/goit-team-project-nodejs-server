import express from "express";
import multer from "multer";
import path from "path";
import {
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

export default router;
