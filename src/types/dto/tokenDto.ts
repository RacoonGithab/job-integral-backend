import {Roles} from "@prisma/client";

export interface generateAccessTokenDto {
    userId: string;
    role: Roles;
    sessionId: string;
    jti: string;
}

export interface generateRefreshTokenDto {
    userId: string;
    sessionId: string;
    jti: string;
}

export interface accessTokenPayload {
    userId: string;
    role: Roles
    sessionId: string;
    jti: string;
}

export interface refreshTokenPayload {
    userId: string;
    sessionId: string;
    jti: string;
}

export interface resetTokenPayload {
    userId: string;
    jti: string;
}

