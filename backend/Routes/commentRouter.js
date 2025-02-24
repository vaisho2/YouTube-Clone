import { validComments } from "../Models/comments.js";
import jwt from "jsonwebtoken";
function authenticateUser(req, res, next) {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer")) {
    return res.status(403).json({ message: "no auth token provided" });
  }
  const token = header.split(" ")[1];
  jwt.verify(token, "Srinivas_Secret_Key", (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Invalid auth token" });
    } else {
      next();
    }
  });
}

export function commentRouter(server) {
  server.get("/comments/:videoId", async (req, res) => {
    const videoId = req.params.videoId;

    try {
      const comments = await validComments.find({ videoId: videoId });
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving comments",
        error: error.message,
      });
    }
  });

  server.post("/comments/add", authenticateUser, async (req, res) => {
    const comment = req.body;

    try {
      const newComment = await validComments.create(comment);

      if (!newComment) {
        return res.status(400).json({ message: "Something went wrong" });
      } else {
        return res.status(200).json(newComment);
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while adding the comment",
        error: error.message,
      });
    }
  });

  server.put("/comments/update", authenticateUser, async (req, res) => {
    const { commentId, newComment } = req.body;

    try {
      const result = await validComments.updateOne(
        { _id: commentId },
        { $set: { comment: newComment } }
      );

      if (!result.acknowledged) {
        return res.status(400).json({ message: "Comment not found" });
      } else {
        return res
          .status(200)
          .json({ message: "Updated successfully", newComment });
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while updating the comment",
        error: error.message,
      });
    }
  });

  server.delete(
    "/comments/delete/:commentId",
    authenticateUser,
    async (req, res) => {
      const commentId = req.params.commentId;

      try {
        const deleteComment = await validComments.deleteOne({ _id: commentId });

        if (deleteComment.deletedCount === 0) {
          return res.status(400).json({ message: "Comment not found" });
        } else {
          return res.status(200).json({ message: "Deleted successfully" });
        }
      } catch (error) {
        return res.status(500).json({
          message: "An error occurred while deleting the comment",
          error: error.message,
        });
      }
    }
  );
}
