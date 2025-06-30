import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, profilePic, gender } = req.body;

  if (!name || !email || !password || !profilePic || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const alreadyExists = await User.findOne({ $or: [{ name }, { email }] });

  if (alreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashPassword,
    gender,
    profilePic,
  });

  await user.save();

  const token = jwt.sign({ id: user._id }, config.SECRET, {
    expiresIn: config.EXPIRE,
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    user,
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign({ id: user._id }, config.SECRET, {
    expiresIn: config.EXPIRE,
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    user,
    token,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({
    message: "Logout Successfully",
  });
});
