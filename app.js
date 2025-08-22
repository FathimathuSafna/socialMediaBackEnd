import express from "express";
import "dotenv/config";
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

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://appmosphere.safna.online"
];

// Dynamic CORS for Express
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};

const app = express();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Pre-flight support

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

// Dynamic CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket.IO CORS: Origin not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// JWT Middleware for Socket.IO
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

// Start socket handling
socketHandler(io);

// Routes
app.get("/", (req, res) => {
  res.send("Hello world !");
});

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/follow", followerRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);
app.use("/message", conversationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect DB
connectDB();
