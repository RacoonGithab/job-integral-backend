import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {chatMembersRepository} from "../repositories/chatMembersRepository";
import {messageRepository} from "../repositories/messageRepository";
import {IMessage} from "../database/types/message.types";
import {sendMessageDto, updateMessageDto} from "../../../types/dto/message-DTO/messageDto";
import {userProfileRepository} from "../../user-profile/repositories/userProfileRepository";
import {messageServiceValidate} from "./validators/messageValidator";
import {directChatRepository} from "../repositories/directChatRepository";
import {messageConstants} from "../../../utils/constants/messageConstants";

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

    const userProfile = await userProfileRepository.getUserProfileData(data.senderId);

    if (!userProfile) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    messageServiceValidate.validateMessageByType(data);

    let replyToData;

    if (data.replyTo) {
        const originalMessage = await messageRepository.findMessageById(data.replyTo.messageId);
        if (!originalMessage) {
            throw new ApiError(404, error.MESSAGE_NOT_FOUND);
        }

        if (originalMessage.chatId.toString() !== data.chatId) {
            throw new ApiError(400, error.REPLY_DIFFERENT_CHAT);
        }

        replyToData = {
            messageId: data.replyTo.messageId,
            text: originalMessage.content.text || 'Attachment',
            senderName: originalMessage.senderInfo?.displayName || 'Unknown'
        };
    }

    const message = await messageRepository.createMessage({
        chatId: data.chatId,
        senderId: data.senderId,
        senderInfo: {
            username: userProfile.firstName,
            displayName: userProfile.firstName,
            avatarUrl: userProfile.avatar
        },
        content: {
            type: data.type,
            text: data.text,
            attachments: data.attachments,
            replyTo: replyToData,
            systemType: data.systemType
        },
        timestamp: new Date()
    });

    await messageServiceValidate.updateChatAfterMessage(data.chatId, message);

    await directChatRepository.activatePrivateChatIfFirstMessage(data.chatId);

    await chatMembersRepository.incrementUnreadCount({
        chatId: data.chatId,
        excludeUserId: data.senderId
    });

    await chatMembersRepository.updateLastSeen({
        chatId: data.chatId,
        userId: data.senderId
    });

    return message;

}


const updateMessage = async (data: updateMessageDto): Promise<IMessage> => {
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

    const messageDb = await messageRepository.findMessageById(data.messageId);

    if (!messageDb) {
        throw new ApiError(404, error.MESSAGE_NOT_FOUND);
    }

    if (messageDb.chatId.toString() !== data.chatId) {
        throw new ApiError(404, error.MESSAGE_NOT_FOUND);
    }

    if (messageDb.senderId !== data.senderId) {
        throw new ApiError(403, error.FORBIDDEN);
    }

    if (Date.now() - new Date(messageDb.timestamp).getTime() > messageConstants.EDIT_WINDOW_MINUTES * 60 * 1000) {
        throw new ApiError(400, error.EDIT_WINDOW_EXPIRED);
    }

    messageServiceValidate.validateMessageByType(data);

    const updatedContent = {
        type: data.type ?? messageDb.content.type,
        text: data.text ?? messageDb.content.text,
        attachments: data.attachments ?? messageDb.content.attachments,
        ...(messageDb.content.replyTo?.messageId && {
            replyTo: {
                messageId: messageDb.content.replyTo.messageId.toString(),
                text: messageDb.content.replyTo.text || '',
                senderName: messageDb.content.replyTo.senderName || ''
            }
        })
    };


    const updatedMessage = await messageRepository.updateMessageById({
        messageId: data.messageId,
        chatId: messageDb.chatId.toString(),
        senderId: messageDb.senderId,
        content: updatedContent,
        isEdited: true,
        editedAt: new Date()
    });

    if (!updatedMessage) {
        throw new ApiError(500, error.SERVER_ERROR);
    }

    await messageServiceValidate.updateChatAfterMessage(data.chatId, updatedMessage);

    return updatedMessage;

}

export const messageService = {
    sendMessage,
    updateMessage
}