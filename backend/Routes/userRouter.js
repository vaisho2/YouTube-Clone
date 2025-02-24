import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validUsers } from "../Models/user.js";
import { validChannels } from "../Models/channel.js";

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

export function userRouter(server) {
  server.get("/user/:userId", authenticateUser, async (req, res) => {
    const userId = req.params.userId;

    try {
      const userDetails = await validUsers.findOne({ _id: userId });

      if (!userDetails) {
        return res.status(404).json({ message: "No user found" });
      }

      return res.status(200).json(userDetails);
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving user details",
        error: error.message,
      });
    }
  });

  server.put(
    "/user/update/channelDetails",
    authenticateUser,
    async (req, res) => {
      const newUserDetails = req.body;
      const userId = newUserDetails["userId"];

      try {
        const existingDetails = await validUsers.findOne({ _id: userId });

        if (!existingDetails) {
          return res.status(404).json({ message: "No user found" });
        }

        return res
          .status(200)
          .json({ message: "Update successful", newUserDetails });
      } catch (error) {
        return res.status(500).json({
          message: "An error occurred while updating user details",
          error: error.message,
        });
      }
    }
  );

  server.post("/user/login", async (req, res) => {
    const userDetails = req.body;

    try {
      const existingUser = await validUsers.findOne({
        email: userDetails.email,
      });

      if (!existingUser) {
        return res.status(400).json({ message: "No user found" });
      } else {
        const checkPassword = await bcrypt.compare(
          userDetails.password,
          existingUser.password
        );

        if (checkPassword) {
          const existingChannel = await validChannels.findOne({
            ownerId: existingUser._id,
          });
          const authToken = jwt.sign(userDetails, "Srinivas_Secret_Key");

          return res.status(200).json({
            authToken,
            existingUser,
            existingChannel,
            message: "Login success",
          });
        } else {
          return res.status(400).json({ message: "Wrong password" });
        }
      }
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred during login",
        error: error.message,
      });
    }
  });

  server.post("/user/signup", async (req, res) => {
    const userDetails = req.body;

    try {
      const existingUser = await validUsers.findOne({
        email: userDetails.email,
      });

      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      userDetails.password = await bcrypt.hash(userDetails.password, 11);
      const newUser = await validUsers.create(userDetails);
      const authToken = jwt.sign(userDetails, "Srinivas_Secret_Key");

      return res.status(200).json({
        authToken,
        newUser,
        message: "SignUp successful",
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred during signup",
        error: error.message,
      });
    }
  });
}
