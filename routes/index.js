import { Router } from "express";
import userRoutes from "./users.route.js";
import adminOrderRoutes from "./order/order.route.js";
import adminProductRoutes from "./product/product.route.js";
import adminDiscountRoutes from "./discount/discount.routes.js";
import cartRoutes from "./cart/cart.route.js";
import wishlistRoutes from "./wishlist/wishlist.route.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/auth/admin/orders", adminOrderRoutes);
router.use("/auth/admin/products", adminProductRoutes);
router.use("/auth/admin/discounts", adminDiscountRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlists", wishlistRoutes);

export default router;
