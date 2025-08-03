import express from "express";
import {protect } from "../middleware/authMiddleware.js";
import { addComment, deleteComment, getCommentsByVideo, updateComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/:videoId", protect, addComment);
router.get("/:videoId", getCommentsByVideo);
router.delete("/:commentId", protect, deleteComment);
router.put("/:commentId", protect, updateComment);

export default router;