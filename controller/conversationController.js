import Conversation from "../modals/messageSchema.js";
import User from "../modals/userSchema.js";

const createConversation = async (req, res) => {
  const senderId = req.user._id  
  const {  receiverId, message } = req.body;
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
    }
    console.log("messages ", conversation.messages);

    if (message) {
      await Conversation.findOneAndUpdate(
        { conversationId },
        {
          $push: {
            messages: {
              senderId,
              receiverId,
              message,
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );
    }
    console.log("hhhh", conversation);

    return res
      .status(200)
      .json({ message: "Message saved", data: conversation });
  } catch (error) {
    res.status(500).json({
      msg: "Error creating conversation",
      error,
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userName } = req.params;
    const currentUserId = req.user.id;

    // Find the recipient user by userName
    const recipientUser = await User.findOne({ userName });
    if (!recipientUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get both IDs
    const recipientId = recipientUser._id.toString();
    const conversationId = [currentUserId, recipientId].sort().join("_");

    // Fetch the conversation
    const conversation = await Conversation.findOne({ conversationId });

    // Get sender (current user) details
    const senderUser = await User.findById(currentUserId);
    if (!senderUser) {
      return res.status(404).json({ message: "Sender user not found" });
    }

    return res.status(200).json({
      conversationId,
      messages: conversation?.messages || [],
      sender: {
        _id: senderUser._id,
        userName: senderUser.userName,
        name: senderUser.name,
        profileImageUrl: senderUser.profileImageUrl
      },
      recipient: {
        _id: recipientUser._id,
        userName: recipientUser.userName,
        name: recipientUser.name,
        profileImageUrl: recipientUser.profileImageUrl
      }
    });

  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { createConversation, getConversation };
