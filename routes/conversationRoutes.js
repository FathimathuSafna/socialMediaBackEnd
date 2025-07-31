import express from 'express'
import { createConversation , getConversation  } from '../controller/conversationController.js'

const app = express.Router()

app.route('/').post(createConversation).get(getConversation)

export default app