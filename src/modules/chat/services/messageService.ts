import {sendMessageDto} from "../../../types/dto/chat-DTO/chatDto";
import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {chatMembersRepository} from "../repositories/chatMembersRepository";
import {messageRepository} from "../repositories/messageRepository";
import {IMessage} from "../database/types/message.types";

const sendMessage = async (data: sendMessageDto): Promise<IMessage> => {
    const userDb = await userRepository.getUserById(data.senderId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const isMember = await chatMembersRepository.isMemberUserChatById({
        userId: data.senderId,
        chatId: data.chatId,
    });

    if (!isMember) {
        throw new ApiError(403, error.FORBIDDEN);
    }

    return messageRepository.createMessage({
        chatId: data.chatId,
        senderId: data.senderId,
        text: data.text,
        createdAt: new Date(),
    });
}

export const messageService = {
    sendMessage
}