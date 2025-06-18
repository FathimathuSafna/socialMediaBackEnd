import express from 'express';
import { createComment,getAllComments,editComment,deleteComment } from '../controller/commentController.js';
import protect from '../middleWare/userMiddleWare.js';

const app = express.Router();
app.route('/').post(protect,createComment)
app.route('/:id').get(protect,getAllComments).put(protect,editComment).delete(protect,deleteComment); 
export default app