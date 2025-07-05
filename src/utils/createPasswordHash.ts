import bcrypt from "bcryptjs";

export const createPasswordHash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 12);
}