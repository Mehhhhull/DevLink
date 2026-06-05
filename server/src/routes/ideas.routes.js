import express from "express";
import {
    createIdea,
    getIdeas,
    getIdeaById,
    toggleLikeIdea,
    addIdeaComment,
    updateIdeaStatus,
} from "../controllers/ideas.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const ideasRouter = express.Router();

ideasRouter.get("/", getIdeas);
ideasRouter.get("/:id", getIdeaById);
ideasRouter.post("/", authMiddleware, createIdea);
ideasRouter.post("/:id/like", authMiddleware, toggleLikeIdea);
ideasRouter.post("/:id/comments", authMiddleware, addIdeaComment);
ideasRouter.patch("/:id/status", authMiddleware, updateIdeaStatus);

export default ideasRouter;
