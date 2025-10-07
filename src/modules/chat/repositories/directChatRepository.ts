import {createPrivateChatRepoDto} from "../../../types/dto/chat-DTO/chatRepoDto";
import {IChat} from "../database/types/chat.types";
import {ChatModel} from "../database/schemas/chat.schema";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";
import { Types } from "mongoose";
import {MessageModel} from "../database/schemas/message.schema";


const createDirectChat = async (data: createPrivateChatRepoDto): Promise<IChat> => {
    return new ChatModel({
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
    }).save();
};

const activatePrivateChatIfFirstMessage = async (chatId: string): Promise<void> => {
    const chatObjectId = new Types.ObjectId(chatId);

    const messagesCount = await MessageModel.countDocuments({ chatId: chatObjectId, isDeleted: false });

    if (messagesCount === 1) {
        await ChatModel.updateOne(
            { _id: chatObjectId },
            { $set: { status: ChatStatus.ACTIVE } }
        );
    }
};

export const directChatRepository = {
    createDirectChat,
    activatePrivateChatIfFirstMessage
}