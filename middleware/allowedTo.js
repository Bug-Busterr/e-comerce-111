import appError from "../utils/errors/appError.js";

export const allowedTo= (role) => {
  return (req, res, next) => {
    if (role!==req.currentUser.role) {
      return next(appError.createError("this role is not authorized", 401));
    }
    next();
  };
};
