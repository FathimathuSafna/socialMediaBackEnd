import Post from "../modals/postsSchema.js";
import followerDetails from "../modals/followersSchema.js";
import Likes from "../modals/likesSchema.js";

const createPost = async (req, res) => {
  console.log(req.body);
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
  const id = req.user._id; // id passing from middleware

  try {
    // Step 1: Get all the users this person is following
    const following = await followerDetails.find({ userId: id });

    if (!following || following.length === 0) {
      return res.status(400).json({
        msg: "No following found",
        status: false,
      });
    }

    // Step 2: Extract all followedUserId values into an array
    const followedUserIds = following.map((f) => f.followedUserId);

    // Step 3: Get posts by those followed users
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

export { createPost, getAllPosts, getFollowerPosts };
