import {z} from "zod"
import {regexPatterns} from "../../../utils/constants/regexPatterns";

export const createTaskSchema = z.object({
    title: z
        .string()
        .regex(regexPatterns.TASK_TITLE, {message: "Incorrect title description"}),

    description: z
        .string()
        .regex(regexPatterns.TASK_DESCRIPTION, {message: "Incorrect description description"})
        .optional(),

    dueDate: z.preprocess(
        (arg) => {
            if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        },
        z.date({ required_error: "Due date is required", invalid_type_error: "Invalid date format" })
    ),

    isUrgent: z
        .boolean()
        .optional()
        .default(false),
});