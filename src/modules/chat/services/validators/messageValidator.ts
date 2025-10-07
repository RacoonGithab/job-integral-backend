import {MessageType} from "../../database/enums/message.enums";
import ApiError from "../../../../error/ApiError";
import {sendMessageDto} from "../../../../types/dto/message-DTO/messageDto";
import {IMessage} from "../../database/types/message.types";
import {chatRepository} from "../../repositories/chatRepository";
import { Types } from "mongoose";
import {error} from "../../../../utils/constants/errorMasseges";

const validateMessageByType = (data: sendMessageDto): void => {
    if (data.type === MessageType.TEXT) {
        if (!data.text || data.text.trim().length === 0) {
            throw new ApiError(400, error.TEXT_REQUIRED);
        }
        if (data.text.length > 4096) {
            throw new ApiError(400, error.MAX_TEXT_LEN);
        }
        return;
    }
    if (data.type === MessageType.IMAGE) {
        if (!data.attachments || data.attachments.length === 0) {
            throw new ApiError(400, error.INVESTMENT_REQUIRED);
        }
        return;
    }
    if (data.type === MessageType.FILE) {
        if (!data.attachments || data.attachments.length === 0) {
            throw new ApiError(400, error.INVESTMENT_REQUIRED);
        }
        return;
    }
    if (data.type === MessageType.VOICE) {
        if (!data.attachments || data.attachments.length === 0) {
            throw new ApiError(400, error.INVESTMENT_REQUIRED);
        }

        const voiceAttachment = data.attachments[0];

        if (!voiceAttachment.mimeType.startsWith('audio/')) {
            throw new ApiError(400, error.INVESTMENT_REQUIRED);
        }
        return;
    }
    if (data.type === MessageType.SYSTEM) {
        if (data.text) {
            throw new ApiError(400, error.FORBIDDEN);
        }
        if (!data.systemType) {
            throw new ApiError(400, error.FORBIDDEN);
        }
        return;
    }
    throw new ApiError(400, error.BAD_REQUEST);
}

const updateChatAfterMessage = async (chatId: string, message: IMessage): Promise<void> => {
    let messageText = '';

    if (message.content.type === MessageType.TEXT) {
        messageText = message.content.text || '';
    } else if (message.content.type === MessageType.IMAGE) {
        messageText = message.content.text || '📷 Image';
    } else if (message.content.type === MessageType.FILE) {
        messageText = message.content.text || '📎 File';
    } else if (message.content.type === MessageType.VOICE) {
        messageText = '🎤 Voice message';
    } else if (message.content.type === MessageType.SYSTEM) {
        messageText = message.content.systemType || 'System message';
    }

    await chatRepository.updateChatAfterMessage({
        chatId,
        lastMessage: {
            _id: message._id as Types.ObjectId,
            senderId: message.senderId,
            senderName: message.senderInfo?.displayName || 'Unknown',
            senderAvatar: message.senderInfo?.avatarUrl,
            text: messageText,
            timestamp: message.timestamp,
            type: message.content.type
        }
    });
}
export const messageServiceValidate = {
    updateChatAfterMessage,
    validateMessageByType
}
