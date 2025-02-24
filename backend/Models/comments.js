import mongoose, { mongo } from "mongoose";

const commentsModel = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  channelPp: {
    type: String,
    required: true,
  },
});

export const validComments = mongoose.model("validComments", commentsModel);