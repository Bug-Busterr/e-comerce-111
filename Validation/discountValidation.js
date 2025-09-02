import Joi from "joi";

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "{{#label}} must be a valid ObjectId"
});

export const ValidateDiscountCodeSchema = Joi.object({
    discountCode: Joi.string().min(3).max(20).required().messages({
        "string.base": "Discount code must be a string",
        "string.min": "Discount code must be at least 3 characters",
        "string.max": "Discount code must be less than 20 characters",
        "any.required": "Discount code is required",
    }),
});

export const PreviewDiscountSchema = Joi.object({
    products: Joi.array().min(1).items(
        Joi.object({
            product: objectId.required().messages({
                "any.required": "Product ID is required",
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                "number.base": "Quantity must be a number",
                "number.integer": "Quantity must be an integer",
                "number.min": "Quantity must be positive and not negative",
                "any.required": "Quantity is required",
            }),
        })
    ).required().messages({
        "array.base": "Products must be an array",
        "array.min": "At least one product is required",
        "any.required": "Products array is required",
    }),
    discountCode: Joi.string().min(3).max(20).messages({
        "string.base": "Discount code must be a string",
        "string.min": "Discount code must be at least 3 characters",
        "string.max": "Discount code must be less than 20 characters",
    }),
});

export const CreateDiscountSchema = Joi.object({
    code: Joi.string().min(3).max(20).required().messages({
        "string.base": "Discount code must be a string",
        "string.min": "Discount code must be at least 3 characters",
        "string.max": "Discount code must be less than 20 characters",
        "any.required": "Discount code is required",
    }),
    percentage: Joi.number().min(0).max(100).required().messages({
        "number.base": "Percentage must be a number",
        "number.min": "Percentage must be at least 0",
        "number.max": "Percentage cannot exceed 100",
        "any.required": "Percentage is required",
    }),
    description: Joi.string().max(200).messages({
        "string.base": "Description must be a string",
        "string.max": "Description must be less than 200 characters",
    }),
    expiresAt: Joi.date().greater('now').messages({
        "date.base": "Expiration date must be a valid date",
        "date.greater": "Expiration date must be in the future",
    }),
    isActive: Joi.boolean().messages({
        "boolean.base": "isActive must be a boolean",
    }),
});

export const UpdateDiscountSchema = Joi.object({
    code: Joi.string().min(3).max(20).messages({
        "string.base": "Discount code must be a string",
        "string.min": "Discount code must be at least 3 characters",
        "string.max": "Discount code must be less than 20 characters",
    }),
    percentage: Joi.number().min(0).max(100).messages({
        "number.base": "Percentage must be a number",
        "number.min": "Percentage must be at least 0",
        "number.max": "Percentage cannot exceed 100",
    }),
    description: Joi.string().max(200).messages({
        "string.base": "Description must be a string",
        "string.max": "Description must be less than 200 characters",
    }),
    expiresAt: Joi.date().greater('now').messages({
        "date.base": "Expiration date must be a valid date",
        "date.greater": "Expiration date must be in the future",
    }),
    isActive: Joi.boolean().messages({
        "boolean.base": "isActive must be a boolean",
    }),
}).min(1).messages({
    "object.min": "At least one field must be provided for update",
});
