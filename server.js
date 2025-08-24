import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRouter.js";
import { connectAndSyncDb } from "./config/db.js"; 
import User from "./models/authModel.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

const startServer = async () => {
  await connectAndSyncDb();
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
};

startServer().catch(err => console.error("Failed to start server:", err));