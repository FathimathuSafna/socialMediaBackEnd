import { get } from "mongoose";
import Post from "../modals/postsSchema.js";
import User from "../modals/userSchema.js";
import generateToken from "../utils/generateToken.js";
import followerDetails from "../modals/followersSchema.js";

function generateOTP(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

const userSignup = async (req, res) => {
  console.log(req.body);
  const otp = generateOTP(6);
  const { phoneNumber, userName , email } = req.body;

  try {
    const existUser = await User.findOne({
      $or: [{ userName }, { phoneNumber },{email}],
    });

    if (existUser) {
      if (existUser.userName === userName) {
        return res.status(409).json({
          status: false,
          message: "Username already taken",
        });
      } else if (existUser.phoneNumber === phoneNumber) {
        return res.status(409).json({
          status: false,
          message: "Phone number already registered",
        });
      } else if (existUser.email === email) {
        return res.status(409).json({
          status: false,
          message: "Email already registered",
        });
      }
    }

    const userDetails = await User.create({ ...req.body, otp });

    return res.status(201).json({
      status: true,
      message: "User details added successfully",
      phoneNumber: userDetails.phoneNumber,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      status: false,
      message: "Server error",
      error: err.message,
    });
  }
};


const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  try {
    const existUser = await User.findOne({ otp: otp, isVerified: false });
    if (!existUser) {
      return res.status(400).json({
        msg: "Invalid OTP",
      });
    } else {
      const updateUser = await User.findOneAndUpdate(
        { _id: existUser._id },
        {
          $set: {
            otp: null,
            isVerified: true,
          },
        },
        { new: true }
      );
      return res.status(200).json({
        msg: "OTP verified successfully",
        data: generateToken(updateUser._id),
      });
    }
  } catch (err) {
    res.status(400).json({
      msg:'invalid otp',
      status: false,
    });
  }
};

const userLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;
  console.log(req.body);
  try {
    const existUser = await User.findOne({ phoneNumber });
    if (!existUser) {
      res.status(400).json({
        msg: "invalid userName or Password",
      });
    }
    if (await existUser.matchPassword(password)) {
      return res.status(200).json({
        msg: "login success",
        data: {
          token: generateToken(existUser._id),
          userName: existUser.userName,
        },
      });
    } else {
      return res.status(400).json({
        msg: "Incorrect password",
      });
    }
  } catch (err) {
    console.log("caught in updateDetails", err);
    res.status(400).json({
      msg: err,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } });
    res.status(200).json({
      msg: "All users",
      status: true,
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      err,
    });
  }
};

const updateDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("details", req.body);
    const updateUser = await User.findByIdAndUpdate({ _id: userId }, req.body, {
      new: true,
    });
    console.log("updateUser", updateUser);
    return res.status(201).json({
      msg: "User details updated succesfully",
      data: updateUser,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userName } = req.params;

    const getUser = await User.findOne({ userName });
    const currentUser = await User.find({ userId: getUser._id });
    if (currentUser) {
      getUser.currentUser === true;
    } else {
      getUser.currentUser = false;
    }
    if (!getUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const isFollowing = await followerDetails.findOne({
      userId: userId,
      followedUserId: getUser._id,
    })
    getUser.isFollowing = isFollowing ? true : false;

    const posts = await Post.find({ userId: getUser._id });

    getUser.postCount = posts.length;
    const PostCount = getUser.postCount || 0;
    const followedCount = await followerDetails.find({ userId: getUser._id }).populate("followedUserId", "userName profileImageUrl");
    const followedCounts = followedCount.length > 0 ? followedCount.length : 0;
    const followers = await followerDetails.find({
      followedUserId: getUser._id,
    }).populate("userId", "userName profileImageUrl");
    const followersCount = followers.length > 0 ? followers.length : 0;

    res.status(200).json({
      msg: "User details fetched successfully",
      data: {
        getUser,
        isFollowing: getUser.isFollowing,
        posts,
        postCount: PostCount,
        followedUsers:followedCount,
        followedCount: followedCounts,
        followerUsers: followers,
        followersCount: followersCount,
        currentUser:
          getUser._id.toString() === userId.toString() ? true : false,
      },
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({
      msg: "Internal server error",
      error: err.message,
    });
  }
};

export {
  userSignup,
  verifyOtp,
  userLogin,
  getAllUsers,
  updateDetails,
  getUserDetails,
};
