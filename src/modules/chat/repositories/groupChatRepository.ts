import {
    createGroupChatRepoDto
} from "../../../types/dto/chat-DTO/chatRepoDto";
import {IChat} from "../database/types/chat.types";
import {ChatModel} from "../database/schemas/chat.schema";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";
import {Types} from "mongoose";

const createGroupChat = async (data: createGroupChatRepoDto): Promise<IChat> => {
    const chatDoc = new ChatModel({
        type: ChatType.GROUP,
        status: ChatStatus.ACTIVE,
        name: data.chatName,
        description: data.description,
        createdBy: data.createdBy,
        settings: {
            isPublic: false,
            allowInvites: true,
            maxMembers: 100,
            messageRetentionDays: 365,
            allowFileUploads: true,
            allowVoiceMessages: true
        },
        stats: {
            memberCount: data.memberCount,
            messageCount: 0,
            lastActivityAt: new Date()
        }
    });

    return await chatDoc.save();
};

const updateChatStats = async (chatId: Types.ObjectId, memberCount: number) => {
    ChatModel.updateOne(
        { _id: chatId },
        { $set: { 'stats.memberCount': memberCount, 'stats.lastActivityAt': new Date() } }
    )
};

const incrementMemberCount = async (chatId: string | Types.ObjectId): Promise<void> => {
    const chatObjectId = typeof chatId === "string" ? new Types.ObjectId(chatId) : chatId;

    await ChatModel.updateOne(
        { _id: chatObjectId },
        {
            $inc: { 'stats.memberCount': 1 },
            $set: { 'stats.lastActivityAt': new Date() }
        }
    );
};

const decrementMemberCount = async (chatId: string | Types.ObjectId): Promise<void> => {
    const chatObjectId = typeof chatId === "string" ? new Types.ObjectId(chatId) : chatId;

    await ChatModel.updateOne(
        { _id: chatObjectId },
        {
            $inc: { 'stats.memberCount': -1 },
            $set: { 'stats.lastActivityAt': new Date() }
        }
    );
};

export const groupChatRepository = {
    createGroupChat,
    updateChatStats,
    incrementMemberCount,
    decrementMemberCount
}