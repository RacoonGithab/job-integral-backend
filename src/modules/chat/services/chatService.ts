import {getUserActiveChatDto, getUserChatDto} from "../../../types/dto/chat-DTO/chatDto";
import {IChat} from "../database/types/chat.types";
import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {chatRepository} from "../repositories/chatRepository";
import {ChatBaseDTO} from "../../../types/dto/chat-DTO/chatRepoDto";


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

const getUserChat = async (data: getUserChatDto): Promise<ChatBaseDTO | null> => {
    const userDb = await userRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return chatRepository.findChatForUser({
        userId: data.userId,
        chatId: data.chatId,
        requireActive: true
    })
}

export const chatService = {
    getUserActiveChats,
    getUserChat
}