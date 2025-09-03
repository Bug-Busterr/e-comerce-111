import express from "express";
import { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} from "../../controllers/cart/cart.controller.js";
import { validate } from "../../middleware/validate.js";
import { AddToCartSchema, UpdateCartItemSchema } from "../../Validation/cartValidation.js";
import { protect } from "../../middleware/authMiddleware.js";
import { allowedTo } from "../../middleware/allowedTo.js";
import { userRoles } from "../../utils/userRoles.js";

const router = express.Router();

router.use(protect);
router.use(allowedTo(userRoles.USER));

router.get('/' , getCart)                           
router.post('/' , validate(AddToCartSchema), addToCart)     
router.put('/' , validate(UpdateCartItemSchema), updateCartItem) 
router.delete('/' , clearCart); 
router.delete('/item/:productId' , removeFromCart);         

export default router;
