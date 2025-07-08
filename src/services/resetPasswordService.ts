import {resetPasswordDto} from "../types/dto/resetPasswordDto";
import {userRepository} from "../repositories/userRepository";
import ApiError from "../error/ApiError";
import {error} from "../utils/constants/errorMasseges";
import {createPasswordHash} from "../utils/createPasswordHash";
import {tokenRedisUtil} from "../utils/tokenRedisUtils";
import {verifyPasswordResetDto} from "../types/dto/passwoedResetTokenDto";
import {verificationCodeRepository} from "../repositories/verificationCodeRepository";
import {VerificationCodeType} from "@prisma/client";
import {env} from "../config/secrets";
import {passwordResetTokenRepository} from "../repositories/passwordResetTokenRepository";

const verifyPasswordResetCode = async (data: verifyPasswordResetDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    const dbResetToken = await passwordResetTokenRepository.getPasswordResetTokenByUserId({
        token: data.resetToken,
        userId: data.userId,
    });

    if (!dbResetToken) {
        throw new ApiError(401, error.INVALID_TOKEN_HEADER);
    }

    const dbVerificationCode = await verificationCodeRepository.getLastActiveVerificationCode({
        userId: userDb.id,
        type: VerificationCodeType.PASSWORD_RESET
    })

    if (!dbVerificationCode) {
        throw new ApiError(404, error.VERIFICATION_CODE_NOT_FOUND);
    }

    if (data.verificationCode !== dbVerificationCode.verificationCode) {
        const updatedCode = await verificationCodeRepository.incrementCodeAttempts(dbVerificationCode.id);

        if (updatedCode.attempts >= env.MAX_CODE_ATTEMPTS) {
            await verificationCodeRepository.updateVerificationCodeById({
                id: dbVerificationCode.id,
                updatedAt: new Date(),
            });
            throw new ApiError(400, error.VERIFICATION_CODE_EXCEEDED_ATTEMPTS_LIMIT);
        }

        throw new ApiError(400, error.VERIFICATION_CODE_MISMATCH);
    }

    if (new Date() > dbVerificationCode.expiredAt) {
        await verificationCodeRepository.updateVerificationCodeById({
            id: dbVerificationCode.id,
            updatedAt: new Date(),
        })
        throw new ApiError(400, error.VERIFICATION_CODE_EXPIRED);
    }

    await verificationCodeRepository.updateVerificationCodeById({
        id: dbVerificationCode.id,
        updatedAt: new Date(),
    });

    await passwordResetTokenRepository.confirmPasswordResetToken({
        id: dbResetToken.id,
        updatedAt: new Date()
    });
}

const resetPassword = async (data: resetPasswordDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const dbResetToken = await passwordResetTokenRepository.getConfirmedPasswordResetToken({
        userId: data.userId,
        token: data.resetToken
    });

    if (!dbResetToken) {
        throw new ApiError(400, error.INVALID_TOKEN_HEADER);
    }

    await userRepository.updateUserPassword({
        userId: data.userId,
        newPassword: await createPasswordHash(data.newPassword),
    });


    await tokenRedisUtil.blackListToken(data.resetToken)
}

export const resetPasswordService = {
    verifyPasswordResetCode,
    resetPassword
}