import {z} from 'zod';
import {regexPatterns} from "../../../utils/constants/regexPatterns";

export const requestPasswordResetSchema = z.object({

    email: z
        .string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .nonempty("Email is required"),
})