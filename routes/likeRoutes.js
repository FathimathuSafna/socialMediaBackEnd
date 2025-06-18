import express from 'express';
import {likePost} from '../controller/likeController.js';
import protect from '../middleWare/userMiddleWare.js';

const app = express.Router();

app.route('/').post(protect,likePost)

export default app;