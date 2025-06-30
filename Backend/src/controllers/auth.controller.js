import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name || !email || !password || !gender) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const alreadyExists = await User.findOne({ $or: [{ name }, { email }] });
  if (alreadyExists) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  let profilePicUrl = "";
  if (req.file) {
    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        `profilePics/${Date.now()}_${name}`
      );
      profilePicUrl = result.secure_url;
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Profile picture upload failed" });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Profile picture is required" });
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashPassword,
    gender,
    profilePic: profilePicUrl,
  });

  await user.save();
  const userObj = user.toObject();
  delete userObj.password;
  const token = jwt.sign({ id: user._id }, config.SECRET, {
    expiresIn: config.EXPIRE,
  });
  res.cookie("token", token, config.COOKIE_OPTIONS);
  res.status(201).json({
    success: true,
    data: { user: userObj, token },
    message: "User registered successfully",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: user._id }, config.SECRET, {
    expiresIn: config.EXPIRE,
  });
  res.cookie("token", token, config.COOKIE_OPTIONS);
  const userObj = user.toObject();
  delete userObj.password;
  res.status(200).json({
    success: true,
    data: { user: userObj, token },
    message: "Login successful",
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", config.COOKIE_OPTIONS);
  res.status(200).json({ success: true, message: "Logged out successfully" });
});
