import {asyncWrapper} from "../middleware/asyncWrapper.js";
import User from '../models/user.model.js'
import {SUCCESS , BAD_REQUEST} from "../utils/http_status_code.js";
import bcrypt from "bcryptjs";

export const getAllUsers = asyncWrapper(async (req,res) => {
    const query = req.query;

    const limit = query.limit || 0;
    const page = query.page || 1;
    const skip = limit * (page - 1);

    const users = await User.find({}, {"__v": false, 'password': false}).limit(limit).skip(skip);

    res.status(SUCCESS).json({ status: SUCCESS, data: {users}});
});

export const register = asyncWrapper(async (req, res, next) => {});

export const login = asyncWrapper(async (req, res, next) => {});

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

export const userProfile = asyncWrapper(async (req, res, next) => {});

