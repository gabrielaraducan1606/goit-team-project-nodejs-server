import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DB_HOST = process.env.DB_HOST;

if (!DB_HOST) {
  console.error(" Missing DB_HOST in .env.local");
  process.exit(1);
}

const connectToDb = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectToDb;
