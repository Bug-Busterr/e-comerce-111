import {asyncWrapper} from "../middleware/asyncWrapper.js";
import User from '../models/user.model.js'
import {SUCCESS , BAD_REQUEST} from "../utils/http_status_code.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/jwt.service.js";
import { NOT_FOUND, UNAUTHORIZED } from "../utils/http_status_code.js";

export const getAllUsers = asyncWrapper(async (req,res) => {
    const query = req.query;

    const limit = query.limit || 0;
    const page = query.page || 1;
    const skip = limit * (page - 1);

    const users = await User.find({}, {"__v": false, 'password': false}).limit(limit).skip(skip);

    res.status(SUCCESS).json({ status: SUCCESS, data: {users}});
});




export const register = asyncWrapper(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

 
  if (!password || (!email && !phone)) {
    return res.status(BAD_REQUEST).json({
      message: "you must provide password and email or phone number"
    });
  }

  
  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const userExists = await User.findOne({ $or: query });
  if (userExists) {
    return res.status(BAD_REQUEST).json({
      message: "User with this email or phone number already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  
  const userData = {
    name,
    password: hashedPassword,
    avatar: req.file ? req.file.path : "uploads/profile.png"
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
      token: generateToken(user.name, user.email, user.phone, user._id)
    }
  });
});



export const login = asyncWrapper(async (req, res, next) => {
  const { email, phone, password } = req.body;

  
  if (!email && !phone) {
    return res.status(BAD_REQUEST).json({ 
      message: "You must provide email or phone number" 
    });
  }

  
  const query = [];
  if (email) query.push({ email });
  if (phone) query.push({ phone });

  const user = await User.findOne({ $or: query });
  if (!user) {
    return res.status(NOT_FOUND).json({ 
      message: "User not found" 
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(UNAUTHORIZED).json({ 
      message: "Invalid credentials" 
    });
  }

  const redirectTo = user.role === "admin" ? "/admin/dashboard" : "/store";

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
      token: generateToken(user.name, user.email, user.phone, user._id)
    }
  });
});

export const signUpWithGoogle = asyncWrapper(async (req, res, next) => {});

// handle if the other user know the user email
// user.password !== newPassword
export const forgetPassword = asyncWrapper(async (req, res, next) => {

    const { email, newPassword, confirmNewPassword } = req.body;
    

    if (!email || !newPassword || !confirmNewPassword) {
        return res.status(BAD_REQUEST).json({ status: BAD_REQUEST, message: "Email, new password and confirm new password are required" });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(BAD_REQUEST).json({ status: BAD_REQUEST, message: "New password and confirm new password do not match" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(BAD_REQUEST).json({ status: BAD_REQUEST, message: "User not found" });
    }

    if (user.password !== newPassword) {
        return res.status(BAD_REQUEST).json({ status: BAD_REQUEST, message: "New password cannot be the same as the old password" });
    }

    const newHashedUserPassword = await bcrypt.hash(newPassword, 10);

    user.password = newHashedUserPassword;

    await user.save();

    res.status(SUCCESS).json({ status: SUCCESS, message: "Password updated successfully" });
});

export const userProfile = asyncWrapper(async (req, res, next) => {
const currentUser=req.currentUser;
if(!currentUser){
    return res.status(BAD_REQUEST).json({message:"user not found"});
}
const user = await User.findById(currentUser._id);
  if (!user) {
    return res.status(BAD_REQUEST).json({ message: "user not found in database" });
  }
  if (!req.body ||Object.keys(req.body).length === 0) {
    return res.json({ status: SUCCESS,  data: {
      name: user.name,
      email: user.email,
      address: user.address,
    } });
  }
  const { currPassword, newPassword, confirmPassword, ...restFields } = req.body;

  if (Object.keys(restFields).length > 0) {
  Object.keys(restFields).forEach((key) => {
    user[key] = restFields[key];
  });
}

  if (currPassword || newPassword || confirmPassword) {
    if (!currPassword || !newPassword || !confirmPassword) {
      return res.status(BAD_REQUEST).json({
        message: "you must provide curr Password, new Password and confirm Password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "new Password and confirm Password do not match" });
    }

    const isPasswordCorrect = await bcrypt.compare(currPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(BAD_REQUEST).json({ message: "current password is wrong" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();

  res.json({
    status: SUCCESS,
    message: "Profile updated successfully",
    data: {
      name: user.name,
      email: user.email,
      address: user.address,
    },
  });
});

