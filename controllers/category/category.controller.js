import mongoose from "mongoose";
import Category from "../../models/category/category.model.js";
import Product from "../../models/Products/product.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createCategory = async (req, res) => {
  try {
    const existing = await Category.findOne({ name: req.body.name, isDeleted: false });
    if (existing) {
      return res.status(400).json({ status: "error", message: "Category name already exists" });
    }

    const category = await Category.create(req.body);
    res.status(201).json({ status: "success", data: category });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false });
    res.json({ status: "success", data: categories });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ status: "error", message: "Invalid category ID" });

    const category = await Category.findOne({ _id: id, isDeleted: false });
    if (!category) return res.status(404).json({ status: "error", message: "Category not found" });

    const products = await Product.find({ categoryId: id });
    res.json({ status: "success", data: { category, products } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ status: "error", message: "Invalid category ID" });

    if (req.body.name) {
      const existing = await Category.findOne({ name: req.body.name, isDeleted: false, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ status: "error", message: "Category name already exists" });
      }
    }

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      req.body,
      { new: true }
    );

    if (!category) return res.status(404).json({ status: "error", message: "Category not found" });

    res.json({ status: "success", data: category });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ status: "error", message: "Invalid category ID" });

    const category = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!category) return res.status(404).json({ status: "error", message: "Category not found" });

    res.json({ status: "success", message: "Category soft deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
