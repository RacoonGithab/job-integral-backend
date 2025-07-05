import {resetPasswordDto} from "../types/dto/resetPasswordDto";
import {userRepository} from "../repositories/userRepository";
import ApiError from "../error/ApiError";
import {error} from "../utils/constants/errorMasseges";
import {createPasswordHash} from "../utils/createPasswordHash";
import {tokenRedisUtil} from "../utils/tokenRedisUtils";

const resetPassword = async (data: resetPasswordDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (data.resetToken) {
        await userRepository.updateUserPassword({
            userId: data.userId,
            newPassword: await createPasswordHash(data.newPassword),
        });
    }

    await tokenRedisUtil.blackListToken(data.resetToken)
}

export const resetPasswordService = {
    resetPassword
}