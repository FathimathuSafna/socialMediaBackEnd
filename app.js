import express from "express";
import "dotenv/config";
import connectDB from "./config/connection.js"
import userRoutes from './routes/userRoutes.js'
import cors from "cors";

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies to be sent
};


const app = express();
app.use(cors(corsOptions));

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello world !");
});


app.use("/user",userRoutes)
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

connectDB()

