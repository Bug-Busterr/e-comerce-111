import Product from "../../models/Products/product.model.js";
import { asyncWrapper } from "../../middleware/asyncWrapper.js";
import AppError from "../../utils/errors/appError.js";

export const createProduct = asyncWrapper(async (req, res, next) => {
  const newProduct = new Product(req.body);
  await newProduct.save().then((data) => {
    res.status(201).json({
      status: "SUCCESS",
      message: "product created successfully",
      data: { product: data },
    });
  });
});

export const getAllProducts = asyncWrapper(async (req, res, next) => {
  let quary = req.query;
  const limit = quary.limit || 0;
  const page = quary.page || 1;
  const skip = (page - 1) * limit;

  let filter = { deleted: false };
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    filter.$or = [{ name: searchRegex }, { category: searchRegex }];
  }

  let sort = {};
  if (req.query.sort) {
    const [field, order] = req.query.sort.split("_");
    sort[field] = order === "asc" ? 1 : -1;
  }

  const data = await Product.find(filter, {
    name: 1,
    price: 1,
    stockQuantity: 1,
    category: 1,
  })
    .limit(limit)
    .skip(skip)
    .sort(sort);
  res.json({ status: "SUCCESS", data: { products: data } });
});

export const getProductById = asyncWrapper(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
    throw AppError.createError("Invalid product ID", 400, "Fail");
  }

  const product = await Product.findOne({ _id: productId, deleted: false });

  if (!product) {
    throw AppError.createError("Product not found", 404, "Fail");
  }

  res.json({ status: "SUCCESS", data: { product } });
});

export const getProductsByCategory = asyncWrapper(async (req, res, next) => {
  const { categoryId } = req.params;

  if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
    throw AppError.createError("Invalid category ID", 400, "Fail");
  }

  const products = await Product.find({ category: categoryId, deleted: false });
  res.json({ status: "success", data: products });
});

export const updateProductById = asyncWrapper(async (req, res, next) => {
  const product = await Product.findOne({
    _id: req.params.productId,
    deleted: false,
  });

  if (!product) {
    throw AppError.createError("product not found", 404, "Fail");
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    throw AppError.createError("no data provided to update", 400, "Fail");
  }

  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== product[key]) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw AppError.createError(
      "The provided data is identical to the current data",
      400,
      "Fail"
    );
  }

  await Product.updateOne(
    { _id: req.params.productId, deleted: false },
    { $set: updates }
  );

  return res.json({ status: "SUCCESS", message: "updated successfully" });
});

export const deleteProductById = asyncWrapper(async (req, res, next) => {
  const data = await Product.findOneAndUpdate(
    { _id: req.params.productId },
    { $set: { deleted: true } }
  );
  if (data) {
    return res.json({ status: "SUCCESS", message: "deleted successfully" });
  }
  throw AppError.createError("product not found", 404, "Fail");
});
