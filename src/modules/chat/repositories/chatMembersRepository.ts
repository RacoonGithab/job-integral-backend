import { Types } from "mongoose";
import {createChatMemberDto, isUserMemberOfChatDto} from "../../../types/dto/members-chat-DTO/membersChatDtoRepo";
import {ChatMemberModel} from "../database/schemas/chatMember.schema";
import {IChatMember} from "../database/types/chatMember.types";
import {ChatRole} from "../database/enums/chatMember.enums";
import {
    deleteMemberRepoDto,
    findActiveMemberRepoDto,
    promoteToChatCreatorRepoDto,
    softLeaveMemberRepoDto
} from "../../../types/dto/chat-DTO/chatRepoDto";

const createChatMembersByIds = async (members: createChatMemberDto[]): Promise<IChatMember[]> => {
    const membersData = members.map(member => ({
        chatId: member.chatId ,
        userId: member.userId,
        role: member.role || ChatRole.MEMBER,
        joinedAt: new Date(),
        lastSeenAt: new Date(),
        isActive: true,
        userInfo: {
            username: member.username,
            displayName: member.displayName,
            avatarUrl: member.avatarUrl || undefined,
            lastSyncAt: new Date()
        },
        settings: {
            isMuted: false,
            notificationsEnabled: true,
            notificationSound: 'default',
            isPinned: false
        },
        unreadCount: 0,
    }));

    return await ChatMemberModel.insertMany(membersData);
};


const findActiveMember= async (data: findActiveMemberRepoDto): Promise<IChatMember | null> => {
    return ChatMemberModel.findOne({
        chatId: data.chatId,
        userId: data.userId,
        isActive: true
    });
}

const promoteToChatCreator = async (data: promoteToChatCreatorRepoDto): Promise<void> => {
    await ChatMemberModel.updateOne({
        chatId: data.chatId, userId: data.userId, isActive: true},
        { $set: { role: ChatRole.CREATOR }
    })
}

const isMemberUserChatById = async (data: isUserMemberOfChatDto): Promise<boolean> => {
    const chatObjectId = new Types.ObjectId(data.chatId);

    const member: IChatMember | null = await ChatMemberModel.findOne({
        userId: data.userId,
        chatId: chatObjectId,
    }).select("_id");

    return !!member;
};

const softLeaveMember = async (data: softLeaveMemberRepoDto): Promise<boolean> => {
    const res = await ChatMemberModel.updateOne(
        { chatId: data.chatId, userId: data.userId, isActive: true },
        { $set: { isActive: false, leftAt: new Date(), userDeleted: true } }
    );

    return res.modifiedCount > 0;
}

const countActiveMembers = async (chatId: Types.ObjectId): Promise<number> => {
    return ChatMemberModel.countDocuments({ chatId, isActive: true });
}


const deleteAllMembersByChatId = async (chatId: Types.ObjectId): Promise<void> => {
    await ChatMemberModel.deleteMany({ chatId });
}

const deleteMember = async (data: deleteMemberRepoDto): Promise<boolean> => {
    const res = await ChatMemberModel.deleteOne({ chatId: data.chatId, userId: data.userId });
    return res.deletedCount > 0;
}

export const chatMembersRepository = {
    isMemberUserChatById,
    createChatMembersByIds,
    softLeaveMember,
    countActiveMembers,
    deleteAllMembersByChatId,
    deleteMember,
    findActiveMember,
    promoteToChatCreator
}