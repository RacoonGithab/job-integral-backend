import { Schema, model } from "mongoose";
import {ChatRole} from "../enums/chatMember.enums";
import {IChatMember} from "../types/chatMember.types";

const chatMemberSchema = new Schema<IChatMember>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },

        userId: {
            type: String,
            required: true
        },

        userInfo: {
            username: { type: String, required: true },
            displayName: { type: String, required: true },
            avatarUrl: { type: String },
            lastSyncAt: { type: Date, required: true }
        },

        role: {
            type: String,
            enum: Object.values(ChatRole),
            default: ChatRole.MEMBER
        },

        permissions: [{ type: String }],

        joinedAt: {
            type: Date,
            default: Date.now
        },

        lastSeenAt: {
            type: Date,
            default: Date.now
        },

        leftAt: { type: Date },

        settings: {
            isMuted: { type: Boolean, default: false },
            muteUntil: { type: Date },
            notificationsEnabled: { type: Boolean, default: true },
            notificationSound: { type: String, default: 'default' },
            isPinned: { type: Boolean, default: false }
        },

        isActive: {
            type: Boolean,
            default: true
        },

        lastReadMessageId: {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        },

        lastReadAt: { type: Date },

        unreadCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: { createdAt: false, updatedAt: true }
    }
);

chatMemberSchema.index({ chatId: 1, userId: 1 }, { unique: true });

chatMemberSchema.index({ userId: 1, isActive: 1 });
chatMemberSchema.index({ chatId: 1, isActive: 1 });
chatMemberSchema.index({ userId: 1, 'settings.isPinned': 1 });


export const ChatMemberModel = model<IChatMember>("ChatMember", chatMemberSchema);