import {ChatStatus, ChatType} from "../../../modules/chat/database/enums/chat.enums";
import {IChat} from "../../../modules/chat/database/types/chat.types";
import {IChatMember} from "../../../modules/chat/database/types/chatMember.types";
import {IMessage} from "../../../modules/chat/database/types/message.types";
import {Types} from "mongoose";
import {ChatRole} from "../../../modules/chat/database/enums/chatMember.enums";

export interface createPrivateChatRepoDto {
    createdBy: string;
}

export interface existingChatRepoDto {
    userId: string;
    otherUserId: string;
}

export interface listChatsUserRepoDto {
    userId: string;
}

export interface findChatForUserRepoDto {
    userId: string;
    chatId: string;
    requireActive?: boolean;
}

export interface createGroupChatRepoDto {
    chatName: string;
    description?: string;
    createdBy: string;
    memberCount: number;
}

export interface ChatBaseDTO {
    _id: Types.ObjectId;
    type: ChatType;
    status: ChatStatus;
    name?: string;
    description?: string;
    avatar?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    settings: IChat['settings'];
    stats: IChat['stats'];
    lastMessage?: IChat['lastMessage'];
    members: IChatMember[];
    messages: IMessage[];
    currentUserInfo: IChatMember;
}

export interface ChatFullResult {
    chat: ChatBaseDTO & {
        members: IChatMember[];
        messages: IMessage[];
        currentUserInfo: IChatMember;
    };
}

export interface leaveGroupChatRepoDto {
    chatId: Types.ObjectId;
    userId: string;
    currentUserRole: ChatRole;
    transferOwnerToUserId?: string;
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

export interface deleteMemberRepoDto {
    chatId: Types.ObjectId;
    userId: string
}

export interface transferTitleRepoDto {
    userId: string;
    chatId: string;
    currentOwnerId: string;
    newOwnerUserId: string;
}