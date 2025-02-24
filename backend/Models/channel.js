import mongoose from "mongoose";
import validator from "validator";
const channelModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
  },
  ownerId: {
    type: String,
    required: true,
  },
  subscribers: {
    type: Number,
    required: true,
  },
});

export const validChannels = mongoose.model("validChannels", channelModel);
