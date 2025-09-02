import { asyncWrapper } from '../../middleware/asyncWrapper.js';
import Cart from '../../models/cart/cart.model.js';
import Products from '../../models/Products/product.model.js';
import { SUCCESS, BAD_REQUEST, NOT_FOUND, CREATED } from '../../utils/http_status_code.js';

export const addToCart = asyncWrapper(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const buyerId = req.user.id;

    const product = await Products.findById(productId);
    if (!product) {
        return res.status(NOT_FOUND).json({
            status: NOT_FOUND,
            message: "Product not found"
        });
    }

    if (product.deleted) {
        return res.status(BAD_REQUEST).json({
            status: BAD_REQUEST,
            message: "Product is no longer available"
        });
    }

    if (product.stockQuantity < quantity) {
        return res.status(BAD_REQUEST).json({
            status: BAD_REQUEST,
            message: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${quantity}`
        });
    }

    let cart = await Cart.findOne({ buyer: buyerId, deleted: false });
    
    if (!cart) {
        cart = new Cart({
            buyer: buyerId,
            items: []
        });
    }

    const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        if (product.stockQuantity < newQuantity) {
            return res.status(BAD_REQUEST).json({
                status: BAD_REQUEST,
                message: `Cannot add ${quantity} more items. Total would be ${newQuantity}, but only ${product.stockQuantity} available`
            });
        }
        cart.items[existingItemIndex].quantity = newQuantity;
    } else {
        cart.items.push({
            product: productId,
            quantity: quantity
        });
    }

    await cart.calculateTotalPrice();
    await cart.save();
    await cart.populate([
        { path: 'buyer', select: 'name email' },
        { path: 'items.product', select: 'name price stockQuantity images' }
    ]);

    res.status(CREATED).json({
        status: "SUCCESS",
        message: "Product added to cart successfully",
        data: { cart }
    });
});

export const getCart = asyncWrapper(async (req, res) => {
    const buyerId = req.user.id;

    const cart = await Cart.findOne({ buyer: buyerId, deleted: false })
        .populate([
            { path: 'buyer', select: 'name email' },
            { path: 'items.product', select: 'name price stockQuantity images category' }
        ]);

    if (!cart || cart.items.length === 0) {
        return res.status(SUCCESS).json({
            status: "SUCCESS",
            message: "Your cart is empty",
            data: { 
                cart: {
                    buyer: buyerId,
                    items: [],
                    totalPrice: 0
                }
            }
        });
    }

    await cart.calculateTotalPrice();
    await cart.save();

    res.status(SUCCESS).json({
        status: "SUCCESS",
        message: "Cart retrieved successfully",
        data: { cart }
    });
});

export const updateCartItem = asyncWrapper(async (req, res) => {
    const { productId, quantity } = req.body;
    const buyerId = req.user.id;

    if (quantity < 1) {
        return res.status(BAD_REQUEST).json({
            status: BAD_REQUEST,
            message: "Quantity must be at least 1"
        });
    }

    const cart = await Cart.findOne({ buyer: buyerId, deleted: false });
    if (!cart) {
        return res.status(NOT_FOUND).json({
            status: NOT_FOUND,
            message: "Cart not found"
        });
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        return res.status(NOT_FOUND).json({
            status: NOT_FOUND,
            message: "Product not found in cart"
        });
    }

    const product = await Products.findById(productId);
    if (!product) {
        return res.status(NOT_FOUND).json({
            status: NOT_FOUND,
            message: "Product not found"
        });
    }

    if (product.stockQuantity < quantity) {
        return res.status(BAD_REQUEST).json({
            status: BAD_REQUEST,
            message: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${quantity}`
        });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.calculateTotalPrice();
    await cart.save();

    await cart.populate([
        { path: 'buyer', select: 'name email' },
        { path: 'items.product', select: 'name price stockQuantity images' }
    ]);

    res.status(SUCCESS).json({
        status: "SUCCESS",
        message: "Cart item updated successfully",
        data: { cart }
    });
});

export const removeFromCart = asyncWrapper(async (req, res) => {
    const { productId } = req.params;
    const buyerId = req.user.id;

    const cart = await Cart.findOne({ buyer: buyerId, deleted: false });
    if (!cart) {
        return res.status(NOT_FOUND).json({
            status: NOT_FOUND,
            message: "Cart not found"
        });
    }

    const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        return res.status(NOT_FOUND).json({
            status: NOT_FOUND,
            message: "Product not found in cart"
        });
    }

    cart.items.splice(itemIndex, 1);

    await cart.calculateTotalPrice();
    await cart.save();

    await cart.populate([
        { path: 'buyer', select: 'name email' },
        { path: 'items.product', select: 'name price stockQuantity images' }
    ]);

    res.status(SUCCESS).json({
        status: "SUCCESS",
        message: "Product removed from cart successfully",
        data: { cart }
    });
});

export const clearCart = asyncWrapper(async (req, res) => {
    const buyerId = req.user.id;

    const cart = await Cart.findOne({ buyer: buyerId, deleted: false });
    if (!cart) {
        return res.status(NOT_FOUND).json({
            status: NOT_FOUND,
            message: "Cart not found"
        });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(SUCCESS).json({
        status: "SUCCESS",
        message: "Cart cleared successfully",
        data: { cart }
    });
});
