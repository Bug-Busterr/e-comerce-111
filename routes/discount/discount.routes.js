import express from "express";
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
} from "../../controllers/discount/discount.controller.js";
import { validate } from "../../middleware/validate.js";
import { CreateDiscountSchema, UpdateDiscountSchema } from "../../Validation/discountValidation.js";
import { protect } from "../../middleware/authMiddleware.js";
import { allowedTo } from "../../middleware/allowedTo.js";
import { userRoles } from "../../utils/userRoles.js";

const router = express.Router();

router.use(protect);
router.use(allowedTo(userRoles.ADMIN));

router.post("/", validate(CreateDiscountSchema), createDiscount);

router.get("/", getAllDiscounts);

router.get("/:id", getDiscountById);

router.put("/:id", validate(UpdateDiscountSchema), updateDiscount);

router.delete("/:id", deleteDiscount);

export default router;
