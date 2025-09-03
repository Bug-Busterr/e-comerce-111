import express from "express";
import cloudinary from "../utils/cloudinary.js";
import multerUpload from "../middleware/multer.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { INTERNAL_SERVER_ERROR , SUCCESS } from "../utils/http_status_code.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowedTo } from "../middleware/allowedTo.js";
import { userRoles } from "../utils/userRoles.js";

const router = express.Router();

router.post("/", protect, allowedTo(userRoles.ADMIN), multerUpload.single("image"), asyncWrapper(async (req, res) => {
   if (!req.file) {
       return res.status(400).json({ 
           status: "error", 
           message: "No file uploaded", 
           data: null 
       });
   }

   try {
       const result = await cloudinary.v2.uploader.upload(req.file.path);
       res.status(SUCCESS).json({ 
           status: "SUCCESS", 
           message: "Upload successful", 
           data: {
               url: result.secure_url,
               public_id: result.public_id,
               width: result.width,
               height: result.height,
               format: result.format
           }
       });
   } catch (err) {
       console.error('Cloudinary upload error:', err);
       return res.status(INTERNAL_SERVER_ERROR).json({ 
           status: "error", 
           message: err.message || "Upload failed", 
           data: null 
       });
   }
}));

export default router;