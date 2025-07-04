import {VerificationCodeType} from "@prisma/client";

export interface createVerificationCodeDto {
    userId: string;
    verificationCode: string;
    expiredAt: Date;
    createdAt: Date;
    type: VerificationCodeType;
}