import {prismaClient} from "../config/prismaClient";
import { Session } from '@prisma/client';
import {createSessionDto, updateSessionDto} from "../types/dto/sessionDto";
import {refreshTokenDto} from "../types/dto/sessionDto";
import {logoutUserDto} from "../types/dto/authDto";


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

const findActiveBySessionAndUserId = async (data: refreshTokenDto): Promise<Session | null> => {
    return prismaClient.session.findUnique({
        where: {
            userId: data.userId,
            id: data.sessionId,
            isActive: true,
        }
    })
}

const updateSession = async (data: updateSessionDto): Promise<void> => {
    await prismaClient.session.update({
        where: {
            id: data.id
        },
        data: {
            updatedAt: data.updatedAt,
        }
    })
}

const deactivationSession = async (data: logoutUserDto): Promise<void> => {
    await prismaClient.session.update({
        where: {
            userId: data.userId,
            id: data.sessionId
        },
        data: {
            isActive: false,
            updatedAt: data.updatedAt
        }
    })
}


export const sessionsRepository = {
    findActiveSessionByUserId,
    createSession,
    findActiveBySessionAndUserId,
    updateSession,
    deactivationSession
}