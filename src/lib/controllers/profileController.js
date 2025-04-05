import bcrypt from "bcrypt";
import User from "../models/user.js";

export async function updateProfile(userId, updates) {
  const allowedFields = ["name", "avatarURL", "password"];
  const updateData = {};

  for (const field of allowedFields) {
    if (updates[field]) {
      updateData[field] =
        field === "password"
          ? await bcrypt.hash(updates[field], 10)
          : updates[field];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");

  return updatedUser;
}

export async function uploadAvatar(req, res) {
  try {
    const avatarURL = `/avatars/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarURL },
      { new: true }
    ).select("-password");

    res.status(200).json({
      status: "success",
      code: 200,
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
}


export async function getAvatar(req, res) {
  try {
    const { filename } = req.params;
    const imagePath = path.join(process.cwd(), "public", "avatars", filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Image not found",
      });
    }

    const ext = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".webp") contentType = "image/webp";

    res.set("Content-Type", contentType);
    fs.createReadStream(imagePath).pipe(res);
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
}

export async function getImage(req, res) {
  try {
    const { filename } = req.params;
    const imagePath = path.join(process.cwd(), "public", "images", filename);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Image not found",
      });
    }

    const ext = path.extname(filename).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".webp") contentType = "image/webp";

    res.set("Content-Type", contentType);
    fs.createReadStream(imagePath).pipe(res);
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
}
