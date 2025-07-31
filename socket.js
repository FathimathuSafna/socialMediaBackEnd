import Conversation from "./modals/messageSchema.js";


export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join", (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket joined room: ${conversationId}`);
    });

    socket.on("send_message", async ({ conversationId, senderId, receiverId, message }) => {
      const newMessage = new Message({ conversationId, senderId, receiverId, message });
      await newMessage.save();

      await Conversation.findOneAndUpdate(
        { conversationId },
        {
          $set: { lastMessage: message, lastUpdated: new Date() },
          $addToSet: { participants: [senderId, receiverId] },
        },
        { upsert: true }
      );

      io.to(conversationId).emit("receive_message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
    });
  });
}
