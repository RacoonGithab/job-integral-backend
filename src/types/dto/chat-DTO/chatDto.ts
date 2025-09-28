export interface createChatDto {
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

export interface sendMessageDto {
    text: string;
    senderId: string;
    chatId: string;
}


export interface createGroupChatDto {
    userId: string;
    chatName: string;
    description?: string;
    memberIds: string[];
}

export interface deleteChatDto {
    userId: string;
    chatId: string;
}