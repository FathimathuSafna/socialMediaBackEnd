import express from 'express'
import { createConversation , getConversation  } from '../controller/conversationController.js'
import protect from '../middleWare/userMiddleWare.js';

const app = express.Router()

app.route('/').post(protect,createConversation)
app.route('/:userName').get(protect,getConversation)

export default app