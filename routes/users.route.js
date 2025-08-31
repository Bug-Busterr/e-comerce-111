import express from "express";
import multer from 'multer';
const router = express.Router();
import AppError from "../utils/errors/appError.js"

import {
    getAllUsers,
    register,
    login,
    signUpWithGoogle,
    userProfile,
    forgetPassword
} from "../controllers/users.controller.js";
import { validate } from "../middleware/validat.js";
import { SignUpSchema } from "../middleware/validationSchema.js";

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null , 'uploads'),
    filename: (req , file , cb) =>{
        const extension = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${extension}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if(imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(AppError.createError({message: 'file must be an image' , status: 400}), false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
});

router.route('/')
            .get(getAllUsers)

router.route('/register')
            .post(validate(SignUpSchema),upload.single('avatar') , register)

router.route('/login')
            .post(login)

router.route('/signupwithgoogle')
            .post(signUpWithGoogle)

router.route('/forgotPassword')
            .patch(forgetPassword)

router.route('/me')
            .patch(userProfile)


export default router;