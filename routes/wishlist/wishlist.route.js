import express from "express";
const router = express.Router();
import { protect } from "../../middleware/authMiddleware.js";
import { validate } from "../../middleware/validate.js";
import { allowedTo } from "../../middleware/allowedTo.js";
import {
   addToWishlist,
   getOne,
   deleteOne
} from "../../controllers/wishlist/wishlist.controller.js";
import { userRoles } from "../../utils/userRoles.js";

router.get("/:product_id",protect,allowedTo(userRoles.USER),addToWishlist );
 router.get("/",protect,allowedTo(userRoles.USER),getOne );
// router.post("/",protect,allowedTo(userRoles.ADMIN),validate(productValidationSchema),createProduct);
// router.patch("/:productId",protect,allowedTo(userRoles.ADMIN),validate(productUpdateSchema), updateProductById);
 router.delete("/:product_id",protect,allowedTo(userRoles.USER), deleteOne);

export default router;