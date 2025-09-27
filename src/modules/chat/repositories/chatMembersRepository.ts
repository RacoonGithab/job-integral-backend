import { Types } from "mongoose";
import {createChatMemberDto, isUserMemberOfChatDto} from "../../../types/dto/members-chat-DTO/membersChatDtoRepo";
import {ChatMemberModel} from "../database/schemas/chatMember.schema";
import {IChatMember} from "../database/types/chatMember.types";
import {ChatRole} from "../database/enums/chatMember.enums";

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


const isMemberUserChatById = async (data: isUserMemberOfChatDto): Promise<boolean> => {
    const chatObjectId = new Types.ObjectId(data.chatId);

    const member: IChatMember | null = await ChatMemberModel.findOne({
        userId: data.userId,
        chatId: chatObjectId,
    }).select("_id");

    return !!member;
};

export const chatMembersRepository = {
    isMemberUserChatById,
    createChatMembersByIds
}