import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";

import { connectDB } from "./config/db.js";
import userRoute from "./routes/user.routes.js";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import songRoute from "./routes/song.route.js";
import albumRoute from "./routes/album.route.js";
import statsRoute from "./routes/stats.route.js";
import { initializeSocket } from "./config/socket.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const httpServer = createServer(app);
initializeSocket(httpServer);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json()); // to parse the json data
app.use(clerkMiddleware()); // this will get auth to req object =>req.auth.userId
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, //10MB max
    },
  })
);

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/songs", songRoute);
app.use("/api/albums", albumRoute);
app.use("/api/stats", statsRoute);

//error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`);
  });
});
