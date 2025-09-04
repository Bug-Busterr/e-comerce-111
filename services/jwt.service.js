import Jwt from "jsonwebtoken";


export const generateToken = (name, email, phone, _id,role) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = "30d";
    const token = Jwt.sign({ name, email, phone, _id,role  }, secret, { expiresIn });
    return token;
};
