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

router.get('/', protect,allowedTo(userRoles.ADMIN),getAllOrders)
router.post('/' , protect,allowedTo(userRoles.USER) , validate(CreateOrderSchema), createOrder)

router.get('/:id', protect,getOrderById)
router.patch('/:id', protect, allowedTo(userRoles.ADMIN) , validate(UpdateOrderSchema), updateOrder)
router.delete('/:id', protect, allowedTo(userRoles.ADMIN) , deleteOrder)

export default router;