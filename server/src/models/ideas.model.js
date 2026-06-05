import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },
        summary: {
            type: String,
            required: true,
            trim: true,
            maxlength: 350,
        },
        details: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        techStack: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdByName: {
            type: String,
            trim: true,
        },
        createdByEmail: {
            type: String,
            trim: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        comments: [
            new mongoose.Schema(
                {
                    author: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User",
                        required: true,
                    },
                    authorName: {
                        type: String,
                        trim: true,
                    },
                    authorEmail: {
                        type: String,
                        trim: true,
                    },
                    text: {
                        type: String,
                        required: true,
                        trim: true,
                        maxlength: 2000,
                    },
                    type: {
                        type: String,
                        enum: ["comment", "solution"],
                        default: "comment",
                    },
                },
                {
                    timestamps: true,
                }
            ),
        ],
        status: {
            type: String,
            enum: ["open", "in progress", "solved"],
            default: "open",
        },
    },
    {
        timestamps: true,
    }
);

const Idea = mongoose.model("Idea", ideaSchema);

export default Idea;