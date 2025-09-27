import {UserProfile} from "@prisma/client";
import {prismaClient} from "../../../config/prismaClient";


const getUserProfileData = async (userId: string): Promise<UserProfile | null> => {
    return prismaClient.userProfile.findUnique({
        where: {
            userId: userId,
        }
    })
}

export const userProfileRepository = {
    getUserProfileData,
}