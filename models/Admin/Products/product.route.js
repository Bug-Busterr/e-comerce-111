import express from "express";
import multer from 'multer';
const router = express.Router();
import { verifyToken } from "../../../services/jwt.service.js";
import { validate } from "../../../middleware/validate.js";
import { productValidationSchema } from "../../../Validation/productSchema.js";
import { allowedTo } from "../../../middleware/allowedTo.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById
} from "./product.controller.js";
import { userRoles } from "../../../utils/userRoles";

router.get("/",verifyToken,allowedTo(userRoles.ADMIN),getAllProducts );
router.get("/:productId",verifyToken,allowedTo(userRoles.ADMIN),getProductById );
router.post("/",verifyToken,allowedTo(userRoles.ADMIN),validate(productValidationSchema),createProduct);
router.patch("/:productId",verifyToken,allowedTo(userRoles.ADMIN),validate(productValidationSchema), updateProductById);
router.delete("/:productId",verifyToken,allowedTo(userRoles.ADMIN), deleteProductById);

export default router;