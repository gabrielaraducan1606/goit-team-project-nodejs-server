import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.js";
// import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const secretForToken = process.env.TOKEN_SECRET;

const authController = {
  login,
  validateJWT,
  signup,
  getPayloadFromJWT,
  updateProfile,
};

// REGISTER function
export async function signup(data) {
  const { email, password, name } = data; // Adaugă name
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      theme: "violet",
      token: null,
      name: name, // Adaugă name
    });

    return newUser;
  } catch (error) {
    console.error("Signup error:", error); // Adaugă log
    throw error;
  }
}

// LOGIN function
export async function login(data) {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email or password is incorrect");
  }

  const isMatching = await bcrypt.compare(password, user.password);
  if (!isMatching) {
    throw new Error("Email or password is incorrect");
  }

  const token = jwt.sign({ id: user._id, email: user.email }, secretForToken, {
    expiresIn: "1h",
  });

  await User.findByIdAndUpdate(user._id, { token });

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL || null,
    },
  };
}

// VALIDATION JWT  function
export function validateJWT(token) {
  try {
    const decoded = jwt.verify(token, secretForToken);
    return decoded;
  } catch (err) {
    console.error("JWT validation error:", err.message);
    return null;
  }
}

// OBTAIN PAYLOAD-ULUI FROM JWT function
export async function getPayloadFromJWT(token) {
  try {
    return jwt.verify(token, secretForToken);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
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

export default authController;
