import User from "../modals/userSchema.js";
import generateToken from "../utils/generateToken.js";

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
  console.log(req.body);
  try {
    const existUser = await User.findOne({ otp,isVerified: false });
    if (!existUser) {
      return res.status(400).json({
        msg: "Invalid OTP",
      });
    } else {
      const updateUser = await User.findOneAndUpdate(
       
        { otp: null,isVerified: true,new: true }
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
        data: generateToken(existUser._id),
      });
    } else {
      return res.status(400).json({
        msg: "Incorrect password",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: err,
    });
  }
};

const updateDetails = async (req, res) => {
  try {
    let id = req.params.id;
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({
      msg: "User details updated succesfully",
      data: updateUser,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export { userSignup, verifyOtp, userLogin, updateDetails };
