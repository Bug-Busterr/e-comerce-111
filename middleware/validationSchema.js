import Joi from "joi";

export const SignUpSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.min": "Name must be at least 1 characters",
        "string.max": "Name must be less than or equal to 100 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(128).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must be less than or equal to 128 characters",
        "any.required": "Password is required",
    }),
    role: Joi.string().valid("user", "admin").default("user").messages({
        "any.only": "Role must be either 'user' or 'admin'",
        "string.base": "Role must be a string",
    }),
});