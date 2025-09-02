import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "products",
        required: true 
      },
      quantity: { type: Number, required: true },
    }
  ],
  productShippingDetails: {
    address: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Canceled"],
    default: "Pending"
  },
  discountCode: {
    type: String,
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  originalAmount: {
    type: Number,
    required: true
  },
  totalAmount: { type: Number, required: true },
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model("orders" , orderSchema);