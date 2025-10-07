export interface createDirectChatDto {
    userId: string;
    otherUserId: string;
}

export interface getUserActiveChatDto {
    userId: string;
}

export interface getUserChatDto {
    userId: string;
    chatId: string;
}

export interface createGroupChatDto {
    userId: string;
    chatName: string;
    description?: string;
    memberIds: string[];
}

export interface leaveDirectChatDto {
    userId: string;
    chatId: string;
}

export interface leaveGroupChatDto {
    userId: string;
    chatId: string;
    transferOwnerToUserId?: string;
}

export interface deleteGroupChatDto {
    userId: string;
    chatId: string;
}