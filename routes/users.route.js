import express from "express";
import multer from "multer";
import AppError from "../utils/errors/appError.js";
import { allowedTo } from "../middleware/allowedTo.js";
import { userRoles } from "../utils/userRoles.js";
import {
  getAllUsers,
  register,
  login,
  userProfile,
  forgetPassword,
  updatePassword,
} from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.js";
import { SignUpSchema } from "../Validation/validationSchema.js";
import { updatePasswordSchema } from "../Validation/validationSchema.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${extension}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(
      AppError.createError("file must be an image", 400, "Fail"),
      false
    );
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
});

router.get('/', getAllUsers);

router.post("/register" , validate(SignUpSchema), upload.single("avatar"), register);

router.post("/login", login);

router.patch("/forgotPassword", forgetPassword);

router.patch("/me", protect, allowedTo(userRoles.USER), userProfile);

router.post('/updatePassword', protect, allowedTo(userRoles.USER), validate(updatePasswordSchema), updatePassword);

export default router;
