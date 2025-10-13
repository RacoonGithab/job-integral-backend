export interface getChatMembersDto {
    userId: string;
    chatId: string;
}

export interface addChatMemberDto {
    chatId: string;
    userId: string;
    newUserId: string;
}