import {MessageType} from "../../../modules/chat/database/enums/message.enums";
import {IMessage} from "../../../modules/chat/database/types/message.types";

export interface sendMessageDto {
    chatId: string;
    senderId: string;
    type: MessageType;
    text?: string;
    attachments?: MessageAttachment[];
    replyTo?: {
        messageId: string;
        text: string;
        senderName: string;
    };
    systemType?: string;
}

export interface MessageAttachment {
    type: string;
    url: string;
    name: string;
    size: number;
    mimeType: string;
}

export interface updateMessageDto {
    chatId: string;
    messageId: string;
    senderId: string;
    text?: string;
    attachments?: MessageAttachment[];
    type: MessageType;
}

export interface getMessagesResult {
    messages: IMessage[];
    hasMore: boolean;
}

export interface getChatMessagesDto {
    chatId: string,
    userId: string,
    lastMessageId: string
}
