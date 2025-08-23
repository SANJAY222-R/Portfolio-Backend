import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/authRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import { createUsersTable } from "./db.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "views")));

app.use("/api/auth", authRoutes);

const startServer = async () => {
  await createUsersTable();
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
};

startServer().catch(err => console.error("Failed to start server:", err));
