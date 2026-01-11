import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.auth().userId;
    const users = await User.find({ clerkId: { $ne: currentUserId } });
    res.status(200).json(users);
  } catch (error) {
    console.log("error in getAllUsers", error);
    next(error);
  }
};

export const getMessage = async (req, res, next) => {
  try {
    const myId = req.auth().userId;
    const { userId } = req.params;

    const message = await Message.find({
      $or: [
        { senderId: userId, receiverId: myId },
        { senderId: myId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(message);
  } catch (error) {
    console.log("error in getMessage", error);
    next(error);
  }
};
