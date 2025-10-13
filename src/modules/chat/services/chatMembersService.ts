import {IChatMember} from "../database/types/chatMember.types";
import {addChatMemberDto, getChatMembersDto} from "../../../types/dto/members-chat-DTO/membersChatDto";
import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {chatMembersRepository} from "../repositories/chatMembersRepository";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";
import {chatRepository} from "../repositories/chatRepository";
import {ChatRole} from "../database/enums/chatMember.enums";
import { Types } from "mongoose";
import {userProfileRepository} from "../../user-profile/repositories/userProfileRepository";
import {groupChatRepository} from "../repositories/groupChatRepository";

const addChatMember = async (data: addChatMemberDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const chatDb = await chatRepository.findChatForUser({
        userId: data.userId,
        chatId: data.chatId,
        requireActive: false
    });

    if (!chatDb) {
        throw new ApiError(404, error.CHAT_NOT_FOUND)
    }

    if (chatDb.status === ChatStatus.DELETED) {
        throw new ApiError(404, error.CHAT_ALREADY_DELETED);
    }

    if (chatDb.status === ChatStatus.ARCHIVED) {
        throw new ApiError(404, error.CHAT_ARCHIVED);
    }

    if (chatDb.type !== ChatType.GROUP) {
        throw new ApiError(400, error.WRONG_CHAT_TYPE);
    }

    const currentMember = await chatMembersRepository.findActiveMember({
        userId: data.userId,
        chatId: data.chatId,
    });

    if (!currentMember) {
        throw new ApiError(403, error.FORBIDDEN);
    }

    const allowedRoles = [ChatRole.CREATOR, ChatRole.ADMIN, ChatRole.MODERATOR];

    if (!allowedRoles.includes(currentMember.role)) {
        throw new ApiError(403, error.FORBIDDEN);
    }

    const newUserDb = await userRepository.getUserById(data.newUserId);

    if (!newUserDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (newUserDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const newUserDbProfile = await userProfileRepository.getUserProfileData(data.newUserId);

    if (!newUserDbProfile) {
        throw new ApiError(404, error.NOT_PROFILE);
    }

    const isAlreadyMember = await chatMembersRepository.isMemberUserChatById({
        userId: data.newUserId,
        chatId: data.chatId,
    });

    if (isAlreadyMember) {
        throw new ApiError(409, error.USER_ALREADY_MEMBER);
    }

    const memberCount = await chatMembersRepository.countActiveMembers(
        new Types.ObjectId(data.chatId)
    );

    if (chatDb.settings.maxMembers && memberCount >= chatDb.settings.maxMembers) {
        throw new ApiError(400, error.CHAT_MEMBERS_LIMIT_REACHED);
    }

    await chatMembersRepository.createChatMembersByIds([{
        chatId: new Types.ObjectId(data.chatId),
        userId: data.newUserId,
        username: newUserDbProfile.firstName,
        displayName: newUserDbProfile.firstName,
        avatarUrl: newUserDbProfile.avatar,
        role: ChatRole.MEMBER
    }]);

    await groupChatRepository.incrementMemberCount(data.chatId);
}

const getChatMembers = async (data: getChatMembersDto): Promise<IChatMember[]> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const isMember = await chatMembersRepository.isMemberUserChatById({
        userId: data.userId,
        chatId: data.chatId,
    });

    if (!isMember) {
        throw new ApiError(403, error.FORBIDDEN);
    }

    const chatDb = await chatRepository.findChatForUser({
        userId: data.userId,
        chatId: data.chatId,
        requireActive: false
    });

    if (!chatDb) {
        throw new ApiError(404, error.CHAT_NOT_FOUND)
    }

    if (chatDb.status === ChatStatus.DELETED) {
        throw new ApiError(404, error.CHAT_ALREADY_DELETED)
    }

    if (chatDb.status === ChatStatus.ARCHIVED) {
        throw new ApiError(404, error.CHAT_ARCHIVED)
    }

    return chatMembersRepository.findActiveMembersByChatId(data.chatId);
}

export const chatMembersService = {
    addChatMember,
    getChatMembers
}