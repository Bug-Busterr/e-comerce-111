import { Router } from "express";
import userRoutes from "./users.route.js"
import adminOrderRoutes from "./order/order.route.js"

const router = Router();

router.use("/auth", userRoutes);
router.use("/auth/admin/orders", adminOrderRoutes);

export default router;