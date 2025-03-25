import backgrounds from "../assets/backgrounds.js";
import icons from "../assets/icons.js";

export const getBackgrounds = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const fullPaths = backgrounds.map((bg) => `${baseUrl}${bg}`);
  res.json(fullPaths);
};

export const getIcons = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const fullUrls = icons.map((icon) => `${baseUrl}${icon}`);
  res.json(fullUrls);
};
