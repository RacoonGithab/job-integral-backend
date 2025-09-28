import {createPrivateChatRepoDto} from "../../../types/dto/chat-DTO/chatRepoDto";
import {IChat} from "../database/types/chat.types";
import {ChatModel} from "../database/schemas/chat.schema";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";
import {Types} from "mongoose";
import {chatMembersRepository} from "./chatMembersRepository";


const createDirectChat = async (data: createPrivateChatRepoDto): Promise<IChat> => {
    const chatDoc = new ChatModel({
        type: ChatType.DIRECT,
        status: ChatStatus.INITIATED,
        createdBy: data.createdBy,
        settings: {
            isPublic: false,
            allowInvites: false,
            maxMembers: 2,
        },
        stats: {
            memberCount: 2,
            messageCount: 0,
            lastActivityAt: new Date()
        }
    });

    return await chatDoc.save();
};


const leaveDirectChat = async (params: { chatId: Types.ObjectId; userId: string }): Promise<void> => {
    const changed = await chatMembersRepository.softLeaveMember({ chatId: params.chatId, userId: params.userId });

    if (!changed) {
        await touchLastActivity(params.chatId);
        return;
    }

    const activeCount = await chatMembersRepository.countActiveMembers(params.chatId);

    if (activeCount === 0) {
        await deleteChatHard(params.chatId);
        return;
    }

    await touchLastActivity(params.chatId);
}

const touchLastActivity = async (chatId: Types.ObjectId): Promise<void> => {
    await ChatModel.updateOne(
        { _id: chatId },
        { $set: { 'stats.lastActivityAt': new Date() } }
    );
}

const deleteChatHard = async (chatId: Types.ObjectId): Promise<void> => {
    await chatMembersRepository.deleteAllByChatId(chatId);
    await ChatModel.deleteOne({ _id: chatId });
    // Если нужно — очистка сообщений тут или вынесите в worker
    // await MessageModel.deleteMany({ chatId });
}

export const directChatRepository = {
    createDirectChat,
    leaveDirectChat,
}