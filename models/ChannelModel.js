import mongoose from "mongoose";

const channelShema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  description: {
    type: String,
  },
  channelBanner: {
    type: String,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subscribers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
},
{ timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
