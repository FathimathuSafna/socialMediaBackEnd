import express from 'express';
import {createPost,getAllPosts,getFollowerPosts,deletePost} from '../controller/postController.js'
import protect from '../middleWare/userMiddleWare.js'

const app = express.Router()
app.route('/').post(protect,createPost).get(protect,getAllPosts).delete(protect,deletePost)
app.route('/following').get(protect,getFollowerPosts)

export default app