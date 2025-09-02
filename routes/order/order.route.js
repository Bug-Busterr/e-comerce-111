import express from "express";

import { createOrder , getAllOrders , getOrderById, updateOrder, deleteOrder } from "../../controllers/orders/order.controller.js";
import { validate } from "../../middleware/validate.js";
import { CreateOrderSchema, UpdateOrderSchema } from "../../Validation/validationSchema.js";
import { protect } from "../../middleware/authMiddleware.js";
import { allowedTo } from "../../middleware/allowedTo.js";
import { userRoles } from "../../utils/userRoles.js";

const router = express.Router();

router.route('/')
         .get(protect,allowedTo(userRoles.ADMIN),getAllOrders)
         .post(protect , validate(CreateOrderSchema), createOrder)

router.route('/:id')
         .get(getOrderById)
         .patch(protect, validate(UpdateOrderSchema), updateOrder)
         .delete(protect, deleteOrder)

export default router;