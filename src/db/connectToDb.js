import mongoose from "mongoose";

export async function connectToDb() {
  try {
  await mongoose.connect('mongodb+srv://asabadeanu:Zv5mhJG3Mce1BWWw@cluster0.aivma.mongodb.net/task-pro-db');
  console.log("Database connection successful");

} catch (error) {
    console.error(error);
    process.exit(1);
}
}

export default connectToDb