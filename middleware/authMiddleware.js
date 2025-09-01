import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { UNAUTHORIZED } from "../utils/http_status_code.js";

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded._id).select("-password");
            if (!req.user) {
                return res.status(UNAUTHORIZED).json({ 
                    status: "error",
                    message: "Not authorized, user not found",
                    data: null 
                });
            }
            next();
        } catch (error) {
            return res.status(UNAUTHORIZED).json({ 
                status: "error",
                message: "Invalid or expired Token",
                data: null 
            });
        }
    } else {
        return res.status(401).json({ 
            status: "error",
            message: "Not authorized, no token",
            data: null 
        });
    }
};
