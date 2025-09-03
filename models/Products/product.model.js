import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stockQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category",
        required: true
    },
    images: {
        type: [String],   
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); 

export default mongoose.model("Product", productSchema);