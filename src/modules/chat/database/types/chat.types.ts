import {Document, Types} from "mongoose";
import {ChatStatus, ChatType} from "../enums/chat.enums";
import {MessageType} from "../enums/message.enums";

export interface IChat extends Document {
    _id: Types.ObjectId;
    name?: string;
    description?: string;
    avatar?: string;
    type: ChatType;
    status: ChatStatus;

    createdBy: string;
    createdAt: Date;
    updatedAt: Date;

    settings: {
        isPublic: boolean;
        allowInvites: boolean;
        maxMembers: number;
        messageRetentionDays: number;
        allowFileUploads: boolean;
        allowVoiceMessages: boolean;
    };

    stats: {
        memberCount: number;
        messageCount: number;
        lastActivityAt: Date;
    };

    lastMessage?: {
        _id: Types.ObjectId;
        senderId: string;
        senderName: string;
        senderAvatar?: string;
        text: string;
        timestamp: Date;
        type: MessageType;
    };
}
