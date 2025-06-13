import Comment from "../modals/commentsSchema.js";

const createComment = async (req, res) => {
  let userId = req.user._id; // Assuming user ID is passed from middleware
  const { postId, commentText } = req.body;
  // const userId = req.user._id; // Assuming user ID is passed from middleware

  try {
    const newComment = await Comment.create({
      userId,
      postId: postId,
      commentText: commentText,
    });

    res.status(201).json({
      status: true,
      message: "Comment created successfully",
      data: newComment,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Error creating comment",
      error: error.message,
    });
  }
};

const getAllComments = async (req, res) => {
  const postId = req.params.id; // Assuming postId is passed as a URL parameter
  try {
    const comments = await Comment.find({ postId: postId })
    .populate(
      "userId",
      "userName"
    );
    const formattedComments = comments.map((c) => ({
      userName: c.userId.userName,
      commentText: c.commentText,
    }));
    res.status(200).json({
      status: true,
      message: "Comments retrieved successfully",
      data: formattedComments,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Error retrieving comments",
      error: error.message,
    });
  }
};

export { createComment, getAllComments };
