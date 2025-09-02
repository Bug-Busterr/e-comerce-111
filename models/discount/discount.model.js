import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
    inactive: {
      type: Boolean,
      default: false, 
    },
    inactiveUntil: {
      type: Date,
      default: null, 
    },
  },
  { timestamps: true }
);

discountSchema.pre("find", function (next) {
  const now = new Date();
  this.where({
    $or: [
      { inactive: false },
      { inactive: true, inactiveUntil: { $gt: now } }, 
    ],
  });
  next();
});

discountSchema.pre("findOne", function (next) {
  const now = new Date();
  this.where({
    $or: [
      { inactive: false },
      { inactive: true, inactiveUntil: { $gt: now } },
    ],
  });
  next();
});

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
