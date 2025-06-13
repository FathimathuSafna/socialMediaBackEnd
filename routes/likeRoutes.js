import express from 'express';
import {likePost} from '../controller/likeController.js';

const app = express.Router();

app.route('/').post(likePost)

export default app;