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
  const userId = req.user._id; // Assuming user ID is passed from middleware
  const postId = req.params.id; // Assuming postId is passed as a URL parameter
  try {
    const comments = await Comment.find({ postId: postId })
    .populate(
      "userId",
      "userName profilePicture"
    ).populate(
      "postId",
      "description"
    )
    console.log("comments are ......",comments)
    const formattedComments = comments.map((comment) => ({
      userName: comment.userId ? comment.userId.userName : "Unknown User",
      commentId: comment._id,
      commentText: comment.commentText,
      postDescription :comment.postId.description,
      isEditable: comment.userId && comment.userId._id.toString() === userId.toString(),
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

const editComment = async (req, res) => {
  console.log("Editing comment", req.body);
  const userId = req.user._id; 
  const { commentId, commentText } = req.body;

  try {
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({
        status: false,
        message: "Comment not found",
      });
    }

    if (existingComment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to edit this comment",
      });
    }

    // Update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { commentText },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Error updating comment",
      error: error.message,
    });
  }
};


const deleteComment = async (req, res) => {

  const userId = req.user._id;
  const  commentId  = req.params.id; 
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId,
      userId
    );
    if (!deletedComment) {
      return res.status(404).json({
        status: false,
        message: "Comment not found",
      });
    }
    res.status(200).json({
      status: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Error deleting comment",
      error: error.message,
    });
  }
};


export { createComment, getAllComments,editComment, deleteComment };
