import {prismaClient} from "../config/prismaClient";
import {Roles, User} from "@prisma/client";
import {updateUserPasswordDto} from "../types/dto/userDto";
import {updateUserRoleDto} from "../types/dto/updateUserRoleDto";


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

const updateUserRoleById = async (userId: string, newRole: Roles): Promise<User | null> => {
    return prismaClient.user.update({
        where: {id: userId},
        data: {role: newRole}
    })
}

export const userRepository = {
    getUserByEmail,
    getUserById,
    updateUserPassword,
    updateUserRoleById
}