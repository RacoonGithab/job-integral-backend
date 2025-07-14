import {Roles} from "@prisma/client";

export interface updateUserRoleDto {
    email: string;
    newRole: Roles;
}