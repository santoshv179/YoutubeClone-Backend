import Comment from "../models/commentModel.js";

// Create comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { videoId } = req.params;

    if (!text)
      return res.status(400).json({ message: "Comment text is required" });

    const comment = await Comment.create({
      text,
      videoId,
      createdBy: req.user._id,
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to add comment", error: error.message });
  }
};

// get all comment of a Videos
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ videoId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json(comments);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch comments", error: error.message });
  }
};

// update Comment
// PUT /api/comments/:commentId
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.text = text || comment.text;
    const updated = await comment.save();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment", error: error.message });
  }
};


// Delete a comments

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Check if user is owner of the comment
    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete comment", error: error.message });
  }
};
