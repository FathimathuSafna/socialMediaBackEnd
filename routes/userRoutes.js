import express from 'express';
import { userSignup,verifyOtp,userLogin,getAllUsers,updateDetails } from '../controller/userController.js';
import protect from '../middleWare/userMiddleWare.js'
const app = express.Router()

app.route('/').post(userSignup).get(getAllUsers)
app.route('/verify').post(verifyOtp)
app.route('/login').post(userLogin)
app.route("/:id").put(protect,updateDetails)

export default app