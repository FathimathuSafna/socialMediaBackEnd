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
import jwt from 'jsonwebtoken'; // 👈 Make sure to import jwt

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http server for socket.io
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ ADD THIS SOCKET.IO MIDDLEWARE
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Authentication Error: No token provided."));
  }

  // Use the same secret key as your protect middleware
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication Error: Invalid token."));
    }
    // The decoded token (which contains the user 'id') is attached to the socket.
    socket.user = decoded;
    next();
  });
});

// Socket event handling
socketHandler(io);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello world !");
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