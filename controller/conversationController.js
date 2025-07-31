import Conversation from "../modals/messageSchema.js";

const createConversation = async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  try {
    const idsSorted = [senderId, receiverId].sort();
    const conversationId = `${idsSorted[0]}_${idsSorted[1]}`;

    let conversation = await Conversation.findOne({ conversationId });
    if (!conversation) {
      conversation = await Conversation.create({
        conversationId,
        senderId,
        receiverId,
        messages: [],
      });

      if (message) {
        conversation.messages.push({
          senderId,
          receiverId,
          message,
          timestamp: new Date(),
        });
      }
      await conversation.save();
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      msg: "Error creating conversation",
      error,
    });
  }
};

const getConversation = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const conversation = await Conversation.findOne({ conversationId })
      .populate("senderId", "userName")
      .populate("receiverId", "userName")
      .populate("messages.senderId", "userName")
      .populate("messages.receiverId", "userName");
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    return res
      .status(200)
      .json({ message: "conversation fetched", data: conversation.messages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export { createConversation, getConversation };
