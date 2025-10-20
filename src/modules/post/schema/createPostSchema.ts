import {z} from "zod"
import {regexPatterns} from "../../../utils/constants/regexPatterns";

export const createPostSchema = z.object({
    title: z
        .string()
        .regex(regexPatterns.POST_TITLE, {message: "Incorrect title description"}),

    content: z
        .string()
        .regex(regexPatterns.POST_CONTENT, {message: "Incorrect post content"}),

    isImportant: z
        .union([z.string(), z.boolean()])
        .optional()
        .transform((val) => val === "true" || val === true),
})