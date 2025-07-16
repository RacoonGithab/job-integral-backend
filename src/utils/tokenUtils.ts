import { Request } from "express";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import {env} from "../config/secrets";
import {
    accessTokenPayload,
    generateAccessTokenDto,
    generateRefreshTokenDto,
    refreshTokenPayload, resetTokenPayload
} from "../types/dto/tokenDto";
import {PayloadTokenType, VerifyTokenFn} from "../types/authTokenTypes";
import ApiError from "../error/ApiError";
import {error} from "./constants/errorMasseges";
import {tokenRedisUtil} from "./tokenRedisUtils";


const generateAccessToken = (data: generateAccessTokenDto): string => {
    const payload = {
        userId: data.userId,
        role: data.role,
        sessionId: data.sessionId,
        jti: data.jti
    }
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {expiresIn: env.ACCESS_TOKEN_EXPIRES_IN});
}

const verifyAccessToken = (token: string): accessTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as accessTokenPayload;
    } catch (error) {
        return null;
    }
}

const generateRefreshToken = (data: generateRefreshTokenDto): string => {
    const payload = {
        userId: data.userId,
        sessionId: data.sessionId,
        jti: data.jti
    }
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {expiresIn: env.REFRESH_TOKEN_EXPIRES_IN})
}

const verifyRefreshToken = (token: string): refreshTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as refreshTokenPayload;
    } catch (error) {
        return null;
    }
}

const generatePasswordResetToken = (userId: string): string => {
    const payload = {
        userId,
        jti: uuidv4()
    };
    return jwt.sign(payload, env.JWT_RESET_PASSWORD_SECRET, {expiresIn: env.RESET_PASSWORD_TOKEN_EXPIRES_IN})
}

const verifyPasswordResetToken = (token: string): resetTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_RESET_PASSWORD_SECRET) as resetTokenPayload;
    } catch (error) {
        return null;
    }
}

const decodeToken = (token: string): accessTokenPayload | refreshTokenPayload | resetTokenPayload | null => {
    try {
        return jwt.decode(token) as accessTokenPayload | refreshTokenPayload | resetTokenPayload | null;
    } catch (error) {
        return null;
    }
}

export const validateToken = async (
    req: Request,
    verifyFn: VerifyTokenFn,
    _PayloadTokenType: 'access' | 'refresh' | 'reset_token',
): Promise<{ payload: PayloadTokenType, token: string }> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, error.INVALID_AUTHORIZATION_HEADER);
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyFn(token);

    if (!payload) {
        throw new ApiError(401, error.INVALID_AUTHORIZATION_HEADER);
    }

    if (payload.jti) {
        const isBlacklisted = await tokenRedisUtil.isJtiBlacklisted(payload.jti);
        if (isBlacklisted) {
            throw new ApiError(401, error.INVALID_AUTHORIZATION_HEADER);
        }
    }

    return { payload, token };
};

export const tokenUtils = {
    generatePasswordResetToken,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    verifyPasswordResetToken,
    validateToken,
    decodeToken
}