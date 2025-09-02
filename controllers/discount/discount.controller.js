import Discount from "../../models/discount/discount.model.js";
import { asyncWrapper } from "../../middleware/asyncWrapper.js";

export const createDiscount = asyncWrapper(async (req, res) => {
  const discount = new Discount(req.body);
  await discount.save();
  res.status(201).json({ status: "SUCCESS", data: discount });
});

export const getAllDiscounts = asyncWrapper(async (req, res) => {
  const discounts = await Discount.find({ isActive: true, inactive: false });
  res.status(200).json({ status: "SUCCESS", data: discounts });
});

export const getDiscountById = asyncWrapper(async (req, res) => {
  const discount = await Discount.findOne({
    _id: req.params.id,
    isActive: true,
    inactive: false,
  });

  if (!discount) {
    return res.status(404).json({
      status: "FAIL",
      message: "Discount not found or inactive",
    });
  }

  res.status(200).json({ status: "SUCCESS", data: discount });
});

export const updateDiscount = asyncWrapper(async (req, res) => {
  const discount = await Discount.findOneAndUpdate(
    { _id: req.params.id, isActive: true, inactive: false },
    req.body,
    { new: true, runValidators: true }
  );

  if (!discount) {
    return res.status(404).json({
      status: "FAIL",
      message: "Discount not found or inactive",
    });
  }

  res.status(200).json({ status: "SUCCESS", data: discount });
});

export const deleteDiscount = asyncWrapper(async (req, res) => {
  const discount = await Discount.findByIdAndUpdate(
    req.params.id,
    {
      isActive: false,
      inactive: true,
      inactiveUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    { new: true }
  );

  if (!discount) {
    return res
      .status(404)
      .json({ status: "FAIL", message: "Discount not found" });
  }

  res.status(200).json({
    status: "SUCCESS",
    message: "Discount soft-deleted (inactive for 3 days)",
    data: discount,
  });
});
