import mongoose from "mongoose";
import {userRoles} from "../utils/userRoles.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
        sparse: true 
    },
    phone: {
        type: String,
        required: false,
        sparse: true ,
        unique: true,
        match: [/^01[0-9]{9}$/, 'Please fill a valid phone number']
    },
    password: {
        type: String,
        required: true,
        
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


userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

export default mongoose.model('users', userSchema);