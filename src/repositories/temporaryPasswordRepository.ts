import {TemporaryPassword} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";


const getTemporaryPasswordByUserId = async (userId: string): Promise<TemporaryPassword | null> => {
    return prismaClient.temporaryPassword.findUnique(
        {
            where: {
                userId
            }
        })
}

export const temporaryPasswordRepository = {
    getTemporaryPasswordByUserId
}