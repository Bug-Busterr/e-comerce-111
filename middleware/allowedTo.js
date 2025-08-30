import {UnAuthorizedError} from "../utils/errors/appError.js";

export const allowedTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.currentUser.role)) {
            return next();
        }
        next(UnAuthorizedError);
    }
}
