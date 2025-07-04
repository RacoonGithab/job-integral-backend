import {prismaClient} from "../config/prismaClient";
import { Session } from '@prisma/client';
import {createSessionDto} from "../types/dto/sessionDto";


const createSession = async (data: createSessionDto): Promise<Session> => {
    return prismaClient.session.create({data})
}

const findActiveSessionByUserId = async (userId: string): Promise<Session | null> => {
    return prismaClient.session.findFirst({
        where: {
            userId: userId,
            isActive: true,
        },
    });
}


export const sessionsRepository = {
    findActiveSessionByUserId,
    createSession
}