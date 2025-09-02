import { Router } from "express";
import userRoutes from "./users.route.js";
import discountRoutes from "./Admin/discount/discount.routes.js";

const router = Router();

router.use("/auth", userRoutes);
router.use("/admin/discounts", discountRoutes);


export default router;
