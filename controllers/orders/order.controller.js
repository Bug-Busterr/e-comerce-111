import { asyncWrapper } from "../../middleware/asyncWrapper.js";
import Users from "../../models/user.model.js";
import Orders from "../../models/orders/order.model.js";
import Products from "../../models/Products/product.model.js";
import {
  SUCCESS,
  BAD_REQUEST,
  NOT_FOUND,
} from "../../utils/http_status_code.js";
import mongoose from "mongoose";

export const getAllOrders = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 0;
  const page = query.page || 1;
  const skip = limit * (page - 1);

  const filter = { deleted: false };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");

    const matchingUsers = await Users.find({
      $or: [{ name: searchRegex }, { email: searchRegex }],
    }).select("_id");

    const userIds = matchingUsers.map((user) => user._id);

    filter.$or = [{ buyer: { $in: userIds } }];

    if (mongoose.Types.ObjectId.isValid(query.search)) {
      filter.$or.push({ _id: query.search });
    }
  }

  const orders = await Orders.find(filter)
    .populate("buyer", "name email phone")
    .populate("products.product", "name price")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(SUCCESS).json({ status: "SUCCESS", data: { orders } });
});

export const getOrderById = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const order = await Orders.findOne({ _id: id, deleted: false })
    .populate("buyer", "name email phone")
    .populate("products.product", "name price");

  if (!order) {
    return res
      .status(NOT_FOUND)
      .json({ status: NOT_FOUND, message: "Order not found" });
  }

  res.status(SUCCESS).json({ status: "SUCCESS", data: { order } });
});

export const createOrder = asyncWrapper(async (req, res) => {
  const { buyerId, products, productShippingDetails } = req.body;

  const buyer = await Users.findById(buyerId);

  if (!buyer) {
    return res.status(BAD_REQUEST).json({
      status: BAD_REQUEST,
      message: "Buyer not found",
    });
  }

  // Validate products exist and calculate total amount
  let totalAmount = 0;
  const validatedProducts = [];

  for (const item of products) {
    const product = await Products.findById(item.product);

    if (!product) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: `Product with ID ${item.product} not found`,
      });
    }

    if (product.stockQuantity < item.quantity) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: "Out Of Stock",
      });
    }

    validatedProducts.push({
      product: item.product,
      quantity: item.quantity,
    });

    totalAmount += product.price * item.quantity;
  }

  const order = new Orders({
    buyer: buyerId,
    products: validatedProducts,
    productShippingDetails,
    totalAmount,
    status: "Pending",
  });

  await order.save();

  for (const item of validatedProducts) {
    await Products.findByIdAndUpdate(item.product, {
      $inc: { stockQuantity: -item.quantity },
    });
  }

  await order.populate([
    { path: "buyer", select: "name email phone" },
    { path: "products.product", select: "name price" },
  ]);

  res.status(SUCCESS).json({
    status: "SUCCESS",
    message: "Order created successfully",
    data: { order },
  });
});

export const updateOrder = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { status, products, productShippingDetails } = req.body;

  const order = await Orders.findOne({ _id: id, deleted: false });

  if (!order) {
    return res.status(NOT_FOUND).json({
      status: NOT_FOUND,
      message: "Order not found",
    });
  }

  if (status) {
    const currentStatus = order.status;

    if (currentStatus === "Delivered" && status !== "Delivered") {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: "Cannot change status from Delivered to another status",
      });
    }

    if (
      currentStatus === "Canceled" &&
      (status === "Pending" || status === "Shipped")
    ) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: "Cannot change status from Canceled to Pending or Shipped",
      });
    }

    order.status = status;
  }

  if (products) {
    // Validate products exist and calculate new total amount
    let newTotalAmount = 0;
    const validatedProducts = [];

     for (const item of order.products) {
    const pro = await Products.findOne({ _id: item.product._id });

    if (pro.deleted === true) {
      pro.deleted = false;
      pro.stockQuantity += item.quantity;
    } else {
      pro.stockQuantity += item.quantity;
    }

    await pro.save();
  }

    for (const item of products) {
      const product = await Products.findById(item.product);

      if (!product) {
        return res.status(BAD_REQUEST).json({
          status: BAD_REQUEST,
          message: `Product with ID ${item.product} not found`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(BAD_REQUEST).json({
          status: BAD_REQUEST,
          message: "Out Of Stock",
        });
      }

      validatedProducts.push({
        product: item.product,
        quantity: item.quantity,
      });

      newTotalAmount += product.price * item.quantity;
    }

    order.products = validatedProducts;
    order.totalAmount = newTotalAmount;
  }

  if (productShippingDetails) {
    order.productShippingDetails = productShippingDetails;
  }

  await order.save();
  await order.populate([
    { path: "buyer", select: "name email phone" },
    { path: "products.product", select: "name price" },
  ]);

  res.status(SUCCESS).json({
    status: "SUCCESS",
    message: "Order updated successfully",
    data: { order },
  });
});

export const deleteOrder = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const order = await Orders.findOne({ _id: id, deleted: false });

  if (!order) {
    return res.status(NOT_FOUND).json({
      status: NOT_FOUND,
      message: "Order not found",
    });
  }

  order.deleted = true;

  await order.save();

  for (const item of order.products) {
    const pro = await Products.findOne({ _id: item.product._id });

    if (pro.deleted === true) {
      pro.deleted = false;
      pro.stockQuantity += item.quantity;
    } else {
      pro.stockQuantity += item.quantity;
    }

    await pro.save();
  }
  res.status(SUCCESS).json({
    status: "SUCCESS",
    message: "Order deleted successfully",
  });
});
