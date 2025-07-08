import {z} from 'zod';
import {regexPatterns} from "../utils/constants/regexPatterns";

export const verifyPasswordResetCodeSchema = z.object({
    verificationCode: z
        .string()
        .nonempty("Verification code is required")
        .regex(regexPatterns.VERIFICATION_CODE, "Invalid verification code format"),
})