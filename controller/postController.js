import Post from "../modals/postsSchema.js";
import followerDetails from "../modals/followersSchema.js";

const createPost =  async(req,res) => {
    console.log(req.body)
    let userId = req.user._id //id passing from middleware
    const {location,postImageUrl,description,isArchived,status} = req.body
    try {
        const postDetails = await Post.create({userId,location,postImageUrl,description,isArchived,status})
        res.status(201).json({
            msg:"Post created successfully",
            status:true,
            data:postDetails
        })
    } catch (err) {
        res.status(400).json({
            status:false,
            err
        })
    }
}

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            msg: "All posts",
            status: true,
            data: posts,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            err,
        });
    }
}

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
    const followedUserIds = following.map(f => f.followedUserId);

    // Step 3: Get posts by those followed users
    const posts = await Post.find({ userId: { $in: followedUserIds } })
      .populate("userId", "name");

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
    

export {createPost,getAllPosts,getFollowerPosts}