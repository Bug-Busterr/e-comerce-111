import Joi from "joi";

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "{{#label}} must be a valid ObjectId"
});

export const SignUpSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.min": "Name must be at least 1 characters",
        "string.max": "Name must be less than or equal to 100 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().messages({
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
    }),
    phone: Joi.string().regex(/^01[0-9]{9}$/).messages({
        "string.pattern.base": "Phone must start with 01 and be 11 digits",
        "string.empty": "Phone is required",
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

export const updatePasswordSchema = Joi.object({
      currentPassword: Joi.string().min(6).max(128).required().messages({
        "string.min": "currentPassword must be at least 6 characters",
        "string.max": "currentPassword must be less than or equal to 128 characters",
        "any.required": "currentPassword is required",
    }),
    newPassword: Joi.string().min(6).max(128).required().messages({
        "string.min": "newPassword must be at least 6 characters",
        "string.max": "newPassword must be less than or equal to 128 characters",
        "any.required": "newPassword is required",
    }),
      confirmPassword: Joi.string().min(6).max(128).required().messages({
        "string.min": "confirmPassword must be at least 6 characters",
        "string.max": "confirmPassword must be less than or equal to 128 characters",
        "any.required": "confirmPassword is required",
    })

});

export const CreateOrderSchema = Joi.object({
    buyerId: objectId.required().messages({
        "any.required": "Buyer ID is required",
    }),
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
    productShippingDetails: Joi.object({
        address: Joi.string().required().messages({
            "string.base": "Address must be a string",
            "string.empty": "Address is required",
            "any.required": "Address is required",
        }),
        phone: Joi.string().regex(/^01[0-9]{9}$/).required().messages({
            "string.pattern.base": "Phone must start with 01 and be 11 digits",
            "string.empty": "Phone is required",
            "any.required": "Phone is required",
        }),
    }).required().messages({
        "object.base": "Shipping details must be an object",
        "any.required": "Shipping details are required",
    }),
    status: Joi.string().valid("Pending", "Shipped", "Delivered", "Canceled").messages({
        "any.only": "Status must be one of: Pending, Shipped, Delivered, Canceled",
        "string.base": "Status must be a string",
    }),
    discountCode: Joi.string().min(3).max(20).messages({
        "string.base": "Discount code must be a string",
        "string.min": "Discount code must be at least 3 characters",
        "string.max": "Discount code must be less than 20 characters",
    }),
});

export const UpdateOrderSchema = Joi.object({
    status: Joi.string().valid("Pending", "Shipped", "Delivered", "Canceled").messages({
        "any.only": "Status must be one of: Pending, Shipped, Delivered, Canceled",
        "string.base": "Status must be a string",
    }),
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
    ).messages({
        "array.base": "Products must be an array",
        "array.min": "At least one product is required",
    }),
    productShippingDetails: Joi.object({
        address: Joi.string().required().messages({
            "string.base": "Address must be a string",
            "string.empty": "Address is required",
            "any.required": "Address is required",
        }),
        phone: Joi.string().regex(/^01[0-9]{9}$/).required().messages({
            "string.pattern.base": "Phone must start with 01 and be 11 digits",
            "string.empty": "Phone is required",
            "any.required": "Phone is required",
        }),
    }).messages({
        "object.base": "Shipping details must be an object",
    }),
}).min(1).messages({
    "object.min": "At least one field (status, products, or productShippingDetails) must be provided",
});