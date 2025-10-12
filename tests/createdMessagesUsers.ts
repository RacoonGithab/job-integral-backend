import { IMessage } from "../src/modules/chat/database/types/message.types";
import { messageRepository } from "../src/modules/chat/repositories/messageRepository";
import { MessageType } from "../src/modules/chat/database/enums/message.enums";
import { faker } from "@faker-js/faker";

interface CreateTestMessagesParams {
    chatId: string;
    userIds: string[];
    messagesPerUser: number;
    baseText?: string;
    delayMs?: number;
}

export const createTestMessages = async (params: CreateTestMessagesParams): Promise<IMessage[]> => {
    const { chatId, userIds, messagesPerUser, delayMs = 1000 } = params;
    const createdMessages: IMessage[] = [];

    for (const userId of userIds) {
        for (let i = 1; i <= messagesPerUser; i++) {
            const messageData = {
                chatId,
                senderId: userId,
                senderInfo: {
                    username: `user_${userId}`,
                    displayName: `User ${userId}`,
                    avatarUrl: faker.image.avatar()
                },
                content: {
                    type: MessageType.TEXT,
                    text: faker.lorem.sentence(),
                    attachments: []
                },
                timestamp: new Date()
            };

            const created = await messageRepository.createMessage(messageData);
            createdMessages.push(created);

            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return createdMessages;
};