import {IChatMember} from "../database/types/chatMember.types";
import {getChatMembersDto} from "../../../types/dto/members-chat-DTO/membersChatDto";
import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {chatMembersRepository} from "../repositories/chatMembersRepository";
import {ChatStatus} from "../database/enums/chat.enums";
import {chatRepository} from "../repositories/chatRepository";


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
    getChatMembers,
}