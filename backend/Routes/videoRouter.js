import { validVideos } from "../Models/videos.js";

export function videoRouter(server) {
  server.post("/videos/add", async (req, res) => {
    const videoData = req.body;

    try {
      const newVideo = await validVideos.create(videoData);

      if (newVideo) {
        return res.status(200).json({ message: "Done", newVideo });
      } else {
        return res.status(400).json({ message: "Could not create video" });
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while adding the video",
        error: error.message,
      });
    }
  });

  server.get("/videos", async (req, res) => {
    try {
      const allVideos = await validVideos.find({});
      return res.status(200).json(allVideos);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving videos",
        error: error.message,
      });
    }
  });

  server.get("/videos/:videoId", async (req, res) => {
    const videoId = req.params.videoId;

    try {
      const videoData = await validVideos.findOne({ _id: videoId });

      if (videoData) {
        return res.status(200).json(videoData);
      } else {
        return res
          .status(404)
          .json({ message: "Could not find any matching video" });
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving the video",
        error: error.message,
      });
    }
  });

  server.put("/videos/:videoId", async (req, res) => {
    const videoId = req.params.videoId;
    const {
      previewTitle,
      previewYtUrl,
      previewTags,
      previewThumbnail,
      previewDescription,
      previewDuration,
    } = req.body;

    try {
      const result = await validVideos.updateOne(
        { _id: videoId },
        {
          $set: {
            title: previewTitle,
            ytUrl: previewYtUrl,
            Tag: previewTags,
            thumbnail: previewThumbnail,
            description: previewDescription,
            duration: previewDuration > 5999 ? 5999 : previewDuration,
          },
        }
      );

      if (!result.acknowledged) {
        return res.status(400).json({ message: "Video not found" });
      } else {
        return res.status(200).json({ message: "Updated successfully" });
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while updating the video",
        error: error.message,
      });
    }
  });

  server.delete("/videos/:videoId", async (req, res) => {
    const videoId = req.params.videoId;

    try {
      const action = await validVideos.deleteOne({ _id: videoId });

      if (action.deletedCount === 0) {
        return res.status(400).json({ message: "Video not found" });
      } else {
        return res.status(200).json({ message: "Deleted successfully" });
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while deleting the video",
        error: error.message,
      });
    }
  });

  server.get("/videos/channel/:channelId", async (req, res) => {
    const channelId = req.params.channelId;

    try {
      const videoData = await validVideos.find({ channelId: channelId });

      return res.status(200).json(videoData);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving videos",
        error: error.message,
      });
    }
  });

  server.get("/videos/search/:key", async (req, res) => {
    const filteredVideos = [];
    const key = req.params.key.toLowerCase();

    try {
      const allVideos = await validVideos.find({});

      for (let video of allVideos) {
        let title = video.title.toLowerCase();
        if (title.includes(key)) {
          filteredVideos.push(video);
        }
      }

      return res.status(200).json(filteredVideos);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while searching for videos",
        error: error.message,
      });
    }
  });
}
