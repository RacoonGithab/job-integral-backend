import {createUserProfileDtoExtended, updateUserProfileDto} from "../../../types/dto/user-profile/userProfileDto";
import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {userProfileRepository} from "../repositories/userProfileRepository";
import {avatarService} from "../../../utils/profile-utils/avatarServiceUtil";
import {createUserProfileRepoDto, updateUserProfileRepoDto} from "../../../types/dto/user-profile/userProfileRepoDto";
import {UserProfile} from "@prisma/client";


const createUserProfile = async (data: createUserProfileDtoExtended): Promise<void> => {
    const userDb =  await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const userProfileDb = await userProfileRepository.getUserProfileData(userDb.id);

    if (userProfileDb) {
        throw new ApiError(409, error.PROFILE_ALREADY_EXISTS);
    }

    let avatarUrl: string | undefined;

    if (data.avatarFile) {
        const uploaded = await avatarService.uploadAvatarFile({ file: data.avatarFile, userId: data.userId });
        avatarUrl = uploaded.url;
    }

    const { avatarFile, ...rest } = data;

    const repoDto: createUserProfileRepoDto = {
        ...rest,
        avatar: avatarUrl,
    };

    await userProfileRepository.createUserProfileById(repoDto);
}

const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const userDb =  await userRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return userProfileRepository.getUserProfileData(userDb.id);
}

const updateUserProfile = async (data: updateUserProfileDto): Promise<void> => {
    const userDb =  await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const userProfileDb = await userProfileRepository.getUserProfileData(userDb.id);

    if (!userProfileDb) {
        throw new ApiError(404, error.PROFILE_NOT_FOUND);
    }

    let avatarUrl: string | null | undefined = userProfileDb.avatar ?? undefined;

    if (data.avatarFile) {
        if (data.avatarFile) {
            await avatarService.deleteFileIfExists(avatarUrl)
            const uploaded = await avatarService.uploadAvatarFile({ file: data.avatarFile, userId: data.userId });
            avatarUrl = uploaded.url;
        }
    }

    const { avatarFile, userId, ...rest } = data;

    const repoDto: updateUserProfileRepoDto = {
        ...rest,
        avatar: avatarUrl ?? undefined,
    };

    await userProfileRepository.updateUserProfileById(userId, repoDto);
}

export const userProfileService = {
    createUserProfile,
    updateUserProfile,
    getUserProfile
}