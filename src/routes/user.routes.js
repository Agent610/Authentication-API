import express from "express";
import { getProfile } from "../controllers/user.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);

export default router;
