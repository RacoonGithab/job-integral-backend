import {refreshTokenPayload, accessTokenPayload, resetTokenPayload} from "./dto/tokenDto";


export type VerifyAccessTokenFn = (token: string) => accessTokenPayload | null;
export type VerifyRefreshTokenFn = (token: string) => refreshTokenPayload | null;
export type VerifyResetPasswordTokenFn = (token: string) => resetTokenPayload | null;

export type VerifyTokenFn = VerifyAccessTokenFn | VerifyRefreshTokenFn | VerifyResetPasswordTokenFn;
export type PayloadTokenType = accessTokenPayload | refreshTokenPayload | resetTokenPayload;