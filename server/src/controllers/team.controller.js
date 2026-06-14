import Team from "../models/team.model.js";
import TeamInvitation from "../models/teamInvitation.model.js";
import User from "../models/user.model.js";

export const createTeam = async (req, res) => {
  try {
    const { name, description, projectDetails, requiredSkills, preferredRoles, maxMembers } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = await Team.create({
      name,
      description,
      projectDetails,
      requiredSkills,
      preferredRoles,
      maxMembers,
      creator: req.user._id,
      members: [req.user._id],
    });

    if (req.user.teamRole !== "create") {
      req.user.teamRole = "create";
      await req.user.save();
    }

    return res.status(201).json(team);
  } catch (error) {
    return res.status(500).json({ message: `Create team error ${error}` });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate("creator", "username fullName email teamRole")
      .populate("members", "username fullName email teamRole")
      .populate("invited", "username fullName email teamRole");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.status(200).json(team);
  } catch (error) {
    return res.status(500).json({ message: `Fetch team error ${error}` });
  }
};

export const getCreatorTeams = async (req, res) => {
  try {
    const teams = await Team.find({ creator: req.user._id }).populate("members", "username fullName");
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({ message: `Fetch teams error ${error}` });
  }
};

export const getOpenTeams = async (req, res) => {
  try {
    const teams = await Team.find({ status: "open", creator: { $ne: req.user._id } })
      .populate("creator", "username fullName")
      .populate("members", "username fullName");
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({ message: `Fetch open teams error ${error}` });
  }
};

export const getTeamSeekers = async (req, res) => {
  try {
    const seekers = await User.find({ teamRole: "find" }).select(
      "username fullName email bio skills techStack preferredRoles experienceLevel availability location socials college"
    );
    return res.status(200).json(seekers);
  } catch (error) {
    return res.status(500).json({ message: `Fetch seekers error ${error}` });
  }
};

export const inviteSeeker = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Invite userId is required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the team creator can invite members" });
    }

    if (team.status === "closed") {
      return res.status(400).json({ message: "Team is closed and cannot receive invitations" });
    }

    const user = await User.findById(userId);
    if (!user || user.teamRole !== "find") {
      return res.status(400).json({ message: "The invited user must be a team seeker" });
    }

    const existingInvite = await TeamInvitation.findOne({ team: teamId, user: userId });
    if (existingInvite) {
      return res.status(400).json({ message: "An invitation already exists for this user" });
    }

    const invitation = await TeamInvitation.create({
      team: teamId,
      user: userId,
      invitedBy: req.user._id,
    });

    if (!team.invited.some((id) => id.toString() === userId.toString())) {
      team.invited.push(userId);
      await team.save();
    }

    return res.status(201).json(invitation);
  } catch (error) {
    return res.status(500).json({ message: `Invite seeker error ${error}` });
  }
};

export const getInvitations = async (req, res) => {
  try {
    console.log("Fetching invitations for user:", req.user._id);
    
    const sentInvitations = await TeamInvitation.find({ invitedBy: req.user._id })
      .populate("team", "name status")
      .populate("user", "username fullName email");

    const receivedInvitations = await TeamInvitation.find({ user: req.user._id })
      .populate("team", "name status")
      .populate("invitedBy", "username fullName email");

    console.log("Found invitations:", { sent: sentInvitations.length, received: receivedInvitations.length });
    return res.status(200).json({ sentInvitations, receivedInvitations });
  } catch (error) {
    console.error("Get invitations error:", error);
    return res.status(500).json({ message: `Fetch invitations error: ${error.message}` });
  }
};

export const setTeamPreference = async (req, res) => {
  try {
    const { teamRole } = req.body;
    if (!["find", "create", "none"].includes(teamRole)) {
      return res.status(400).json({ message: "teamRole must be 'find', 'create', or 'none'" });
    }

    req.user.teamRole = teamRole;
    await req.user.save();

    return res.status(200).json({ message: "Team preference updated", teamRole });
  } catch (error) {
    return res.status(500).json({ message: `Set team preference error ${error}` });
  }
};

export const respondToInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { response } = req.body;

    if (!["accepted", "rejected"].includes(response)) {
      return res.status(400).json({ message: "Response must be 'accepted' or 'rejected'" });
    }

    const invitation = await TeamInvitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    if (invitation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only respond to your own invitations" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation has already been responded to" });
    }

    invitation.status = response;
    invitation.respondedAt = new Date();
    await invitation.save();

    if (response === "accepted") {
      const team = await Team.findById(invitation.team);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      if (!team.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
        team.members.push(req.user._id);
      }

      if (team.maxMembers && team.members.length >= team.maxMembers) {
        team.status = "closed";
      }

      await team.save();
    }

    return res.status(200).json(invitation);
  } catch (error) {
    return res.status(500).json({ message: `Respond invitation error ${error}` });
  }
};

export const getTeammates = async (req, res) => {
  try {
    // More lenient query - show all users except current user
    const teammates = await User.find({ 
      _id: { $ne: req.user._id }
    }).select(
      "username fullName email bio skills techStack preferredRoles experienceLevel availability location socials college avatar projects hackathonHistory gender teamRole onboardingCompleted"
    );

    console.log(`Found ${teammates.length} potential teammates`);

    // Add computed fields for better UI
    const enhancedTeammates = teammates.map(teammate => ({
      ...teammate.toObject(),
      avatar: teammate.fullName ? teammate.fullName.split(" ").map(s => s[0]).slice(0,2).join("") : "U",
      rating: (Math.random() * 1 + 4).toFixed(1), // Mock rating between 4.0-5.0
      projectCount: teammate.projects ? teammate.projects.length : Math.floor(Math.random() * 15) + 1
    }));

    return res.status(200).json(enhancedTeammates);
  } catch (error) {
    console.error("Fetch teammates error:", error);
    return res.status(500).json({ message: `Fetch teammates error ${error}` });
  }
};

export const sendCollaborationRequest = async (req, res) => {
  try {
    const { teammateId } = req.params;

    console.log("Collaboration request:", { teammateId, userId: req.user._id });

    if (!teammateId) {
      return res.status(400).json({ message: "Teammate ID is required" });
    }

    const teammate = await User.findById(teammateId);
    if (!teammate) {
      return res.status(404).json({ message: "Teammate not found" });
    }

    if (teammate._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot send a collaboration request to yourself" });
    }

    // Check if invitation already exists
    const existingInvite = await TeamInvitation.findOne({ 
      invitedBy: req.user._id, 
      user: teammateId,
      type: "collaboration",
      status: "pending"
    });

    if (existingInvite) {
      return res.status(400).json({ message: "Collaboration request already sent" });
    }

    // Create collaboration invitation
    const invitation = await TeamInvitation.create({
      user: teammateId,
      invitedBy: req.user._id,
      type: "collaboration",
      status: "pending"
    });

    console.log("Collaboration invitation created:", invitation);

    return res.status(201).json({ 
      success: true,
      message: "Collaboration request sent successfully",
      invitation 
    });
  } catch (error) {
    console.error("Send collaboration request error:", error);
    return res.status(500).json({ message: `Send collaboration request error: ${error.message}` });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the team creator can delete this team" });
    }

    await Team.findByIdAndDelete(teamId);
    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Delete team error ${error}` });
  }
};
