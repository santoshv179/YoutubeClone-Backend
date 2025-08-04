import Video from "../models/videoModel.js";

// Create Video
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, category } = req.body;

    const video = await Video.create({
      title,
      description,
      url: videoUrl,
      thumbnail,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to create video", error: error.message });
  }
};

// Get All Videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Failed to get videos", error: error.message });
  }
};

// Get Single Video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("createdBy", "username email");
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Failed to get video", error: error.message });
  }
};

// Update Video
export const updateVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, category } = req.body;

    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only owner can update
    if (video.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this video" });
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.url = videoUrl || video.url;
    video.thumbnail = thumbnail || video.thumbnail;
    video.category = category || video.category;

    const updatedVideo = await video.save();
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: "Failed to update video", error: error.message });
  }
};

// Delete Video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await video.deleteOne();
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete video", error: error.message });
  }
};

// Get Videos by User
export const getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ createdBy: req.user._id }).populate("createdBy", "username email");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user videos", error: error.message });
  }
};

// Search Videos by Title
export const searchVideosByTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) return res.status(400).json({ message: "Title is required for search" });

    const videos = await Video.find({
      title: { $regex: title, $options: "i" },
    }).populate("createdBy", "username email");

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// Get Videos by Category
export const getVideosByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) return res.status(400).json({ message: "Category is required" });

    const videos = await Video.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    }).populate("createdBy", "username email");

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch videos", error: error.message });
  }
};
