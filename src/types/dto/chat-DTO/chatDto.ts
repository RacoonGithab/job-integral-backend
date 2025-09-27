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
    userId: string;           // ID создателя
    chatName: string;         // Название группы
    description?: string;     // Описание группы (опционально)
    memberIds: string[];
}