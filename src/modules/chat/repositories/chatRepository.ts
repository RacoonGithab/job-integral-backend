import {ChatModel} from "../database/schemas/chat.schema";
import {
    ChatBaseDTO,
    existingChatRepoDto,
    findChatForUserRepoDto,
    listChatsUserRepoDto
} from "../../../types/dto/chat-DTO/chatRepoDto";
import {Types} from "mongoose";
import {ChatMemberModel} from "../database/schemas/chatMember.schema";
import {IChat} from "../database/types/chat.types";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";
import {MessageModel} from "../database/schemas/message.schema";
import {IChatMember} from "../database/types/chatMember.types";
import {IMessage} from "../database/types/message.types";

const findPrivateChatBetweenUsers = async (data: existingChatRepoDto): Promise<IChat | null>=> {
    const existingChat = await ChatModel.aggregate([
        {
            $match: {
                type: ChatType.DIRECT,
                status: { $ne: ChatStatus.DELETED }
            }
        },
        {
            $lookup: {
                from: 'chatmembers',
                localField: '_id',
                foreignField: 'chatId',
                as: 'members',
                pipeline: [
                    {
                        $match: {
                            userId: { $in: [data.userId, data.otherUserId] },
                            isActive: true
                        }
                    }
                ]
            }
        },
        {
            $match: {
                'members': { $size: 2 },
                'members.userId': { $all: [data.userId, data.otherUserId] }
            }
        },
        {
            $limit: 1
        }
    ]);

    return existingChat.length > 0 ? existingChat[0] : null;
};

const findListChatsByUserId = async (data: listChatsUserRepoDto): Promise<IChat[]> => {
    return ChatMemberModel.aggregate([
        {
            $match: {
                userId: data.userId,
                isActive: true
            }
        },
        {
            $lookup: {
                from: 'chats',
                localField: 'chatId',
                foreignField: '_id',
                as: 'chat',
                pipeline: [
                    {
                        $match: {
                            status: ChatStatus.ACTIVE
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            type: 1,
                            name: 1,
                            avatar: 1,
                            lastMessage: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: '$chat'
        },
        {
            $project: {
                _id: '$chat._id',
                type: '$chat.type',
                name: '$chat.name',
                avatar: '$chat.avatar',
                lastMessage: '$chat.lastMessage',
                unreadCount: '$unreadCount',
                isPinned: '$settings.isPinned',
                isMuted: '$settings.isMuted',
                lastSeenAt: '$lastSeenAt'
            }
        },
        {
            $sort: {
                isPinned: -1,
                'lastMessage.timestamp': -1
            }
        }
    ]);
};



export const findChatForUser = async (data: findChatForUserRepoDto): Promise<ChatBaseDTO | null> => {
    const chatId = new Types.ObjectId(data.chatId);
    const requireActive = data.requireActive ?? true;

    const chat = await ChatModel.findOne({
        _id: chatId,
        status: { $ne: ChatStatus.DELETED }
    }).lean();

    if (!chat) {
        return null;
    }

    const currentUserMembership = await ChatMemberModel.findOne({
        chatId,
        userId: data.userId
    }).lean() as IChatMember | null;

    if (!currentUserMembership) {
        return null;
    }


    if (requireActive && !currentUserMembership.isActive) {
        return null;
    }

    const members = await ChatMemberModel.find({
        chatId,
        isActive: true
    })
        .select('userId role userInfo settings joinedAt lastSeenAt unreadCount')
        .lean() as IChatMember[];

    const recentMessagesDesc = await MessageModel.find({
        chatId,
        isDeleted: false
    })
        .sort({ timestamp: -1 })
        .limit(50)
        .select('senderId senderInfo content timestamp status isEdited reactions');

    const messages = recentMessagesDesc
        .map(d => d.toObject() as IMessage)
        .reverse();

    return {
        _id: chat._id,
        type: chat.type,
        status: chat.status,
        name: chat.name,
        description: chat.description,
        avatar: chat.avatar,
        createdBy: chat.createdBy,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        settings: chat.settings,
        stats: chat.stats,
        lastMessage: chat.lastMessage,
        members,
        messages,
        currentUserInfo: currentUserMembership
    };
};

const touchLastActivity = async (chatId: Types.ObjectId): Promise<void> => {
    await ChatModel.updateOne(
        { _id: chatId },
        { $set: { 'stats.lastActivityAt': new Date() } }
    );
}

const deleteChatHard = async (chatId: Types.ObjectId): Promise<void> => {
    await ChatModel.deleteOne({ _id: chatId });
}


export const chatRepository = {
    findPrivateChatBetweenUsers,
    findListChatsByUserId,
    findChatForUser,
    touchLastActivity,
    deleteChatHard,
}