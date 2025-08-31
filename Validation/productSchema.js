import Joi from 'joi';


export const productValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
  }),
  description: Joi.string().messages({
    'string.empty': 'Description must be string',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  stockQuantity: Joi.number().min(0).required().messages({
    'number.base': 'Stock quantity must be a number',
    'number.min': 'Stock quantity cannot be negative',
    'any.required': 'Stock quantity is required',
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
  }),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().messages({
        'string.empty': 'Image URL is required',
        'string.uri': 'Image URL must be valid',
      })
    })
  )
});

