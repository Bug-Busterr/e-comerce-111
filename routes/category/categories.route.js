import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/category/category.controller.js";
import { categorySchema } from "../../Validation/categorySchema.js";
import {protect} from "../../middleware/authMiddleware.js";
import {allowedTo} from "../../middleware/allowedTo.js"
import { userRoles } from "../../utils/userRoles.js";

const router = express.Router();

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ status: "error", message: error.details[0].message });
  req.body = value;
  next();
};

router.post("/", protect , allowedTo(userRoles.ADMIN) ,  validateBody(categorySchema), createCategory);
router.get("/", protect , allowedTo(userRoles.ADMIN),  getAllCategories);
router.get("/:id", protect , allowedTo(userRoles.ADMIN),  getCategoryById);
router.put("/:id", protect , allowedTo(userRoles.ADMIN),  validateBody(categorySchema), updateCategory);
router.delete("/:id", protect , allowedTo(userRoles.ADMIN),  deleteCategory);

export default router;
