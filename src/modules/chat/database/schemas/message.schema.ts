import { Schema, model } from "mongoose";
import {IMessage} from "../types/message.types";
import {MessageType} from "../enums/message.enums";

const messageSchema = new Schema<IMessage>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },

        senderId: {
            type: String,
            required: true
        },

        senderInfo: {
            username: {type: String},
            displayName: {type: String},
            avatarUrl: {type: String},
            lastSyncAt: {type: Date},
        },

        content: {
            type: {
                type: String,
                enum: Object.values(MessageType),
                required: true
            },
            text: { type: String },

            attachments: [{
                type: { type: String },
                url: { type: String },
                name: { type: String },
                size: { type: Number },
                mimeType: { type: String }
            }],

            replyTo: {
                messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
                text: { type: String },
                senderName: { type: String }
            },

            systemType: { type: String }
        },

        timestamp: { type: Date, default: Date.now },
        editedAt: { type: Date },
        deletedAt: { type: Date },

        status: {
            type: String,
            enum: ['sending', 'sent', 'delivered', 'read'],
            default: 'sent'
        },

        datePartition: {
            type: String,
            required: true,
            default: function() {
                return new Date().toISOString().slice(0, 7);
            }
        },

        isEdited: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isPinned: { type: Boolean, default: false },

        reactions: [{
            emoji: { type: String },
            users: [{ type: String }],
            count: { type: Number, default: 0 }
        }],

        readBy: {
            type: Map,
            of: Date,
            default: new Map()
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

messageSchema.index({'content.text': 'text', 'content.attachments.name': 'text'});

messageSchema.index({ chatId: 1, timestamp: -1 });
messageSchema.index({ chatId: 1, datePartition: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, timestamp: -1 });
messageSchema.index({ 'content.replyTo.messageId': 1 });
messageSchema.index({ chatId: 1, isPinned: 1 });

export const MessageModel = model<IMessage>("Message", messageSchema);