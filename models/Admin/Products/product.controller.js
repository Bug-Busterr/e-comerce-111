import Product from "./product.model.js"
import { asyncWrapper } from "../../middleware/asyncWrapper.js";
import AppError from "../../utils/errors/appError.js";

export const createProduct = asyncWrapper(async (req, res, next) => {
const newProduct = new Product(req.body);
  await newProduct.save().then((data) => {
    res.status(201).json({ status: "SUCCESS", data: { product: data } });
  });
})

export const getAllProducts = asyncWrapper(async (req, res, next) => {
    let quary = req.query;
  const limit = quary.limit || 6;
  const page = quary.page || 1;
  const skip = (page - 1) * limit;
  const data = await Product.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: "SUCCESS", data: { products: data } });
})

export const getProductById = asyncWrapper(async (req, res, next) => {
    const data = await Product.findById(req.params.productId, { __v: false });
  if (data) {
    return res.json({ status: "SUCCESS", data: { product: data } });
  }
   throw AppError.create("product not found", 400, "Fail");
})

export const updateProductById = asyncWrapper(async (req, res, next) => {
     if(Object.keys(req.body).length===0){
    throw AppError.create("no data provided to update", 400, "Fail");
 }
  const data = await Product.updateOne(
    { _id: req.params.productId },
    { $set: req.body }
  );

  if (data.matchedCount !== 0) {
    return res.json({ status: "SUCCESS", data: data });
  }
  throw AppError.create("product not found", 404, "Fail");
})

export const deleteProductById = asyncWrapper(async (req, res, next) => {
    const data = await Product.deleteOne({ _id: req.params.productId });
  if (data.deletedCount !== 0) {
    return res.json({ status: "SUCCESS", data: null });
  }
  throw AppError.create("product not found", 404, "Fail");
})