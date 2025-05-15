import express from 'express';
import {createPost,getAllPosts,getFollowerPosts} from '../controller/postController.js'
import protect from '../middleWare/userMiddleWare.js'

const app = express.Router()
app.route('/').post(protect,createPost).get(getAllPosts)
app.route('/:id').get(getFollowerPosts)

export default app