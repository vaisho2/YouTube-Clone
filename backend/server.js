import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { commentRouter } from "./Routes/commentRouter.js";
import { userRouter } from "./Routes/userRouter.js";
import { channelRouter } from "./Routes/channelRouter.js";
import { videoRouter } from "./Routes/videoRouter.js";

dotenv.config();

const myServer = express();

myServer.use(express.json());
myServer.use(cors());

const PORT = process.env.PORT || 3000;
myServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in the .env file!");
  process.exit(1); // Stop execution if missing
}

mongoose
  .connect(
    "mongodb+srv://vaish0201:vaish0201@youtubeclone.aa5ug.mongodb.net/YouTubeClone?retryWrites=true&w=majority&appName=YouTubeClone",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    console.log("Database Name:", mongoose.connection.name);
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));

commentRouter(myServer);
userRouter(myServer);
channelRouter(myServer);
videoRouter(myServer);
