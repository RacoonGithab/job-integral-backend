import bcrypt from "bcryptjs";
import {userRepository} from "../repositories/userRepository";
import {loginUserDto} from "../types/dto/authDto";
import {tokenDto} from "../types/dto/tokenDto";
import ApiError from "../error/ApiError";
import {error} from "../utils/constants/errorMasseges";
import {temporaryPasswordRepository} from "../repositories/temporaryPasswordRepository";
import {tokenUtils} from "../utils/tokenUtils";
import {sessionsRepository} from "../repositories/sessionRepository";
import {createExpirationDate, createVerificationCode} from "../utils/createVerificationCode";
import {verificationCodeRepository} from "../repositories/verificationCodeRepository";
import {VerificationCodeType} from "@prisma/client";
import {EMAIL_DETAILS} from "../utils/constants/emailConstants";
import {sendVerificationEmail} from "../utils/sendVerificationCode";


const loginUser = async (data: loginUserDto): Promise<tokenDto> => {
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

        await userRepository.updateUserVerificationStatus(userDb.email)

        const passwordResetToken = tokenUtils.generatePasswordResetToken(userDb.id);

        return {
            accessToken: null,
            refreshToken: null,
            passwordResetToken: passwordResetToken
        };
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    const passwordMatch = await bcrypt.compare(data.password, userDb.password);

    if (!passwordMatch) {
        throw new ApiError(401, error.INCORRECT_PASSWORD);
    }

    const activeSession = await sessionsRepository.findActiveSessionByUserId(userDb.id);

    if (activeSession) {
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

        throw new ApiError(409, error.ACTIVE_SESSION_EXISTS)
    }

    const accessToken = tokenUtils.generateAccessToken({ userId: userDb.id, role: userDb.role });

    const refreshToken = tokenUtils.generateRefreshToken({ userId: userDb.id});

    await sessionsRepository.createSession({
        userId: userDb.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return {
        accessToken,
        refreshToken,
        passwordResetToken: null
    }
}

export const authService = {
    loginUser
}