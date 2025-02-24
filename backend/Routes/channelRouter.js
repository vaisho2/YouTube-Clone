import { validChannels } from "../Models/channel.js";
import { validVideos } from "../Models/videos.js";

export function channelRouter(server) {
  server.get("/channel/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
      const channelDetails = await validChannels.findOne({ ownerId: userId });

      if (!channelDetails) {
        return res.status(400).json({ error: "Channel not found" });
      }

      return res.status(200).json(channelDetails);
    } catch (error) {
      return res.status(400).json({ error: "Failed to fetch channel details" });
    }
  });

  server.get("/getChannel/:channelId", async (req, res) => {
    const channelId = req.params.channelId;

    try {
      const channelDetails = await validChannels.findOne({ _id: channelId });

      if (!channelDetails) {
        return res.status(400).json({ error: "Channel not found" });
      }

      return res.status(200).json(channelDetails);
    } catch (error) {
      return res.status(400).json({ error: "Failed to fetch channel details" });
    }
  });

  server.put("/channel/:channelId", async (req, res) => {
    const channelId = req.params.channelId;
    const { previewChannelName, previewChannelThumbnail } = req.body;

    try {
      const result = await validChannels.updateOne(
        { _id: channelId },
        {
          $set: {
            name: previewChannelName,
            profilePic: previewChannelThumbnail,
          },
        }
      );

      const result2 = await validVideos.updateMany(
        { channelId: channelId },
        {
          $set: {
            channelName: previewChannelName,
            channelPhoto: previewChannelThumbnail,
          },
        }
      );

      if (!result.acknowledged) {
        return res.status(400).json({ message: "Channel not found" });
      }

      res.status(200).json({ message: "Updated successfully", result });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "An error occurred while updating the channel",
        error: error.message,
      });
    }
  });

  server.post("/channel/add", async (req, res) => {
    const channelDetails = req.body;

    try {
      const newChannel = await validChannels.create(channelDetails);

      if (newChannel) {
        return res
          .status(200)
          .json({ message: "New channel created", newChannel });
      } else {
        return res.status(400).json({ message: "Could not create channel" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "An error occurred while creating the channel",
        error: error.message,
      });
    }
  });
}
