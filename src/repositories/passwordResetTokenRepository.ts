import {
    confirmPasswordResetTokenDto,
    createPasswordResetTokenDto,
    getPasswordResetTokenDto
} from "../types/dto/passwoedResetTokenDto";
import {PasswordResetToken} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";


const createPasswordResetToken = async (data: createPasswordResetTokenDto): Promise<PasswordResetToken> => {
    return prismaClient.passwordResetToken.create({data})
}


const getPasswordResetTokenByUserId = (data: getPasswordResetTokenDto): Promise<PasswordResetToken | null> => {
    return prismaClient.passwordResetToken.findFirst({
        where: {
            userId: data.userId,
            token: data.token,
            isActive: true,
        }
    })
}

const confirmPasswordResetToken = async (data: confirmPasswordResetTokenDto): Promise<void> => {
    await prismaClient.passwordResetToken.update({
    where: {
        id: data.id
    },
    data: {
        isConfirmed: true,
        updatedAt: data.updatedAt,
    }
    })
}

export const getConfirmedPasswordResetToken = async (data: getPasswordResetTokenDto): Promise<PasswordResetToken | null> => {
    return prismaClient.passwordResetToken.findFirst({
        where: {
            userId: data.userId,
            token: data.token,
            isActive: true,
            isConfirmed: true,
        },
    });
};

export const passwordResetTokenRepository = {
    createPasswordResetToken,
    getPasswordResetTokenByUserId,
    confirmPasswordResetToken,
    getConfirmedPasswordResetToken
}