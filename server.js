// import dotenv from "dotenv";
// import app from "./src/app.js";
// import mongoose from "mongoose";

// dotenv.config();

// const { DB_HOST, PORT = 5000 } = process.env;

// mongoose
//   .connect(DB_HOST)
//   .then(() => {
//     console.log("Database connection successful");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err.message);
//     process.exit(1);
//   });
import dotenv from "dotenv";
import app from "./src/app.js";
import connectToDb from "./src/db/connectToDb.js";

dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectToDb();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
