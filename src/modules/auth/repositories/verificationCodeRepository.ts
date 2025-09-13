import {
    createVerificationCodeDto, getVerificationCodesDto,
    updateVerificationCodeDto,
    verifyVerificationCodeDto
} from "../../../types/dto/verificationCodeDto";
import {VerificationCode} from "@prisma/client";
import {prismaClient} from "../../../config/prismaClient";


const createVerificationCode = async (data: createVerificationCodeDto): Promise<VerificationCode> => {
    return prismaClient.verificationCode.create({data})
}

const getLastActiveVerificationCode = async (data: verifyVerificationCodeDto):Promise<VerificationCode | null> => {
    return prismaClient.verificationCode.findFirst({
        where: {
            userId: data.userId,
            isActive: true,
            type: data.type
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

const incrementCodeAttempts = async (codeId: string): Promise<VerificationCode> => {
    return prismaClient.verificationCode.update({
        where: {
            id: codeId,
        },
        data: {
            attempts: { increment: 1 },
            updatedAt: new Date(),
        }
    });
};

const updateVerificationCodeById = async (data: updateVerificationCodeDto): Promise<void> => {
    await prismaClient.verificationCode.update({
        where: {
            id: data.id,
        },
        data: {
            isActive: false,
            updatedAt: data.updatedAt,
        }
    });
}

const getVerificationCodesTodayByUserId = async (data: getVerificationCodesDto): Promise<VerificationCode[]> => {
    return prismaClient.verificationCode.findMany({
        where: {
            userId: data.userId,
            createdAt: {
                gte: data.startDate,
                lte: data.endDate,
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    });
}

export const verificationCodeRepository = {
    createVerificationCode,
    getLastActiveVerificationCode,
    incrementCodeAttempts,
    updateVerificationCodeById,
    getVerificationCodesTodayByUserId
}