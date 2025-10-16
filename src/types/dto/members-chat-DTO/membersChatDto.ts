import {ChatRole} from "../../../modules/chat/database/enums/chatMember.enums";

export interface getChatMembersDto {
    userId: string;
    chatId: string;
}

export interface addChatMemberDto {
    chatId: string;
    userId: string;
    newUserId: string;
}

export interface updateMemberRoleDto {
    chatId: string;
    userId: string;
    targetUserId: string;
    newRole: ChatRole;
}

export interface deleteChatMemberDto {
    chatId: string;
    userId: string;
    deleteUserId: string;
}