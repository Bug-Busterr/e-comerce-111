import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().allow("").optional(),
});

export const addProductSchema = Joi.object({
  productId: Joi.string().required(),
});