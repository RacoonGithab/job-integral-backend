import { MessageType } from "../../../modules/chat/database/enums/message.enums";
import {MessageAttachment} from "./messageDto";

export interface createMessageRepoDto {
    chatId: string;
    senderId: string;
    senderInfo: {
        username: string;
        displayName: string;
        avatarUrl?: string | null;
    };
    content: {
        type: MessageType;
        text?: string;
        attachments?: MessageAttachment[];
        replyTo?: {
            messageId: string;
            text: string;
            senderName: string;
        };
        systemType?: string;
    };
    timestamp: Date;
}