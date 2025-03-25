import express from "express";
import {
  getBackgrounds,
  getIcons,
} from "../lib/controllers/assets.controller.js";

const router = express.Router();

router.get("/backgrounds", getBackgrounds);
router.get("/icons", getIcons);

export default router;
