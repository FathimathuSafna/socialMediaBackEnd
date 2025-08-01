import Conversation from "./modals/messageSchema.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`🟢 Socket connected: ${socket.id} by user ${socket.user.id}`);

    // ✅ Have the user join a room named after their own ID upon connection.
    socket.join(socket.user.id);

    socket.on("join", (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room: ${conversationId}`);
    });

    socket.on("send_message", async ({ receiverId, message }) => {
      try {
        const senderId = socket.user.id;
        const ids = [senderId, receiverId].sort();
        const conversationId = `${ids[0]}_${ids[1]}`;

        const newMessage = {
          senderId,
          receiverId,
          message,
          timestamp: new Date(),
        };

        const payload = {
          ...newMessage,
          conversationId,
        };
        io.to(conversationId).emit("receive_message", payload); 
        
        // Save the message to the database after emitting
        await Conversation.findOneAndUpdate(
          { conversationId },
          { $push: { messages: newMessage } },
          { upsert: true, new: true }
        );

      } catch (err) {
        console.error("Error in send_message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
}