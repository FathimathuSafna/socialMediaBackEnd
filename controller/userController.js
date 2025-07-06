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
  console.log(otp);
  const { phoneNumber } = req.body;
  try {
    const existUser = await User.findOne({ phoneNumber });
    if (existUser) {
      return res.status(400).json({
        status: false,
        msg: "User already exist",
      });
    }
    const userDetails = await User.create({ ...req.body, otp });
    res.status(201).json({
      msg: "User detailes added succesfully",
      status: true,
      phoneNumber: userDetails.phoneNumber,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      err,
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
      err,
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
        msg: "user not verified",
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
    console.log("caught in updateDetails",err);
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
    const updateUser = await User.findByIdAndUpdate({_id:userId}, req.body, {
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
    const { userName } = req.params;

    const getUser = await User.findOne({ userName });

    if (!getUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const posts = await Post.find({ userId: getUser._id });

    getUser.postCount = posts.length;
    const PostCount = getUser.postCount || 0;
    const followedCount = await followerDetails.find({ userId: getUser._id });
    const followedCounts = followedCount.length > 0 ? followedCount.length : 0;
    const followers = await followerDetails.find({
      followedUserId: getUser._id,
    });
    const followersCount = followers.length > 0 ? followers.length : 0;

    res.status(200).json({
      msg: "User details fetched successfully",
      data: {
        getUser,
        posts,
        postCount: PostCount,
        followedCount: followedCounts,
        followersCount: followersCount,
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
