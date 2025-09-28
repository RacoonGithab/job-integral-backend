import {createGroupChatRepoDto} from "../../../types/dto/chat-DTO/chatRepoDto";
import {IChat} from "../database/types/chat.types";
import {ChatModel} from "../database/schemas/chat.schema";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";

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

export const groupChatRepository = {
    createGroupChat,
}