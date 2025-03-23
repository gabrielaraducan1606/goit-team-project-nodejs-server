import backgrounds from "../assets/backgrounds.js";

export const getBackgrounds = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const fullPaths = backgrounds.map((bg) => `${baseUrl}${bg}`);
  res.json(fullPaths);
};
