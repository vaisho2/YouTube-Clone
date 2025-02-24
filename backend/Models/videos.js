import mongoose from "mongoose";

const videoObjModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ytUrl: {
    type: String,
    required: true,
  },
  Tag: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  channelPhoto: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  dislikes: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
});

export const validVideos = mongoose.model("videos", videoObjModel);
