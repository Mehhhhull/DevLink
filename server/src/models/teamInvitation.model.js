import mongoose from "mongoose";

const teamInvitationSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: function() {
      return this.type !== "collaboration";
    },
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
  type: {
    type: String,
    enum: ["team", "collaboration"],
    default: "team",
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
