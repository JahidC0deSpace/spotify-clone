import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth().userId) {
      res.status(401).json({ message: "Unauthorized - you must be logged in" });
      return;
    }
  } catch (error) {
    console.log("error in auth middleware protectRoute", error);
    res.status(500).json({ message: "internal server error", error });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth().userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
    if (!isAdmin) {
      res.status(403).json({ message: "Unauthorized - you must be an admin" });
      return;
    }
    next();
  } catch (error) {
    console.log("error in auth middleware requireAdmin", error);
    next(error);
  }
};
