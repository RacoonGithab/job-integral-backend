import {prismaClient} from "../../../config/prismaClient";
import {User} from "@prisma/client";
import {updateUserPasswordDto} from "../../../types/dto/userDto";
import {updateRoleDto} from "../../../types/dto/updateUserRoleDto";


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

const updateUserRoleById = async (data: updateRoleDto): Promise<User | null> => {
    return prismaClient.user.update({
        where: {id: data.userId},
        data: {role: data.newRole}
    })
}

export const userRepository = {
    getUserByEmail,
    getUserById,
    updateUserPassword,
    updateUserRoleById
}