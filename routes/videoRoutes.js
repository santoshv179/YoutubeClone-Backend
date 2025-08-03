import express from "express";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getUserVideos,
  searchVideosByTitle,
  getVideosByCategory,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Search & Category filters first (order matters)
router.get("/search", searchVideosByTitle);
router.get("/category/:category", getVideosByCategory);

// CRUD routes
router.get("/", getAllVideos);
router.post("/", protect, createVideo);
router.get("/user", protect, getUserVideos);
router.get("/:id", getVideoById);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;
