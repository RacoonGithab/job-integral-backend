import {updateUserRoleDto} from "../types/dto/updateUserRoleDto";
import {userRepository} from "../repositories/userRepository";
import ApiError from "../error/ApiError";
import {error} from "../utils/constants/errorMasseges";

const updateRole = async (data: updateUserRoleDto): Promise<void> => {
    const userDb = await userRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    await userRepository.updateUserRoleById(userDb.id, data.newRole);
}


export const updateUserRoleService = {
    updateRole,
}