import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Video description is required"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Video URL is required"],
      match: [/^https?:\/\/.+/, "Please enter a valid video URL"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
      match: [/^https?:\/\/.+/, "Please enter a valid thumbnail URL"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
