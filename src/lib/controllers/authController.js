import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.js";
// import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const secretForToken = process.env.TOKEN_SECRET;

const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET";

const authController = {
  login,
  validateJWT,
  signup,
  getPayloadFromJWT,
  generateGoogleToken,
  refreshAccessToken,
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

  if (!user) throw new Error("Email or password is incorrect");

  const isMatching = await bcrypt.compare(password, user.password);
  if (!isMatching) throw new Error("Email or password is incorrect");

  const accessToken = jwt.sign({ id: user._id }, secretForToken, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, {
    expiresIn: "7d",
  });

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL || null,
    },
  };
}

export async function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = jwt.sign({ id: user._id }, secretForToken, {
      expiresIn: "1h",
    });

    return newAccessToken;
  } catch (error) {
    throw new Error("Refresh token expired or invalid");
  }
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

async function generateGoogleToken(user) {
  const token = jwt.sign({ id: user._id, email: user.email }, secretForToken, {
    expiresIn: "1h",
  });

  await User.findByIdAndUpdate(user._id, { token });

  return token;
}

export default authController;
