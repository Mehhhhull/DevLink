import Idea from "../models/ideas.model.js";

export const createIdea = async (req, res) => {
    try {
        const { title, summary, details, techStack } = req.body;

        if (!title || !summary || !details) {
            return res.status(400).json({
                success: false,
                message: "Title, summary, and details are required.",
            });
        }

        const idea = await Idea.create({
            title,
            summary,
            details,
            techStack: Array.isArray(techStack)
                ? techStack.map((stack) => stack.trim()).filter(Boolean)
                : [],
            createdBy: req.user._id,
            createdByName: req.user.fullName || req.user.username || "Anonymous",
            createdByEmail: req.user.email,
        });

        return res.status(201).json({
            success: true,
            message: "Idea submitted successfully.",
            data: idea,
        });
    } catch (error) {
        console.error("Error creating idea:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find()
            .sort({ createdAt: -1 })
            .populate("createdBy", "username fullName email")
            .lean();

        return res.status(200).json({ success: true, data: ideas });
    } catch (error) {
        console.error("Error fetching ideas:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const getIdeaById = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
            .populate("createdBy", "username fullName email")
            .lean();

        if (!idea) {
            return res.status(404).json({ success: false, message: "Idea not found." });
        }

        return res.status(200).json({ success: true, data: idea });
    } catch (error) {
        console.error("Error fetching idea details:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const toggleLikeIdea = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ success: false, message: "Idea not found." });
        }

        const userId = req.user._id;
        const alreadyLiked = idea.likedBy.some((id) => id.equals(userId));

        if (alreadyLiked) {
            idea.likedBy = idea.likedBy.filter((id) => !id.equals(userId));
            idea.likes = Math.max(0, idea.likes - 1);
        } else {
            idea.likedBy.push(userId);
            idea.likes += 1;
        }

        await idea.save();

        return res.status(200).json({
            success: true,
            message: alreadyLiked ? "Like removed." : "Idea liked.",
            data: { likes: idea.likes, likedBy: idea.likedBy },
        });
    } catch (error) {
        console.error("Error toggling idea like:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const addIdeaComment = async (req, res) => {
    try {
        const { text, type } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "Comment text is required." });
        }

        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ success: false, message: "Idea not found." });
        }

        const comment = {
            author: req.user._id,
            authorName: req.user.fullName || req.user.username || "Anonymous",
            authorEmail: req.user.email,
            text: text.trim(),
            type: type === "solution" ? "solution" : "comment",
        };

        idea.comments.push(comment);

        if (comment.type === "solution") {
            idea.status = "solved";
        }

        await idea.save();

        return res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            data: comment,
        });
    } catch (error) {
        console.error("Error adding idea comment:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

export const updateIdeaStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["open", "in progress", "solved"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value." });
        }

        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ success: false, message: "Idea not found." });
        }

        idea.status = status;
        await idea.save();

        return res.status(200).json({ success: true, message: "Idea status updated.", data: idea });
    } catch (error) {
        console.error("Error updating idea status:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
