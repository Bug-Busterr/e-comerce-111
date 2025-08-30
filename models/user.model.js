import mongoose from "mongoose";
import {userRoles} from "../utils/userRoles.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String, // ["USER", "ADMIN", "MANGER"]
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANGER],
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: 'uploads/profile.png'
    }
})

export default mongoose.model('users', userSchema);