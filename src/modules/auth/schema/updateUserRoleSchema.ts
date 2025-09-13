import { z } from "zod";
import { regexPatterns } from "../../../utils/constants/regexPatterns";
import {Roles} from "../../../types/enams/roleEnum";


export const updateUserRoleSchema = z.object({
    email: z
        .string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .nonempty("Email is required"),

    newRole: z.nativeEnum(Roles, {invalid_type_error: "Defunct role."})
})