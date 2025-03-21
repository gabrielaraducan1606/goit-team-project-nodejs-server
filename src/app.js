import express from "express";
import logger from 'morgan';
import cors from "./cors.js";
import passport from "passport";
import connectToDb from "./db/connectToDb.js";
import authRoutes from './routes/authRoutes.js'

connectToDb()

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(express.json());
app.use(logger(formatsLogger))
app.use(cors);

app.use(passport.initialize()); 

app.use('/auth', authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "🚀 The Express server is running perfectly!" });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

export default app;
