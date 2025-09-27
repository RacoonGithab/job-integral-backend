import { ChatModel } from "../database/schemas/chat.schema";
import {
    createPrivateChatRepoDto,
    createGroupChatRepoDto,
    existingChatRepoDto,
    findChatForUserRepoDto,
    listChatsUserRepoDto
} from "../../../types/dto/chat-DTO/chatRepoDto";
import { Types } from "mongoose";
import {ChatMemberModel} from "../database/schemas/chatMember.schema";
import {IChat} from "../database/types/chat.types";
import {ChatStatus, ChatType} from "../database/enums/chat.enums";

const createPrivateChat = async (data: createPrivateChatRepoDto): Promise<IChat> => {
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


const findChatForUser = async (data: findChatForUserRepoDto): Promise<IChat | null> => {
    const chatObjectId = new Types.ObjectId(data.chatId);

    const result = await ChatModel.aggregate([
        {
            $match: {
                _id: chatObjectId,
                status: { $ne: ChatStatus.DELETED }
            }
        },
        {
            $lookup: {
                from: "chatmembers",
                localField: "_id",
                foreignField: "chatId",
                as: "userMembership",
                pipeline: [
                    {
                        $match: {
                            userId: data.userId,
                            isActive: true
                        }
                    }
                ]
            }
        },
        {
            $match: {
                "userMembership": { $size: 1 }
            }
        },
        {
            $lookup: {
                from: "chatmembers",
                localField: "_id",
                foreignField: "chatId",
                as: "allMembers",
                pipeline: [
                    {
                        $match: {
                            isActive: true
                        }
                    },
                    {
                        $project: {
                            userId: 1,
                            role: 1,
                            userInfo: 1,
                            settings: 1,
                            joinedAt: 1,
                            lastSeenAt: 1,
                            unreadCount: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "messages",
                localField: "_id",
                foreignField: "chatId",
                as: "recentMessages",
                pipeline: [
                    {
                        $match: {
                            isDeleted: false
                        }
                    },
                    {
                        $sort: { timestamp: -1 }
                    },
                    {
                        $limit: 50
                    },
                    {
                        $project: {
                            senderId: 1,
                            senderInfo: 1,
                            content: 1,
                            timestamp: 1,
                            status: 1,
                            isEdited: 1,
                            reactions: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                type: 1,
                name: 1,
                description: 1,
                avatar: 1,
                status: 1,
                createdBy: 1,
                createdAt: 1,
                updatedAt: 1,
                settings: 1,
                stats: 1,
                lastMessage: 1,
                members: "$allMembers",
                messages: {
                    $reverseArray: "$recentMessages"
                },
                currentUserInfo: {
                    $arrayElemAt: ["$userMembership", 0]
                }
            }
        }
    ]);

    return result[0] || null;
};


export const chatRepository = {
    findPrivateChatBetweenUsers,
    createPrivateChat,
    findListChatsByUserId,
    findChatForUser,
    createGroupChat
}