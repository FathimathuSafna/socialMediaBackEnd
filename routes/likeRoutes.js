import express from "express";
import { likePost, likeUsers } from "../controller/likeController.js";
import protect from "../middleWare/userMiddleWare.js";

const app = express.Router();

app.route("/").post(protect, likePost)
app.route('/:id').get(likeUsers)

export default app;
