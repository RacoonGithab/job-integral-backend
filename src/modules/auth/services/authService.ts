import bcrypt from "bcryptjs";
import {userRepository} from "../repositories/userRepository";
import {
    LoginResultDto,
    loginUserDto,
    logoutUserDto,
    refreshServiceInputDto,
    verifyLoginCodeDto
} from "../../../types/dto/authDto";
import {v4 as uuidv4} from "uuid";
import {endOfDay, startOfDay} from "date-fns";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {temporaryPasswordRepository} from "../repositories/temporaryPasswordRepository";
import {tokenUtils} from "../../../utils/tokenUtils";
import {sessionsRepository} from "../repositories/sessionRepository";
import {createExpirationDate, createVerificationCode} from "../../../utils/createVerificationCode";
import {verificationCodeRepository} from "../repositories/verificationCodeRepository";
import {VerificationCodeType} from "@prisma/client";
import {EMAIL_DETAILS} from "../../../utils/constants/emailConstants";
import {sendVerificationEmail} from "../../../utils/sendVerificationCode";
import {passwordResetTokenRepository} from "../../reset-password/repositories/passwordResetTokenRepository";
import {env} from "../../../config/secrets";
import {tokenRedisUtil} from "../../../utils/tokenRedisUtils";


const loginUser = async (data: loginUserDto): Promise<LoginResultDto> => {
    const userDb =  await userRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (!userDb.password) {
        const temporaryPassword = await temporaryPasswordRepository.getTemporaryPasswordByUserId(userDb.id);

        if (!temporaryPassword) {
            throw new ApiError(401, error.INVALID_CREDENTIALS);
        }

        const isTempPasswordValid = await bcrypt.compare(data.password, temporaryPassword.passwordHash);

        if (!isTempPasswordValid) {
            throw new ApiError(401, error.INVALID_CREDENTIALS);
        }

        const dbVerificationCodesToday = await verificationCodeRepository.getVerificationCodesTodayByUserId({
            userId: userDb.id,
            startDate: startOfDay(new Date()),
            endDate: endOfDay(new Date()),
        });

        if (dbVerificationCodesToday.length >= env.MAX_DAILY_VERIFICATION_CODES) {
            throw new ApiError(429, error.VERIFICATION_CODE_LIMIT_REACHED);
        }

        const verificationCode = createVerificationCode();

        await verificationCodeRepository.createVerificationCode({
            userId: userDb.id,
            verificationCode: verificationCode,
            expiredAt: createExpirationDate(new Date()),
            createdAt: new Date(),
            type: VerificationCodeType.PASSWORD_RESET,
        });

        const emailDetails = EMAIL_DETAILS[VerificationCodeType.PASSWORD_RESET];

        await sendVerificationEmail(
            userDb.email,
            verificationCode,
            emailDetails.subject,
            emailDetails.fromName
        );

        await passwordResetTokenRepository.deactivateAllUserTokens({userId: userDb.id});

        const newPasswordResetToken = tokenUtils.generatePasswordResetToken(userDb.id);

        await passwordResetTokenRepository.createPasswordResetToken({
            userId: userDb.id,
            token: newPasswordResetToken,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return {
            isVerificationCodeRequired: true,
            passwordResetToken: newPasswordResetToken,
            code: "ACTIVE_SESSION_REQUIRES_OTP",
        };
    }

    const passwordMatch = await bcrypt.compare(data.password, userDb.password);

    if (!passwordMatch) {
        throw new ApiError(401, error.INCORRECT_PASSWORD);
    }

    const activeSession = await sessionsRepository.findActiveSessionByUserId(userDb.id);

    if (activeSession) {
        const dbVerificationCodesToday = await verificationCodeRepository.getVerificationCodesTodayByUserId({
            userId: userDb.id,
            startDate: startOfDay(new Date()),
            endDate: endOfDay(new Date()),
        });

        if (dbVerificationCodesToday.length >= env.MAX_DAILY_VERIFICATION_CODES) {
            throw new ApiError(429, error.VERIFICATION_CODE_LIMIT_REACHED);
        }

        const verificationCode = createVerificationCode();

        await verificationCodeRepository.createVerificationCode({
            userId: userDb.id,
            verificationCode: verificationCode,
            expiredAt: createExpirationDate(new Date()),
            createdAt: new Date(),
            type: VerificationCodeType.SECOND_FACTOR_LOGIN,
        });

        const emailDetails = EMAIL_DETAILS[VerificationCodeType.SECOND_FACTOR_LOGIN];

        await sendVerificationEmail(
            userDb.email,
            verificationCode,
            emailDetails.subject,
            emailDetails.fromName
        );

        return {
            isVerificationCodeRequired: true,
            userId: userDb.id,
            message: error.ACTIVE_SESSION_EXISTS,
            code: "ACTIVE_SESSION_REQUIRES_OTP",
        };
    }

    const createSession = await sessionsRepository.createSession({
        userId: userDb.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const commonJti = uuidv4();

    const accessToken = tokenUtils.generateAccessToken({
        userId: userDb.id,
        role: userDb.role,
        sessionId: createSession.id,
        jti: commonJti,
    });

    const refreshToken = tokenUtils.generateRefreshToken({
        userId: userDb.id,
        sessionId: createSession.id,
        jti: commonJti
    });

    return {
        accessToken,
        refreshToken,
    }
}

const verifyLoginCode = async (data: verifyLoginCodeDto): Promise<LoginResultDto> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const dbVerificationCode = await verificationCodeRepository.getLastActiveVerificationCode({
        userId: userDb.id,
        type: VerificationCodeType.SECOND_FACTOR_LOGIN
    });

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

    const createSession = await sessionsRepository.createSession({
        userId: userDb.id,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const commonJti = uuidv4();

    const accessToken = tokenUtils.generateAccessToken({
        userId: userDb.id,
        role: userDb.role,
        sessionId: createSession.id,
        jti: commonJti,
    });

    const refreshToken = tokenUtils.generateRefreshToken({
        userId: userDb.id,
        sessionId: createSession.id,
        jti: commonJti
    });
    return {
        accessToken,
        refreshToken,
    }


}

const refreshTokens = async (data: refreshServiceInputDto): Promise<LoginResultDto> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const sessionDb = await sessionsRepository.findActiveBySessionAndUserId({
        userId: data.userId,
        sessionId: data.sessionId
    })

    if (!sessionDb || !sessionDb.isActive) {
        throw new ApiError(401, error.INVALID_TOKEN_HEADER);
    }

    await tokenRedisUtil.addJtiToBlacklist(data.jti, data.exp)

    await sessionsRepository.updateSession({
        id: sessionDb.id,
        updatedAt: new Date(),
    });

    const commonJti = uuidv4();

    const accessToken = tokenUtils.generateAccessToken({
        userId: userDb.id,
        role: userDb.role,
        sessionId: sessionDb.id,
        jti: commonJti,
    });

    const refreshToken = tokenUtils.generateRefreshToken({
        userId: userDb.id,
        sessionId: sessionDb.id,
        jti: commonJti
    });

    return {
        accessToken,
        refreshToken,
    };
}

const logoutUser = async (data: logoutUserDto) => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const sessionDb = await sessionsRepository.findActiveBySessionAndUserId({
        userId: data.userId,
        sessionId: data.sessionId
    });

    if (!sessionDb || !sessionDb.isActive) {
        throw new ApiError(401, error.INVALID_TOKEN_HEADER);
    }

    await sessionsRepository.deactivationSession({
        userId: data.userId,
        sessionId: sessionDb.id,
        isActive: false,
        updatedAt: new Date()
    });

}

export const authService = {
    loginUser,
    verifyLoginCode,
    refreshTokens,
    logoutUser
}