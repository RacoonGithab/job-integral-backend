import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {
    createChatDto,
    createGroupChatDto,
    getUserActiveChatDto,
    getUserChatDto
} from "../../../types/dto/chat-DTO/chatDto";
import {chatRepository} from "../repositories/chatRepository";
import {IChat} from "../database/types/chat.types";
import {userProfileRepository} from "../../user-profile/repositories/userProfileRepository";
import {ChatRole} from "../database/enums/chatMember.enums";
import {chatMembersRepository} from "../repositories/chatMembersRepository";

const createPrivateChat = async (data: createChatDto): Promise<IChat> => {

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

    const savedChat = await chatRepository.createPrivateChat({
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

    const savedChat = await chatRepository.createGroupChat({
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

const getUserActiveChats = async (data: getUserActiveChatDto): Promise<IChat[] | null> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return chatRepository.findListChatsByUserId({userId: data.userId});
}

const getUserChat = async (data: getUserChatDto): Promise<IChat | null> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return chatRepository.findChatForUser({
        userId: data.userId,
        chatId: data.chatId
    })
}

export const chatService = {
    createPrivateChat,
    getUserActiveChats,
    getUserChat,
    createGroupChat
}