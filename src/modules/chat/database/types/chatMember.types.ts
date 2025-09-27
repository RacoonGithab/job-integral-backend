import {ChatRole} from "../enums/chatMember.enums";
import {Types} from "mongoose";

export interface IChatMember extends Document {
    chatId: Types.ObjectId;
    userId: string;

    userInfo: {
        username: string;
        displayName: string;
        avatarUrl?: string;
        lastSyncAt: Date;
    };

    role: ChatRole;
    permissions: string[];

    joinedAt: Date;
    lastSeenAt: Date;
    leftAt?: Date;

    settings: {
        isMuted: boolean;
        muteUntil?: Date;
        notificationsEnabled: boolean;
        notificationSound: string;
        isPinned: boolean;
    };

    isActive: boolean;

    lastReadMessageId?: Types.ObjectId;
    lastReadAt?: Date;
    unreadCount: number;

    updatedAt: Date;
}