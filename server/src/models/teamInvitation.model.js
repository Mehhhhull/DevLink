import mongoose from "mongoose";

const teamInvitationSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  respondedAt: Date,
},
{
  timestamps: true,
});

teamInvitationSchema.index({ team: 1, user: 1 }, { unique: true });

const TeamInvitation = mongoose.model("TeamInvitation", teamInvitationSchema);
export default TeamInvitation;
