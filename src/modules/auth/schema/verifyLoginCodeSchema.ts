import {z} from 'zod';
import {regexPatterns} from "../../../utils/constants/regexPatterns";

export const verifyLoginCodeSchema = z.object({

    userId: z
        .string()
        .uuid("Invalid user ID format")
        .nonempty("User ID is required"),

    verificationCode: z
        .string()
        .nonempty("Verification code is required")
        .regex(regexPatterns.VERIFICATION_CODE, "Invalid verification code format"),
});