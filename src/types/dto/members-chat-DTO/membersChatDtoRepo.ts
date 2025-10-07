import { Types } from "mongoose";
import { ChatRole } from "../../../modules/chat/database/enums/chatMember.enums";

export interface isUserMemberOfChatDto {
    userId: string;
    chatId: string;
}

export interface createChatMemberDto {
    chatId: Types.ObjectId;
    userId: string;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
    role?: ChatRole;
}

export interface findActiveMemberRepoDto{
    userId: string,
    chatId: string
}

export interface promoteToChatCreatorRepoDto {
    chatId: Types.ObjectId,
    userId: string
}

export interface softLeaveMemberRepoDto {
    chatId: Types.ObjectId;
    userId: string
}

export interface incrementUnreadCountRepoDto {
    chatId: string | Types.ObjectId;
    excludeUserId: string
}

export interface updateLastSeenRepoDto {
    chatId: string | Types.ObjectId;
    userId: string
}


export interface deleteMemberRepoDto {
    chatId: Types.ObjectId;
    userId: string
}