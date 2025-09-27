
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
}

export interface createGroupChatRepoDto {
    chatName: string;
    description?: string;
    createdBy: string;
    memberCount: number;
}
