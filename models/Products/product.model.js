import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type:  Number,
        required: true,
    },
    stockQuantity: {
        type: Number,
        required: true,
        
    },
    category: {
        type: String,
        enum: ['Phones', 'Computers', 'SmartWatch', 'Camera', 'HeadPhones', 'Gaming',]
    },
       images: [
  {
    url: {
      type: String
    }
  }
],
    deleted:{
        type: Boolean,
        default:false
    }
})


export default mongoose.model('products', productSchema);