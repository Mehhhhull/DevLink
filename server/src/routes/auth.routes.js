import express from "express";
import { googleAuth, logout, completeOnboarding, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.get("/logout", logout);

// Protected onboarding/profile routes
authRouter.post("/complete-onboarding", authMiddleware, completeOnboarding);
authRouter.get("/profile", authMiddleware, getProfile);
authRouter.put("/profile", authMiddleware, updateProfile);

export default authRouter;