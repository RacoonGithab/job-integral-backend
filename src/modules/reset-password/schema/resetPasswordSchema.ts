import { z } from "zod";
import { regexPatterns } from "../../../utils/constants/regexPatterns";

export const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .regex(regexPatterns.PASSWORD, "Invalid password format")
        .nonempty("New password is required"),
})