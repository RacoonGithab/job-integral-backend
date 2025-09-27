import { Schema, model } from 'mongoose';
import {ChatStatus, ChatType} from "../enums/chat.enums";
import {IChat} from "../types/chat.types";
import {MessageType} from "../enums/message.enums";

const chatSchema = new Schema<IChat>(
    {
        name: { type: String },

        description: { type: String },

        avatar: {type: String },

        type: {
            type: String,
            enum: Object.values(ChatType),
            default: ChatType.DIRECT
        }
        ,
        status: {
            type: String,
            enum: Object.values(ChatStatus),
            default: ChatStatus.INITIATED
        },

        createdBy: { type: String, required: true },

        settings: {
            isPublic: { type: Boolean, default: false },
            allowInvites: { type: Boolean, default: true },
            maxMembers: {type: Number, default: 100},
            messageRetentionDays: {type: Number, default: 365},
            allowFileUploads: { type: Boolean, default: true },
            allowVoiceMessages: { type: Boolean, default: true }
        },

        stats: {
            memberCount: { type: Number, default: 0 },
            messageCount: { type: Number, default: 0 },
            lastActivityAt: { type: Date, default: Date.now }
        },

        lastMessage: {
            _id: { type: Schema.Types.ObjectId },
            senderId: { type: String },
            senderName: { type: String },
            text: { type: String },
            timestamp: { type: Date },
            type: {
                type: String,
                enum: Object.values(MessageType)
            }
        },
    },

    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

chatSchema.index({ type: 1, 'settings.isPublic': 1 });
chatSchema.index({ createdBy: 1 });
chatSchema.index({ 'stats.lastActivityAt': -1 });
chatSchema.index({ status: 1 });


export const ChatModel = model<IChat>("Chat", chatSchema);