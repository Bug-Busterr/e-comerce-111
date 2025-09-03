import { asyncWrapper } from "../middleware/asyncWrapper.js";
import User from "../models/user.model.js";
import { SUCCESS, BAD_REQUEST } from "../utils/http_status_code.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/jwt.service.js";
import { userRoles } from "../utils/userRoles.js";
import { NOT_FOUND, UNAUTHORIZED } from "../utils/http_status_code.js";
import AppError from "../utils/errors/appError.js";
import Orders from "../models/orders/order.model.js";

export const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 0;
  const page = query.page || 1;
  const skip = limit * (page - 1);

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.status(SUCCESS).json({ status: SUCCESS, data: { users } });
});

export const register = asyncWrapper(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!password || (!email && !phone)) {
    return res.status(BAD_REQUEST).json({
      message: "you must provide password and email or phone number",
    });
  }

  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const userExists = await User.findOne({ $or: query });
  if (userExists) {
    return res.status(BAD_REQUEST).json({
      message: "User with this email or phone number already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    name,
    password: hashedPassword,
    avatar: req.file ? req.file.path : "uploads/profile.png",
  };

  if (email) userData.email = email;
  if (phone) userData.phone = phone;

  const user = await User.create(userData);

  res.status(SUCCESS).json({
    status: SUCCESS,
    message: "User registered successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(
        user.name,
        user.email,
        user.phone,
        user._id,
        user.role
      ),
    },
  });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, phone, password } = req.body;

  if (!email && !phone) {
    return res.status(BAD_REQUEST).json({
      message: "You must provide email or phone number",
    });
  }

  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const user = await User.findOne({ $or: query });
  if (!user) {
    return res.status(NOT_FOUND).json({
      message: "User not found",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(UNAUTHORIZED).json({
      message: "Invalid credentials",
    });
  }

  const redirectTo =
    user.role === userRoles.ADMIN ? "/admin/dashboard" : "/store";

  res.status(SUCCESS).json({
    status: SUCCESS,
    message: "Login successful",
    redirectTo,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(
        user.name,
        user.email,
        user.phone,
        user._id,
        user.role
      ),
    },
  });
});

// handle if the other user know the user email
// user.password !== newPassword
export const forgetPassword = asyncWrapper(async (req, res, next) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  if (!email || !newPassword || !confirmNewPassword) {
    return res.status(BAD_REQUEST).json({
      status: BAD_REQUEST,
      message: "Email, new password and confirm new password are required",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(BAD_REQUEST).json({
      status: BAD_REQUEST,
      message: "New password and confirm new password do not match",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(BAD_REQUEST)
      .json({ status: BAD_REQUEST, message: "User not found" });
  }

  if (user.password !== newPassword) {
    return res.status(BAD_REQUEST).json({
      status: BAD_REQUEST,
      message: "New password cannot be the same as the old password",
    });
  }

  const newHashedUserPassword = await bcrypt.hash(newPassword, 10);

  user.password = newHashedUserPassword;

  await user.save();

  res
    .status(SUCCESS)
    .json({ status: SUCCESS, message: "Password updated successfully" });
});

export const userProfile = asyncWrapper(async (req, res, next) => {
  const user_id = req.user._id;
  const user = await User.findOne({ _id: user_id });
  if (!user) {
    return AppError.creeateError("User not found", 404, "Error");
  }
  const name = user.name;
  const first_name = name.split(" ")[0];
  const last_name = name.split(" ")[1];
  const last_order = await Orders.findOne({ buyer: user_id });
  let address = "";
  if (last_order) {
    address = last_order.productShippingDetails.address;
  }
  res.status(SUCCESS).json({
    status: SUCCESS,
    data: {
      name: user.name,
      first_name,
      last_name: last_name || "",
      email: user.email,
      address,
    },
  });
});

export const updatePassword = asyncWrapper(async (req, res) => {
  const user_id = req.user._id;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findOne({ _id: user_id });
if(currentPassword||newPassword||confirmPassword){
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(BAD_REQUEST).json({
      status: "ERROR",
      message:
        "you must provide curr Password, new Password and confirm Password",
    });
  }
  if (currentPassword === newPassword) {
    return res.status(BAD_REQUEST).json({
      status: "FAIL",
      message: "current password and new password are same",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(BAD_REQUEST).json({
      status: "ERROR",
      message: "new Password and confirm Password do not match",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    return res
      .status(BAD_REQUEST)
      .json({ status: "ERROR", message: "current password is wrong" });
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();
  res
    .status(SUCCESS)
    .json({ status: "SUCCESS", message: "Password updates successfully" });
    }
});
