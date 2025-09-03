import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
