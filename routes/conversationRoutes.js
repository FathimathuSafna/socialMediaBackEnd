import express from 'express'
import { createConversation , getConversation ,getMsgUser } from '../controller/conversationController.js'
import protect from '../middleWare/userMiddleWare.js';

const app = express.Router()

app.route('/').post(protect,createConversation).get(protect,getMsgUser)
app.route('/:userName').get(protect,getConversation)

export default app