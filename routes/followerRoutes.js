import express from 'express';
import { follow,unfollow,getFollowing,getFollowers } from '../controller/followerController.js';
import protect from '../middleWare/userMiddleWare.js'

const app = express.Router()
app.route('/').post(follow).delete(unfollow)
app.route('/:id').get(getFollowers)
app.route('/following/:id').get(getFollowing)

export default app