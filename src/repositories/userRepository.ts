import {prismaClient} from "../config/prismaClient";
import {User} from "@prisma/client";
import {updateUserPasswordDto} from "../types/dto/userDto";


const getUserByEmail = async (email: string): Promise<User | null> => {
    return prismaClient.user.findUnique(
        {
            where: {
                email
            }
        });
}

const getUserById = async (userId: string): Promise<User | null> => {
    return prismaClient.user.findUnique({
        where: {
            id: userId
        }
    });
}

const updateUserVerificationStatus = async (email: string): Promise<void> => {
    await prismaClient.user.update({
        where: {
            email
        },
        data: {
            isVerified: true,
        }
    });
}

const updateUserPassword = async (data: updateUserPasswordDto): Promise<void> => {
    await prismaClient.user.update({
        where: {
            id: data.userId
        },
        data: {
            password: data.newPassword,
        },
    });
};

export const userRepository = {
    getUserByEmail,
    updateUserVerificationStatus,
    getUserById,
    updateUserPassword
}