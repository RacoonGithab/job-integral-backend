import { VerificationCodeType } from '@prisma/client';

export const EMAIL_DETAILS = {
    [VerificationCodeType.EMAIL_VERIFICATION]: {
        fromName: "Код подтверждение",
        subject: "Your email verification code",
    },
    [VerificationCodeType.SECOND_FACTOR_LOGIN]: {
        fromName: "Код подтверждение повторного входа",
        subject: "Your login verification code",
    },
    [VerificationCodeType.PASSWORD_RESET]: {
        fromName: "Код подтверждения для смены пароля",
        subject: "Your password reset code",
    },
};