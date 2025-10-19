import {UserProfile} from "@prisma/client";
import {prismaClient} from "../../../config/prismaClient";
import {createUserProfileRepoDto, updateUserProfileRepoDto} from "../../../types/dto/user-profile/userProfileRepoDto";


const getUserProfileData = async (userId: string): Promise<UserProfile | null> => {
    return prismaClient.userProfile.findUnique({
        where: {
            userId: userId,
        }
    })
}

const createUserProfileById = async (data: createUserProfileRepoDto): Promise<void> => {
    await prismaClient.userProfile.create({
        data: data
    })
}

const updateUserProfileById = async (userId: string, data: updateUserProfileRepoDto): Promise<void> => {
    await prismaClient.userProfile.update({
        where: { userId: userId },
        data,
    });
};

export const userProfileRepository = {
    getUserProfileData,
    createUserProfileById,
    updateUserProfileById
}