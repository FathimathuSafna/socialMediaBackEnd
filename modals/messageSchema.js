import mongoose from "mongoose";
var Schema = mongoose.Schema

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [messageSchema],
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
