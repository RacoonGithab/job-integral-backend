import { Types, Document } from "mongoose";
import {MessageType} from "../enums/message.enums";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    senderId: string;

    senderInfo: {
        username: string;
        displayName: string;
        avatarUrl?: string;
        lastSyncAt: Date;
    };

    content: {
        type: MessageType;
        text?: string;

        attachments?: Array<{
            type: string;
            url: string;
            name: string;
            size: number;
            mimeType: string;
        }>;

        replyTo?: {
            messageId: Types.ObjectId;
            text: string;
            senderName: string;
        };

        systemType?: string;
    };

    timestamp: Date;
    editedAt: Date;
    deletedAt: Date;

    status: 'sending' | 'sent' | 'delivered' | 'read';

    datePartition: string;

    isEdited: boolean;
    isDeleted: boolean;
    isPinned: boolean;

    reactions: Array<{
        emoji: string;
        users: string[];
        count: number;
    }>;

    readBy: Map<string, Date>;
}