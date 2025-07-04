import {Roles} from "@prisma/client";

export interface tokenDto {
    accessToken: string | null;
    refreshToken: string | null;
    passwordResetToken: string | null;
}


export interface generateAccessTokenDto {
    userId: string;
    role: Roles;
}

export interface generateRefreshTokenDto {
    userId: string;
}

export interface accessTokenPayload {
    userId: string;
    role: Roles
    jti: string;
}

export interface refreshTokenPayload {
    userId: string;
    jti: string;
}

export interface resetTokenPayload {
    userId: string;
    jti: string;
}
