import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  projectDetails: {
    type: String,
    trim: true,
  },
  requiredSkills: [String],
  preferredRoles: [String],
  maxMembers: {
    type: Number,
    default: 5,
    min: 1,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  invited: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
},
{
  timestamps: true,
});

const Team = mongoose.model("Team", teamSchema);
export default Team;
