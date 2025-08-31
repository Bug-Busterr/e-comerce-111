import { Router } from "express";
import userRoutes from "./users.route.js"
// import productRoute from "../models/Admin/Products/product.route.js";

const router = Router();

router.use("/auth", userRoutes);
// router.use("/Admin/products", productRoute);

export default router;