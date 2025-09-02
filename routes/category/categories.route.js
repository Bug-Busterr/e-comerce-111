import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/category/category.controller.js";
import { categorySchema } from "../../Validation/categorySchema.js";

const router = express.Router();

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ status: "error", message: error.details[0].message });
  req.body = value;
  next();
};

router.post("/", validateBody(categorySchema), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", validateBody(categorySchema), updateCategory);
router.delete("/:id", deleteCategory); 

export default router;
