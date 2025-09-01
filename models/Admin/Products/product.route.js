import express from "express";
import multer from 'multer';
const router = express.Router();
import { protect } from "../../../middleware/authMiddleware.js";
import { validate } from "../../../middleware/validate.js";
import { productValidationSchema , productUpdateSchema} from "../../../Validation/productSchema.js";
import { allowedTo } from "../../../middleware/allowedTo.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById
} from "./product.controller.js";
import { userRoles } from "../../../utils/userRoles.js";

router.get("/",getAllProducts );
router.get("/:productId",getProductById );
router.post("/",protect,allowedTo(userRoles.ADMIN),validate(productValidationSchema),createProduct);
router.patch("/:productId",protect,allowedTo(userRoles.ADMIN),validate(productUpdateSchema), updateProductById);
router.delete("/:productId",protect,allowedTo(userRoles.ADMIN), deleteProductById);

export default router;