export interface createPasswordResetTokenDto {
    token: string,
    userId: string
    createdAt: Date;
    updatedAt: Date;
}

export interface verifyPasswordResetDto {
    resetToken: string,
    verificationCode: string,
    userId: string,
}

export interface getPasswordResetTokenDto {
    token: string,
    userId: string,
}

export interface confirmPasswordResetTokenDto {
    id: string,
    updatedAt: Date;
}

export interface requestPasswordResetDto {
    email: string,
}

export interface deactivatePasswordResetTokenDto {
    userId: string,
}