import Wishlist from "../../models/wishlist/wishlist.model.js"
import { asyncWrapper } from "../../middleware/asyncWrapper.js";   
import AppError from "../../utils/errors/appError.js";
import productModel from "../../models/Products/product.model.js";
import mongoose from "mongoose";

 export const addToWishlist = asyncWrapper(async (req,res,next)=> {
   const id = req.params.product_id;

    let wishlist = await Wishlist.findOne({ user: req.user._id },{__v:false});

      if (!wishlist) {
    wishlist = new Wishlist({
      user: req.user._id,
      products: [id],
    });
  } else {
    if (!wishlist.products.includes(id)) {
      wishlist.products.push(id);
    }
    else {
        throw AppError.createError("product already exist in your wishlist",400,"FAIL")
    }
  }

await wishlist.save();
return res.status(201).json({
      status: "SUCCESS",
      message: "product added to wishlist successfully",
      data: { wishlist },
    });
}
 );

 export const getOne = asyncWrapper(async (req,res) =>{
    const data = [];
    const user_id = req.user._id;
    const wishlist = await Wishlist.findOne({user:user_id}) ;
    if(!wishlist){
        return res.status(400).json({
            status:"FAIL",
            message :"Your wishlist is empty"
        })
    }
    for (let i=0;i< wishlist.products.length;i++){
        const id = wishlist.products[i];
        const product = await productModel.findOne({_id:id,deleted:false});
        if(product){
            console.log(product)
            data.push ({name:product.name,price:product.price,images:product.images});
        }
    }
    res.status(200).json({ status: "SUCCESS", data: data });
 })

 export const updateWishlist = asyncWrapper(async (req,res)=>{

 })

 export const deleteOne = asyncWrapper (async (req,res) =>{
    const product_id = req.params.product_id;
    const user_id = req.user._id;
    const wishlist = await Wishlist.findOne({user:user_id});
    for (let i=0;i<wishlist.products.length;i++){
        if(wishlist.products[i]==product_id){
            await Wishlist.updateOne( { user: user_id },
  { $pull: { products: new mongoose.Types.ObjectId(product_id) } });
            break;
        }
    }

res.status(200).json({status:"SUCCESS",message:"product deleted successfully"})
 })