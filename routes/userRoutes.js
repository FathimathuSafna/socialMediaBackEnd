import express from 'express';
import { userSignup,verifyOtp,userLogin,getAllUsers,updateDetails,getUserDetails } from '../controller/userController.js';
import protect from '../middleWare/userMiddleWare.js'
const app = express.Router()

app.route('/').post(userSignup).get(protect,getAllUsers).put(protect,updateDetails)
app.route('/verify').post(verifyOtp)
app.route('/login').post(userLogin)
app.route("/:userName").get(getUserDetails)

export default app