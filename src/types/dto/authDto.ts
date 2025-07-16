
export interface loginUserDto {
    email: string;
    password: string;
}

export interface LoginResultDto {
    accessToken?: string | null;
    refreshToken?: string | null;
    passwordResetToken?: string | null;

    isVerificationCodeRequired?: boolean;
    userId?: string;
    message?: string;
    code?: string;
}

export interface verifyLoginCodeDto {
    userId: string;
    verificationCode: string;
}

export interface logoutUserDto {
    userId: string;
    sessionId: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface refreshServiceInputDto {
    userId: string;
    sessionId: string;
    jti: string;
    exp: number;
}
