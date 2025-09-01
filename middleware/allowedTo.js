import {UnAuthorizedError} from "../utils/errors/appError.js";

export const allowedTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new UnAuthorizedError("You are not authorized to access this resource"));
        }
        next();
    }
}
