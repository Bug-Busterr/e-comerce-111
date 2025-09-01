import Jwt from "jsonwebtoken";


export const protect = async (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "ERROR", message: "Token is required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const currentUser = Jwt.verify(token, process.env.JWT_SECRET);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    return res.status(401).json({ status: "Error", message: "Invalid Token" });
  }
};
