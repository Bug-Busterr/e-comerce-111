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

router.route('/')
    .get(getCart)                                    
    .post(validate(AddToCartSchema), addToCart)     
    .put(validate(UpdateCartItemSchema), updateCartItem) 
    .delete(clearCart); 

router.route('/item/:productId')
    .delete(removeFromCart);         

export default router;
