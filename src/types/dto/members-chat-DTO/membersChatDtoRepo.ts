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