import { asyncWrapper } from '../../middleware/asyncWrapper.js';
import Users from '../../models/user.model.js';
import Orders from "../../models/orders/order.model.js";
import { SUCCESS , BAD_REQUEST , NOT_FOUND} from '../../utils/http_status_code.js';
import mongoose from 'mongoose';

export const getAllOrders = asyncWrapper(async (req , res) => {
    const query = req.query;
    
    const limit = query.limit || 0;
    const page = query.page || 1;
    const skip = limit * (page - 1);
    
    const filter = { deleted: false };
    
    if (query.status) {
        filter.status = query.status;
    }

    if (query.search) {
        
        const searchRegex = new RegExp(query.search, 'i');
        
        const matchingUsers = await Users.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex }
            ]
        }).select('_id');
        
        const userIds = matchingUsers.map(user => user._id);
        
        filter.$or = [
            { buyer: { $in: userIds } }
        ];
        
        if (mongoose.Types.ObjectId.isValid(query.search)) {
            filter.$or.push({ _id: query.search });
        }
    }

    const orders = await Orders.find(filter)
        .populate('buyer', 'name email phone')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.status(SUCCESS).json({ status: "SUCCESS", data: { orders } });
});

export const getOrderById = asyncWrapper(async (req , res) => {
    const { id } = req.params;

    const order = await Orders.findOne({ _id: id, deleted: false })
        .populate('buyer', 'name email phone');

    if (!order) {
        return res.status(NOT_FOUND).json({ status: NOT_FOUND, message: "Order not found" });
    }

    res.status(SUCCESS).json({ status: "SUCCESS", data: { order } });
});

export const createOrder = asyncWrapper(async (req , res) => {
    const { buyerId, products, productShippingDetails } = req.body;

    const buyer = await Users.findById(buyerId);
    
    if (!buyer) {
        return res.status(BAD_REQUEST).json({ 
            status: BAD_REQUEST, 
            message: "Buyer not found" 
        });
    }

    const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

    const order = new Orders({
      buyer: buyerId,
      products,
      productShippingDetails,
      totalAmount,
      status: "Pending"
    });

    await order.save();
    
    await order.populate('buyer', 'name email phone');

    res.status(SUCCESS).json({
        status: "SUCCESS", 
        message: "Order created successfully",
        data: { order } 
    });

});


export const updateOrder = asyncWrapper(async (req , res) => {
    const { id } = req.params;
    const { status, products, productShippingDetails } = req.body;

    const order = await Orders.findOne({ _id: id, deleted: false });
    
    if (!order) {
        return res.status(NOT_FOUND).json({ 
            status: NOT_FOUND, 
            message: "Order not found" 
        });
    }

    if (status) {
        const currentStatus = order.status;
        
        if (currentStatus === "Delivered" && status !== "Delivered") {
            return res.status(BAD_REQUEST).json({ 
                status: BAD_REQUEST, 
                message: "Cannot change status from Delivered to another status" 
            });
        }

        if (currentStatus === "Canceled" && (status === "Pending" || status === "Shipped")) {
            return res.status(BAD_REQUEST).json({ 
                status: BAD_REQUEST, 
                message: "Cannot change status from Canceled to Pending or Shipped" 
            });
        }

        order.status = status;
    }

    if (products) {
        order.products = products;
        order.totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    }

    if (productShippingDetails) {
        order.productShippingDetails = productShippingDetails;
    }

    await order.save();
    await order.populate('buyer', 'name email phone');

    res.status(SUCCESS).json({ 
        status: "SUCCESS", 
        message: "Order updated successfully",
        data: { order } 
    });
});

export const deleteOrder = asyncWrapper(async (req , res) => {
    const { id } = req.params;
    
    const order = await Orders.findOne({ _id: id, deleted: false });
    
    if (!order) {
        return res.status(NOT_FOUND).json({ 
            status: NOT_FOUND, 
            message: "Order not found" 
        });
    }

    order.deleted = true;
    
    await order.save();
    
    res.status(SUCCESS).json({ 
        status: "SUCCESS", 
        message: "Order deleted successfully" 
    });
});