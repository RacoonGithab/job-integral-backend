import bcrypt from "bcryptjs";

async function hashPassword(password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(hashedPassword);
}

hashPassword('diiwebadn');