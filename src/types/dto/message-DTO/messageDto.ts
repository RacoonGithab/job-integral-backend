import {MessageType} from "../../../modules/chat/database/enums/message.enums";

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