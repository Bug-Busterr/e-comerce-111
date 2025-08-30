import {asyncWrapper} from "../middleware/asyncWrapper.js";
import User from '../models/user.model.js'
import {SUCCESS} from "../utils/http_status_code.js";

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

export const forgetPassword = asyncWrapper(async (req, res, next) => {});

export const userProfile = asyncWrapper(async (req, res, next) => {});

