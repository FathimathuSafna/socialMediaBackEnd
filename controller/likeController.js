import Likes from "../modals/likesSchema.js";

const likePost = async (req, res) => {
  console.log(req.body);
  const userid = req.user._id;
  const { postId } = req.body;

  try {
    const existingLike = await Likes.findOne({
      userId: userid,
      postId: postId,
      status: true,
    });
    if (existingLike) {
      await Likes.deleteOne({
        userId: userid,
        postId: postId,
      });
      return res.status(200).json({
        status: false,
        message: "Like removed successfully",
      });
    }
    // If it doesn't exist, create a new like
    const newLike = await Likes.create({
      userId: userid,
      postId: postId,
      status: true,
    });
    res.status(201).json({
      status: true,
      message: "Post liked successfully",
      data: newLike,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: "Error liking post",
      error: error.message,
    });
  }
};

export { likePost };
