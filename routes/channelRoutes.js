import express from "express";
import {
  createChannel,
  getAllChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "../controllers/channelController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllChannels);
router.get("/:channelId", getChannelById);

// Protected
router.post("/", protect, createChannel);
router.put("/:channelId", protect, updateChannel);
router.delete("/:channelId", protect, deleteChannel);

router.post("/:channelId/subscribe", protect, subscribeToChannel);
router.post("/:channelId/unsubscribe", protect, unsubscribeFromChannel);

export default router;
