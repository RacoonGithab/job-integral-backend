import {prismaClient} from "../config/prismaClient";
import {User} from "@prisma/client";


const getUserByEmail = async (email: string): Promise<User | null> => {
    return prismaClient.user.findUnique(
        {
            where: {
                email
            }
        });
}

const updateUserByEmail = async (email: string): Promise<void> => {
    await prismaClient.user.update({
        where: {
            email
        },
        data: {
            isVerified: true,
        }
    });
}

export const userRepository = {
    getUserByEmail,
    updateUserByEmail
}