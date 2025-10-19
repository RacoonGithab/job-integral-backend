import {z} from "zod"
import {regexPatterns} from "../../../utils/constants/regexPatterns";

export const createProfileSchema = z.object({
    firstName: z
        .string()
        .regex(regexPatterns.FIRST_NAME, {message: "First name is required"})
        .nonempty(),

    lastName: z
        .string()
        .regex(regexPatterns.LAST_NAME, {message: "Last name is required"})
        .nonempty(),

    email: z
        .string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .optional(),

    phoneNumber: z
        .string()
        .regex(regexPatterns.PHONE_NUMBER, {message: "Invalid phone number format"})
        .optional(),

    avatar: z
        .string()
        .url({ message: "Invalid URL format" })
        .optional(),

    companyName: z
        .string()
        .regex(regexPatterns.COMPANY_INSTITUTION_NAME, {message: "Invalid company name format"})
        .optional(),
});