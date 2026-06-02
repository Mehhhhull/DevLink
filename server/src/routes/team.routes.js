import express from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import {
  createTeam,
  getTeamById,
  getCreatorTeams,
  getOpenTeams,
  getTeamSeekers,
  inviteSeeker,
  getInvitations,
  respondToInvitation,
  setTeamPreference,
  deleteTeam,
} from "../controllers/team.controller.js";

const teamRouter = express.Router();

teamRouter.post("/preference", authMiddleware, setTeamPreference);
teamRouter.post("/create", authMiddleware, createTeam);
teamRouter.get("/seekers", authMiddleware, getTeamSeekers);
teamRouter.get("/my-teams", authMiddleware, getCreatorTeams);
teamRouter.get("/open", authMiddleware, getOpenTeams);
teamRouter.get("/:teamId", authMiddleware, getTeamById);
teamRouter.post("/:teamId/invite", authMiddleware, inviteSeeker);
teamRouter.delete("/:teamId", authMiddleware, deleteTeam);
teamRouter.get("/invitations", authMiddleware, getInvitations);
teamRouter.post("/invitations/:invitationId/respond", authMiddleware, respondToInvitation);

export default teamRouter;
