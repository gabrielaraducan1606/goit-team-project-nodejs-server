import dotenv from "dotenv";
import app from "./src/app.js";
import connectToDb from "./src/db/connectToDb.js";

dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectToDb();
  console.log(" MongoDB connected successfully");
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
