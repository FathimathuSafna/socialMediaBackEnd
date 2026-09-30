import express from "express";
import "dotenv/config";
import { v2 as cloudinary } from 'cloudinary';
import connectDB from "./config/connection.js";
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import followerRoutes from './routes/followerRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import socketHandler from "./socket.js";
import jwt from 'jsonwebtoken';

// Configure CORS allowed origins
const allowedOrigins = [
  "https://social-media-ui-phi.vercel.app",
  "https://appmosphere.safna.online",
  "http://localhost:5173",
  "https://e-commerce-ui-gilt.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication Error: No token provided."));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication Error: Invalid token."));
    }
    socket.user = decoded;
    next();
  });
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello world !");
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'qubxw9f3',
  api_key: '641171666156894',
  api_secret: 'jjzD0F2IZuYITfvhsESy1vUz4I0'
});

// Upload route with clock synchronization
app.post('/upload', async (req, res) => {
  const { image, folder } = req.body;
  try {
    if (!image) {
      return res.status(400).json({ status: false, message: 'No image provided' });
    }

    // Synchronize clock dynamically using Google's headers to prevent stale request signature errors
    const timeResponse = await fetch('https://www.google.com');
    const serverDate = new Date(timeResponse.headers.get('date'));
    const correctTimestamp = Math.floor(serverDate.getTime() / 1000);

    const result = await cloudinary.uploader.upload(image, {
      folder: folder || 'general',
      timestamp: correctTimestamp
    });

    res.status(200).json({
      status: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ status: false, error: error.message });
  }
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use('/follow', followerRoutes);
app.use('/comment', commentRoutes);
app.use('/like', likeRoutes);
app.use("/message", conversationRoutes);

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

connectDB();