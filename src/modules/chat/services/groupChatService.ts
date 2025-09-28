import {createGroupChatDto} from "../../../types/dto/chat-DTO/chatDto";
import {IChat} from "../database/types/chat.types";
import {userRepository} from "../../auth/repositories/userRepository";
import {userProfileRepository} from "../../user-profile/repositories/userProfileRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {ChatRole} from "../database/enums/chatMember.enums";
import {chatMembersRepository} from "../repositories/chatMembersRepository";
import {groupChatRepository} from "../repositories/groupChatRepository";

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

export const groupChatService = {
    createGroupChat,
}