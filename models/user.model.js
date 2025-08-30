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
        type: String, 
        enum: [userRoles.USER, userRoles.ADMIN],
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: 'uploads/profile.png'
    }
})

export default mongoose.model('users', userSchema);