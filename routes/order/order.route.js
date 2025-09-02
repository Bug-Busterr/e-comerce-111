import express from "express";

import { createOrder , getAllOrders , getOrderById, updateOrder, deleteOrder, validateDiscountCode, previewDiscount } from "../../controllers/orders/order.controller.js";
import { validate } from "../../middleware/validate.js";
import { CreateOrderSchema, UpdateOrderSchema } from "../../Validation/validationSchema.js";
import { ValidateDiscountCodeSchema, PreviewDiscountSchema } from "../../Validation/discountValidation.js";
import { protect } from "../../middleware/authMiddleware.js";
import { allowedTo } from "../../middleware/allowedTo.js";
import { userRoles } from "../../utils/userRoles.js";

const router = express.Router();

router.post('/validate-discount', validate(ValidateDiscountCodeSchema), validateDiscountCode)
router.post('/preview-discount', validate(PreviewDiscountSchema), previewDiscount)

router.route('/')
         .get(getAllOrders)
         .post(protect , validate(CreateOrderSchema), createOrder)

router.route('/:id')
         .get(getOrderById)
         .patch(protect, allowedTo(userRoles.ADMIN) , validate(UpdateOrderSchema), updateOrder)
         .delete(protect, allowedTo(userRoles.ADMIN) , deleteOrder)

export default router;