import {VerificationCodeType} from "@prisma/client";

export interface createVerificationCodeDto {
    userId: string;
    verificationCode: string;
    expiredAt: Date;
    createdAt: Date;
    type: VerificationCodeType;
}

export interface verifyVerificationCodeDto {
    userId: string;
    type: VerificationCodeType;
}

export interface updateVerificationCodeDto {
    id: string,
    updatedAt: Date
}