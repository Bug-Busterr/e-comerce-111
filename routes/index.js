import { Router } from "express";

import userRoutes from "./users.route.js";
import adminOrderRoutes from "./order/order.route.js";
import adminProductRoutes from "./product/product.route.js";
import adminDiscountRoutes from "./discount/discount.routes.js";
import adminCategoryRoutes from "./category/categories.route.js";
import cartRoutes from "./cart/cart.route.js";
import wishlistRoutes from "./wishlist/wishlist.route.js";
import uploadRoutes from "./upload.route.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/auth/admin/orders", adminOrderRoutes);
router.use("/auth/admin/products", adminProductRoutes);
router.use("/auth/admin/categories", adminCategoryRoutes);
router.use("/auth/admin/discounts", adminDiscountRoutes);
router.use("/auth/admin/uploads", uploadRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlists", wishlistRoutes);

export default router;