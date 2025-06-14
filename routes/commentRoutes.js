import express from 'express';
import { createComment,getAllComments,editComment,deleteComment } from '../controller/commentController.js';
import protect from '../middleWare/userMiddleWare.js';

const app = express.Router();
app.route('/').post(protect,createComment).delete(deleteComment); 
app.route('/:id').get(getAllComments).put(protect,editComment)
export default app