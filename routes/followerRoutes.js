import express from 'express';
import { follow,unfollow,getFollowing,getNonFollowings,getFollowers } from '../controller/followerController.js';
import protect from '../middleWare/userMiddleWare.js'

const app = express.Router()
app.route('/').post(protect,follow).delete(unfollow).get(protect,getNonFollowings)
app.route('/following').get(protect,getFollowing)
app.route('/follower').get(protect,getFollowers)


export default app