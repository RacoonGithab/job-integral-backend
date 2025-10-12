import { Types } from "mongoose";
import { MessageType } from "../../../modules/chat/database/enums/message.enums";
import {MessageAttachment} from "./messageDto";
import {IMessage} from "../../../modules/chat/database/types/message.types";

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


export interface updateMessageRepoDto {
    messageId: string;
    chatId: string;
    senderId: string;
    senderInfo?: {
        username?: string;
        displayName?: string;
        avatarUrl?: string | null;
    };
    content?: {
        type: MessageType;
        text?: string;
        attachments?: MessageAttachment[];
        replyTo?: {
            messageId: string;
            text: string;
            senderName: string;
        };
    };
    timestamp?: Date;
    isEdited?: boolean;
    editedAt?: Date;
}

export interface messageQuery {
    chatId: Types.ObjectId;
    isDeleted: boolean;
    timestamp?: { $lt: Date };
}

export interface getMessagesRepoDto {
    chatId: string;
    limit?: number;
    beforeMessageId?: string;
}