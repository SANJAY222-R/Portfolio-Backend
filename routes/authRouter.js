import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { registerValidationRules, validate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

router.post("/register", registerValidationRules, validate, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;