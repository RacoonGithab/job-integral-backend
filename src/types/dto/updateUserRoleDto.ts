import {Roles} from "@prisma/client";

export interface updateUserRoleDto {
    email: string;
    newRole: Roles;
}

export interface updateRoleDto {
    userId: string,
    newRole: Roles
}