import express from 'express';
import {createPost,getAllPosts,getFollowerPosts,deletePost,getPostLikeCount} from '../controller/postController.js'
import protect from '../middleWare/userMiddleWare.js'

const app = express.Router()
app.route('/').post(protect,createPost).get(protect,getAllPosts).delete(protect,deletePost)
app.route('/:id').get(getPostLikeCount)
app.route('/following').get(protect,getFollowerPosts)

export default app