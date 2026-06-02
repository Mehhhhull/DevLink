import express from "express";
import { authMiddleware } from '../middlewares/auth.middlewares.js';
import { evaluateIdea } from '../controllers/aiJudge.controller.js';

const aiJudgeRouter = express.Router();

aiJudgeRouter.post("/evaluate-idea", authMiddleware, evaluateIdea);

export default aiJudgeRouter;