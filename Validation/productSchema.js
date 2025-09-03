import Joi from "joi";

export const productValidationSchema = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be less than or equal to 20 characters",
  }),
  description: Joi.string().max(300).messages({
    "string.empty": "Description must be string",
    "string.max": "Description must be less than or equal to 300 characters",
  }),
  price: Joi.number().min(5).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative or zero",
    "any.required": "Price is required",
  }),
  stockQuantity: Joi.number().min(0).required().messages({
    "number.base": "Stock quantity must be a number",
    "number.min": "Stock quantity cannot be negative",
    "any.required": "Stock quantity is required",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().messages({
        "string.empty": "Image URL is required",
        "string.uri": "Image URL must be valid",
      }),
    })
  ),
});

export const productUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than or equal to 20 characters",
  }),
  description: Joi.string().min(3).max(300).messages({
    "string.min": "description must be at least 3 characters",
    "string.empty": "Description must be string",
    "string.max": "Description must be less than or equal to 300 characters",
  }),
  price: Joi.number().min(5).messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative or zero",
  }),
  stockQuantity: Joi.number().min(0).messages({
    "number.base": "Stock quantity must be a number",
    "number.min": "Stock quantity cannot be negative",
  }),
  category: Joi.string().min(3).messages({
    "string.min": "category must be at least 3 characters",
    "string.base": "Category must be string",
  }),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().messages({
        "string.empty": "Image URL is required",
        "string.uri": "Image URL must be valid",
      }),
    })
  ),
});
