import {createPrivateChatRepoDto} from "../../../types/dto/chat-DTO/chatRepoDto";
import {IChat} from "../database/types/chat.types";
import {ChatModel} from "../database/schemas/chat.schema";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";


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

export const directChatRepository = {
    createDirectChat
}