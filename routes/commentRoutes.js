import express from 'express';
import { createComment,getAllComments } from '../controller/commentController.js';
import protect from '../middleWare/userMiddleWare.js';

const app = express.Router();
app.route('/').post(protect,createComment)
app.route('/:id').get(getAllComments);

export default app