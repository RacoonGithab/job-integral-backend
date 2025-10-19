import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {
    createDirectChatDto,
    leaveDirectChatDto
} from "../../../types/dto/chat-DTO/chatDto";
import {chatRepository} from "../repositories/chatRepository";
import {IChat} from "../database/types/chat.types";
import {userProfileRepository} from "../../user-profile/repositories/userProfileRepository";
import {ChatRole} from "../database/enums/chatMember.enums";
import {chatMembersRepository} from "../repositories/chatMembersRepository";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";
import {directChatRepository} from "../repositories/directChatRepository";
import {fileDeletionService} from "../../../utils/chat-utils/fileDeletionService";

const createDirectChat = async (data: createDirectChatDto): Promise<IChat> => {

    const [userDb, otherUserDb, userProfile, otherUserProfile] = await Promise.all([
        userRepository.getUserById(data.userId),
        userRepository.getUserById(data.otherUserId),
        userProfileRepository.getUserProfileData(data.userId),
        userProfileRepository.getUserProfileData(data.otherUserId)
    ]);

    if (!otherUserDb || !userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userProfile || !otherUserProfile) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked || otherUserDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (data.userId === data.otherUserId) {
        throw new ApiError(400, error.CANNOT_CHAT_WITH_SELF);
    }

    const existingChat = await chatRepository.findPrivateChatBetweenUsers({
        userId: data.userId,
        otherUserId: data.otherUserId
    });

    if (existingChat) {
        return existingChat;
    }

    const savedChat = await directChatRepository.createDirectChat({
        createdBy: data.userId
    });

    await chatMembersRepository.createChatMembersByIds([
        {
            chatId: savedChat._id,
            userId: data.userId,
            username: userProfile.firstName,
            displayName: userProfile.firstName,
            avatarUrl: userProfile.avatar,
            role: ChatRole.MEMBER
        },
        {
            chatId: savedChat._id,
            userId: data.otherUserId,
            username: otherUserProfile.firstName,
            displayName: otherUserProfile.firstName,
            avatarUrl: otherUserProfile.avatar,
            role: ChatRole.MEMBER
        }
    ]);

    return savedChat;
};

const leaveDirectChat = async (data: leaveDirectChatDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    const chatDb = await chatRepository.findChatForUser({
        userId: data.userId,
        chatId: data.chatId,
        requireActive: false
    });

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (!chatDb) {
        throw new ApiError(404, error.CHAT_NOT_FOUND)
    }

    if (chatDb.status === ChatStatus.DELETED) {
        throw new ApiError(404, error.CHAT_ALREADY_DELETED)
    }

    if (chatDb.status === ChatStatus.ARCHIVED) {
        throw new ApiError(404, error.CHAT_ARCHIVED)
    }

    if (chatDb.type !== ChatType.DIRECT) {
        throw new ApiError(400, error.WRONG_CHAT_TYPE);
    }

    const current = chatDb.currentUserInfo;

    if (!current || !current.isActive) {
        return
    }

    const changed = await chatMembersRepository.softLeaveMember({ chatId: chatDb._id, userId: data.userId });

    if (!changed) {
        await chatRepository.touchLastActivity(chatDb._id);
        return;
    }

    const activeCount = await chatMembersRepository.countActiveMembers(chatDb._id);

    if (activeCount === 0) {
        await fileDeletionService.deleteChatFiles(chatDb._id.toString());
        await chatRepository.deleteChatHard(chatDb._id);
        await chatMembersRepository.deleteAllMembersByChatId(chatDb._id);
        return;
    }

    await chatRepository.touchLastActivity(chatDb._id);
}

export const directChatService = {
    createDirectChat,
    leaveDirectChat
}