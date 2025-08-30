import bcrypt from "bcrypt";

const salt = 10;

export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function ComparePassword(password, hashingPassword) {
    const match = await bcrypt.compare(password, hashingPassword);
    return match;
}
