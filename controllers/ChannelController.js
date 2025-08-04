import Channel from "../models/ChannelModel.js";
import asyncHandler from "express-async-handler";

// Create a new channel
// POST /api/channels
// Private

export const createChannel = asyncHandler(async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  const existingChannel = await Channel.findOne({ channelName });

  if (existingChannel) {
    res.status(400);
    throw new Error("Channel name already exists");
  }
  const channel = await Channel.create({
    channelName,
    description,
    channelBanner,
    owner: req.user._id,
  });

  return res.status(201).json(channel);
});

// get all Channel
export const getAllChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find().populate("owner", "username");
  res.json(channels);
});

//  Get channel by ID
//  GET /api/channels/:channelId
// Public

export const getChannelById = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.channelId)
    .populate("owner", "username")
    .populate("subscribers", "username");

  if (!channel) {
    res.status(404);
    throw new Error("Channel not Found");
  }
  return res.status(200).json(channel);
});

// Update channel
// PUT /api/channels/:channelId
// access Private

export const updateChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);

  if (!channel) {
    res.status(404);
    throw new Error("Channel not Found");
  }
  if (channel.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not the owner of this channel");
  }

  const { channelName, description, channelBanner } = req.body;
  if (channelName) channel.channelName = channelName;
  if (description) channel.description = description;
  if (channelBanner) channel.channelBanner = channelBanner;

  const updatedChannel = await channel.save();
  return res.status(200).json(updatedChannel);
});

// Delete channel
//DELETE /api/channels/:channelId
// access  Private

export const deleteChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);

  if (!channel) {
    res.status(404);
    throw new Error("Channel not found");
  }

  // Ensure the logged-in user is the owner
  if (channel.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You are not the owner of this channel");
  }

  await channel.deleteOne();

  res.status(200).json({ message: "Channel Deleted Successfully" });
});

// Subscribe to a channel
// POST /api/channels/:channelId/subscribe
// access Private

export const subscribeToChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  //    Find the channel
  const channel = await Channel.findById(channelId);

  if (!channel) {
    res.status(404);
    throw new Error("Channel not found");
  }

  if (channel.subscribers.includes(req.user._id)) {
    res.status(400);
    throw new Error("Already subscribed to this channel");
  }

  channel.subscribers.push(req.user._id);
  await channel.save();

  return res.status(200).json({
    message: "Subscribed successfully",
    totalSubscribers: channel.subscribers.length,
  });
});

// Unsubscribe from a channel
//  POST /api/channels/:channelId/unsubscribe
// access  Private

export const unsubscribeFromChannel = asyncHandler(async (req, res) => {
  const channel = await Channel.findById(req.params.channelId);

  if (!channel) {
    res.status(404);
    throw new Error("Channel not found");
  }

  if (!channel.subscribers.includes(req.user._id)) {
    res.status(400);
    throw new Error("You are not subscribed to this channel");
  }

  channel.subscribers = channel.subscribers.filter(
    (userId) => userId.toString() !== req.user._id.toString()
  );

  await channel.save();

  return res
    .status(200)
    .json({
      message: "Unsubscribed successfully",
      totalSubscribers: channel.subscribers.length,
    });
});
