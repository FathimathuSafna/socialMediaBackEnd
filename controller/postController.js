import Post from "../modals/postsSchema.js";
import followerDetails from "../modals/followersSchema.js";
import Likes from "../modals/likesSchema.js";

const createPost = async (req, res) => {
  let userId = req.user._id; //id passing from middleware
  const { location, postImageUrl, description, isArchived, status } = req.body;
  try {
    const postDetails = await Post.create({
      userId,
      location,
      postImageUrl,
      description,
      isArchived,
      status,
    });
    res.status(201).json({
      msg: "Post created successfully",
      status: true,
      data: postDetails,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      err,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find().limit(20).populate("userId", "userName profilePictureUrl").lean();
    posts = await Promise.all(
      posts.map(async (post) => {
        try {
          console.log("Fetching likes for post:", post._id);
          const likes = await Likes.find({ postId: post._id, status: true });

          post.likeCount = likes.length;
          if (post.likeCount > 0) {
            post.isLiked = likes.some(
              (like) =>like.userId && like.userId.toString() === req.user._id.toString()
            );
          } else {
            post.isLiked = false;
          }
        } catch (err) {
          console.error("Error fetching likes for post:", err);
          post.likeCount = 0;
          post.isLiked = false;
        }
        return post;
      })
    );
    res.status(200).json({
      msg: "All posts fetched successfully",
      status: true,
      data: posts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(400).json({
      status: false,

      err,
    });
  }
};

const getFollowerPosts = async (req, res) => {
  const id = req.user._id; 
  try {
    const following = await followerDetails.find({ userId: id });

    if (!following || following.length === 0) {
      return res.status(400).json({
        msg: "No following found",
        status: false,
      });
    }

    const followedUserIds = following.map((f) => f.followedUserId);

    const posts = await Post.find({
      userId: { $in: followedUserIds },
    }).populate("userId", "name");

    res.status(200).json({
      msg: "All posts from followed users",
      status: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      status: false,
      error: err.message,
    });
  }
};

const deletePost =async (req,res) =>{
  try{
    const Id = req.user._id
    const { postId } = req.body
    const deletedPost = await Post.deleteOne({_id:postId,userId:Id})
    if (deletedPost){
    return res.status(200).json({
      msg:"Post Deleted Successfully",
      status:true
    })
    }
  else{
    return res.status(400).json({
      msg:"error"
    })
  }}
    catch (err){
      return res.status(400).json({
        msg:"error occured"
      })
    }
  }


const getPostLikeCount = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }
    const getLikeCount = await Likes.find({ postId:postId });
    const likeCount = getLikeCount.length;
    return res.status(200).json({ likeCount });
  } catch (err) {
    console.error("Error fetching like count:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export { createPost, getAllPosts, getFollowerPosts,deletePost,getPostLikeCount };
