import Jwt from "jsonwebtoken";
import {UnAuthorizedError} from "../utils/errors/appError.js";

export const generateToken = (name, email, phone, _id) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = "5m";
    const token = Jwt.sign({ name, email, phone, _id }, secret, { expiresIn });
    return token;
};

// export const verifyToken = (token) => {
//     try {
//         const decodedToken = Jwt.verify(token, process.env.JWT_SECRET);
//         return decodedToken;
//     } catch (error) {
//         throw new UnAuthorizedError("Invalid or expired Token");
//     }
// };

export const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
  return  res.status(401).json({ status: ERROR, message: "Token is required" });
  }
  const token = authHeader.split(" ")[1];
  try {
   const currentUser= Jwt.verify(token, process.env.JWT_SECRET);
   req.currentUser=currentUser;
    next();
  } catch (err) {
   return res.status(401).json({ status: "Error", message: "Invalid Token" });
  }
};

