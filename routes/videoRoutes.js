import express from "express";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getUserVideos,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createVideo);           // POST /app/videos
router.get("/", getAllVideos);                    // GET /app/videos
router.get("/:id", getVideoById);                 // GET /app/videos/:id
router.put("/:id", protect, updateVideo);         // PUT /app/videos/:id
router.delete("/:id", protect, deleteVideo);      // DELETE /app/videos/:id

router.get('/user/:userId', getUserVideos); // This route handles user-wise video list

export default router;
