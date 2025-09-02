import Joi from "joi";

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "{{#label}} must be a valid ObjectId"
});

export const AddToCartSchema = Joi.object({
    productId: objectId.required().messages({
        "any.required": "Product ID is required",
    }),
    quantity: Joi.number().integer().min(1).default(1).messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
    }),
});

export const UpdateCartItemSchema = Joi.object({
    productId: objectId.required().messages({
        "any.required": "Product ID is required",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required",
    }),
});
