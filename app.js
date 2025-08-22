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

const app = express();
const server = http.createServer(app);

// ✅ Allowed Origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://appmosphere.safna.online"
];

// ✅ CORS Options for Express
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser clients (like mobile apps, Postman)
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: This origin is not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
};

// ✅ Apply CORS Middleware
app.use(cors(corsOptions));

// ✅ Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Socket.IO CORS: This origin is not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// ✅ Socket.IO JWT Auth Middleware
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

// ✅ Socket Event Handling
socketHandler(io);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("Hello world !");
});

// ✅ Routes
app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/follow", followerRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);
app.use("/message", conversationRoutes);

// ✅ Global Error Handler (optional, for catching CORS or other errors)
app.use((err, req, res, next) => {
  if (err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Connect DB and Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
