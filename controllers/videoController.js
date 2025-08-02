import Video from "../models/videoModel.js";

// Create a new video
//  POST /api/videos
// access  Private
export const createVideo = async (req, res) => {
  const { title, description, url, thumbnail } = req.body;

  try {
    const video = await Video.create({
      title,
      description,
      url,
      thumbnail,
      createdBy: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all videos
//  GET /api/videos
// access  Public
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("createdBy", "name email");
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single video by ID
//  GET /api/videos/:id
//  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("createdBy", "name email");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update or Edit a video
// PUT /api/videos/:id
// Private (Only owner)
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this video" });
    }

    const { title, description, url, thumbnail } = req.body;

    video.title = title || video.title;
    video.description = description || video.description;
    video.url = url || video.url;
    video.thumbnail = thumbnail || video.thumbnail;

    const updatedVideo = await video.save();
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a video
// DELETE /api/videos/:id
// @access  Private (Only owner)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await video.deleteOne();  // ✅ Use this instead of remove
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete Video Error:", error);  // Add logging
    res.status(500).json({ message: "Server error" });
  }
};

// Get videos uploaded by a specific user
export const getUserVideos = async (req ,res) =>{
  try{

    // user ID from the URL params
    const userId = req.params.userId;

    // Find all videos where 'user' field matches the given userId
    const videos = await Video.find({ createdBy: userId }).populate("createdBy", "username");
    
    
    if (!videos || videos.length === 0) {
      return res.status(404).json({ message: 'No videos found for this user.' });
    }

   //Send response with all videos created by the user
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching user videos:', error.message);
    res.status(500).json({ message: 'Server error while fetching videos.' });
  }
}
