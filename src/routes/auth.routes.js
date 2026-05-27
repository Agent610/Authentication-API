import express from "express";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { forgotPassword } from "../controllers/auth.controller.js";
import { resetPassword } from "../controllers/auth.controller.js";
import { verifyEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/verifiy-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
