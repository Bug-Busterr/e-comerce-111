import express from "express";
import multer from 'multer';
import AppError from "../utils/errors/appError.js"
import {
    getAllUsers,
    register,
    login,
    signUpWithGoogle,
    userProfile,
    forgetPassword
} from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.js";
import { SignUpSchema } from "../Validation/validationSchema.js";

const router = express.Router();


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
        return cb(AppError.createError('file must be an image', 400 , "Fail"), false)
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