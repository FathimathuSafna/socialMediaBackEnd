import express from 'express';
import {likePost,getLikeCount} from '../controller/likeController.js';
import protect from '../middleWare/userMiddleWare.js';

const app = express.Router();

app.route('/').post(protect,likePost)
app.route('/:id').get(protect,getLikeCount); // Assuming you want to use the same handler for getting like count

export default app;