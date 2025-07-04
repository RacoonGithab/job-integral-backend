import {createVerificationCodeDto} from "../types/dto/verificationCodeDto";
import {VerificationCode} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";


const createVerificationCode = async (data: createVerificationCodeDto): Promise<VerificationCode> => {
    return prismaClient.verificationCode.create({data})
}

export const verificationCodeRepository = {
    createVerificationCode,
}