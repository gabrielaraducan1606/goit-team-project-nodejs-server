import express from "express";
import backgrounds from "../lib/assets/backgrounds.js";
import icons from "../lib/assets/icons.js";
const router = express.Router();

router.get("/backgrounds", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const fullUrls = backgrounds.map((path) => `${baseUrl}${path}`);
  res.json(fullUrls);
});
router.get("/icons", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const fullUrls = icons.map((icon) => `${baseUrl}${icon}`);
  res.json(fullUrls);
});
export default router;
