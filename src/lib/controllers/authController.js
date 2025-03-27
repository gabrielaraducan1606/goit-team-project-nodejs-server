import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import { v4 as uuidv4 } from 'uuid';
import { sendWithSendGrid } from "../utils/sendEmail.js";

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
  updateToken,
  getUserByValidationToken,
};

// export async function signup(data) {
//   const { email, password, name } = data;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       throw new Error("Email already in use");
//     }

//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);
//     const token = uuidv4();

//     const newUser = await User.create({
//       email,
//       password: hashedPassword,
//       theme: "violet",
//       token: null,
//       name: name,
//       verificationToken: token,
//       verify: false,
//     });

//     sendWithSendGrid(email, token);

//     return newUser;
//   } catch (error) {
//     console.error("Signup error:", error);
//     throw error;
//   }
// }

export async function signup(data) {
  const { email, password, name } = data;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const token = uuidv4();

    // Creăm utilizatorul cu statusul verify setat la false
    const newUser = await User.create({
      email,
      password: hashedPassword,
      theme: "violet",
      token: null,  // Nu setăm token-ul până la verificarea email-ului
      name: name,
      verificationToken: token,
      verify: false,  // statusul de verificare e setat la false
    });

    // Trimitem emailul de verificare
    sendWithSendGrid(email, token);

    return newUser;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}


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

  await User.findByIdAndUpdate(user._id, {
    token: accessToken,
    refreshToken: refreshToken,
  });

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

// UPDATE TOKEN FOR VALIDATION function
export async function updateToken(email, token) {
    token = token || uuidv4();
    const updatedUser = await User.findOneAndUpdate(
        { email },
        { verificationToken: token },
        { new: true } 
    );

    if (updatedUser) {
        sendWithSendGrid(email, token);
    }
}

// USER TOKEN VALIDATION function
export async function getUserByValidationToken(token) {
  // Căutăm utilizatorul cu token-ul de verificare și verify: false
  return await User.findOne({ verificationToken: token, verify: false });
}

// export async function getUserByValidationToken(token) {
//     return await User.findOne({ verificationToken: token, verify: false });
// }

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

export function validateJWT(token) {
  try {
    const decoded = jwt.verify(token, secretForToken);
    return decoded;
  } catch (err) {
    console.error("JWT validation error:", err.message);
    return null;
  }
}

export async function getPayloadFromJWT(token) {
  try {
    return jwt.verify(token, secretForToken);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}

async function generateGoogleToken(user) {
  const accessToken = jwt.sign({ id: user._id }, secretForToken, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, {
    expiresIn: "7d",
  });

  await User.findByIdAndUpdate(user._id, {
    accessToken,
    refreshToken,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export default authController;
