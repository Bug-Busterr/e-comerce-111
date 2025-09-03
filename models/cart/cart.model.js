import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      }
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Only add the items.product index since buyer already has unique constraint
cartSchema.index({ "items.product": 1 });

cartSchema.methods.calculateTotalPrice = async function() {
  await this.populate('items.product', 'price');
  let total = 0;
  for (const item of this.items) {
    if (item.product && item.product.price) {
      total += item.product.price * item.quantity;
    }
  }
  this.totalPrice = total;
  return total;
};

export default mongoose.model("carts", cartSchema);