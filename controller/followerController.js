import followerDetails from "../modals/followersSchema.js";
import User from "../modals/userSchema.js";


const follow = async (req, res) => {
    console.log("Received body:", req.body);
    const userId = req.user._id; // id passing from middleware
    const { followedUserId } = req.body;
    console.log("User ID from middleware:", userId);
    console.log("###########")
    try {
        const existUser = await followerDetails.findOne({
        userId: userId,
        followedUserId: followedUserId,
        });
        console.log("Existing follow details:", existUser);
        if (existUser) {
        return res.status(400).json({
            msg: "Already following this user",
        });
        }
        const followDetails = await followerDetails.create({
        userId: userId,
        followedUserId: followedUserId,
        });
        return res.status(201).json({
        msg: "Followed successfully",
        status: true,
        data: followDetails,
        });
    } catch (err) {
        res.status(400).json({
        status: false,
        err,
        });
    }
    }

const unfollow = async (req, res) => {
    const { userId, followedUserId } = req.body;
    try {
        const existUser = await followerDetails.findOne({
        userId, 
        followedUserId,
        });
        if (!existUser) {
        return res.status(400).json({
            msg: "Not following this user",
        });
        }
        await followerDetails.deleteOne({
        userId,
        followedUserId,
        });
        res.status(200).json({
        msg: "Unfollowed successfully",
        status: true,
        });
    }
    catch (err) {
        res.status(400).json({
        status: false,
        err,
        });
    }
}


const getFollowing = async (req, res) => {
    const { id } = req.params;   
    try {
         
        const following = await followerDetails.find({ userId : id  }).populate("followedUserId","name");
        console.log(following)
        if (!following || following.length === 0) {
            return res.status(400).json({
                msg: "No following found",
            });
        }
        res.status(200).json({
            msg: "Following list",
            status: true,
            data: following,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            err,
        });
    }   
}

const getFollowers = async (req, res) => {
const id = req.user._id //passing from middleware
console.log("Received ID:", id);
  try {
    // Step 1: Find who followed you
    const followers = await followerDetails.find({ followedUserId: id });

    // Step 2: Extract their userIds (i.e., they followed you)
    const followerIds = followers.map(f => f.userId.toString());

    // Step 3: Get all users who are NOT in that list (did NOT follow you)
    const nonFollowers = await User.find({
      _id: { $nin: followerIds, $ne: id } // exclude your own ID too
    }).select("name profileImageUrl");

    if (!nonFollowers || nonFollowers.length === 0) {
      return res.status(404).json({
        msg: "Everyone has followed you or no other users found",
        status: false,
      });
    }

    res.status(200).json({
      msg: "Users who have NOT followed you",
      status: true,
      data: nonFollowers,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
      status: false,
      error: err.message,
    });
  }
};

export {follow,unfollow,getFollowing,getFollowers}