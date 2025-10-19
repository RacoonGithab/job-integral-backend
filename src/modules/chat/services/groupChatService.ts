import {createGroupChatDto, deleteGroupChatDto, leaveGroupChatDto} from "../../../types/dto/chat-DTO/chatDto";
import {IChat} from "../database/types/chat.types";
import {userRepository} from "../../auth/repositories/userRepository";
import {userProfileRepository} from "../../user-profile/repositories/userProfileRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {ChatRole} from "../database/enums/chatMember.enums";
import {chatMembersRepository} from "../repositories/chatMembersRepository";
import {groupChatRepository} from "../repositories/groupChatRepository";
import {chatRepository} from "../repositories/chatRepository";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";
import {fileDeletionService} from "../../../utils/chat-utils/fileDeletionService";

const createGroupChat = async (data: createGroupChatDto): Promise<IChat> => {

    const allMemberIds = [...new Set([data.userId, ...data.memberIds])];

    const [membersInDb, userProfiles] = await Promise.all([
        userRepository.findManyByIds(allMemberIds),
        Promise.all(
            allMemberIds.map(userId =>
                userProfileRepository.getUserProfileData(userId)
            )
        )
    ]);

    const validMembers = membersInDb.filter(member => !member.isBlocked);
    const validMemberIds = validMembers.map(member => member.id);

    const isCreatorValid = validMemberIds.includes(data.userId);

    if (!isCreatorValid) {
        throw new ApiError(403, error.USER_NOT_FOUND);
    }

    if (validMemberIds.length < 3) {
        throw new ApiError(400, error.NOT_ENOUGH_USERS);
    }

    const profilesForValidMembers = validMemberIds.map(userId =>
        userProfiles.find(profile => profile?.userId === userId)
    );

    if (profilesForValidMembers.some(profile => !profile)) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    const savedChat = await groupChatRepository.createGroupChat({
        chatName: data.chatName,
        description: data.description,
        createdBy: data.userId,
        memberCount: validMemberIds.length
    });

    const membersData = validMemberIds.map(userId => {
        const userProfile = userProfiles.find(profile => profile?.userId === userId);
        const isCreator = userId === data.userId;

        return {
            chatId: savedChat._id,
            userId,
            username: userProfile!.firstName,
            displayName: userProfile!.firstName,
            avatarUrl: userProfile!.avatar,
            role: isCreator ? ChatRole.CREATOR : ChatRole.MEMBER,
        };
    });

    await chatMembersRepository.createChatMembersByIds(membersData);

    return savedChat;
}

const leaveGroupChat = async (data: leaveGroupChatDto): Promise<void> => {
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

    const current = chatDb.currentUserInfo;

    if (!current || !current.isActive) {
        return
    }

    if (current.role === ChatRole.CREATOR) {

        if (!data.transferOwnerToUserId) {
            throw new ApiError(400, error.TRANSFER_OWNER_REQUIRED);
        }

        const candidate = await chatMembersRepository.findActiveMember({
            chatId: data.chatId,
            userId: data.transferOwnerToUserId
        });

        if (!candidate) {
            throw new ApiError(404, error.USER_NOT_FOUND)
        }

        await chatMembersRepository.promoteToChatCreator({
            chatId: chatDb._id,
            userId: data.transferOwnerToUserId
        });

        await chatMembersRepository.deleteMember({
            chatId: chatDb._id,
            userId: data.userId,
        });

        const activeCount = await chatMembersRepository.countActiveMembers(chatDb._id);

        await groupChatRepository.updateChatStats(chatDb._id, activeCount);

        return;
    }

    await chatMembersRepository.deleteMember({
        chatId: chatDb._id,
        userId: data.userId
    });

    const activeCount = await chatMembersRepository.countActiveMembers(chatDb._id);

    await groupChatRepository.updateChatStats(chatDb._id, activeCount);

}

const deleteGroupChat = async (data: deleteGroupChatDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId);

    const chatDb = await chatRepository.findChatForUser({
        userId: data.userId,
        chatId: data.chatId,
        requireActive: false
    });

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (!chatDb) {
        throw new ApiError(404, error.CHAT_NOT_FOUND);
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

    const current = chatDb.currentUserInfo;

    if (!current || !current.isActive) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (current.role !== ChatRole.CREATOR) {
        throw new ApiError(404, error.FORBIDDEN);
    }

    await fileDeletionService.deleteChatFiles(chatDb._id.toString());

    await chatRepository.deleteChatHard(chatDb._id);

    await chatMembersRepository.deleteAllMembersByChatId(chatDb._id);
}

export const groupChatService = {
    createGroupChat,
    leaveGroupChat,
    deleteGroupChat
}