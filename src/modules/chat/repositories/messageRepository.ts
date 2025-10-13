import { MessageModel } from "../database/schemas/message.schema";
import {
    createMessageRepoDto,
    deleteMessageByIdRepoDto,
    getMessagesRepoDto,
    updateMessageRepoDto
} from "../../../types/dto/message-DTO/messageRepoDto";
import {IMessage} from "../database/types/message.types";
import {Types} from "mongoose";
import {as} from "@faker-js/faker/dist/airline-CHFQMWko";

const createMessage = async (data: createMessageRepoDto): Promise<IMessage> => {
    return new MessageModel({
        chatId: new Types.ObjectId(data.chatId),
        senderId: data.senderId,
        senderInfo: data.senderInfo,
        content: data.content,
        timestamp: data.timestamp
    }).save();
};

const findMessageById = async (messageId: string): Promise<IMessage | null> => {
    return MessageModel.findById(messageId);
}

const updateMessageById = async (data: updateMessageRepoDto): Promise<IMessage | null> => {
    const updateData: Partial<updateMessageRepoDto> = {};

    if (data.content) updateData.content = data.content;
    if (data.timestamp) updateData.timestamp = data.timestamp;

    updateData.isEdited = true;
    updateData.editedAt = new Date();

    return MessageModel.findByIdAndUpdate(
        data.messageId,
        { $set: updateData },
        { new: true }
    );
};

const getMessagesByChatId = async (
    data: getMessagesRepoDto
): Promise<IMessage[]> => {
    const { chatId, limit = 50, beforeMessageId } = data;

    const query: Record<string, any> = {
        chatId: new Types.ObjectId(chatId),
        isDeleted: false,
    };

    if (beforeMessageId) {
        const beforeMessage = await MessageModel.findById(beforeMessageId).select('timestamp');
        if (beforeMessage) {
            query.timestamp = { $lt: beforeMessage.timestamp };
        }
    }

    const messagesDesc = await MessageModel
        .find(query)
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();

    const messages: IMessage[] = messagesDesc.reverse().map(msg => ({
        ...msg,
        readBy: new Map(Object.entries(msg.readBy || {})),
    }));

    return messages;
};

const deleteMessageById = async (data: deleteMessageByIdRepoDto): Promise<void> => {
    await MessageModel.deleteOne({
        _id: new Types.ObjectId(data.messageId),
        chatId: new Types.ObjectId(data.chatId)
    });
};


export const messageRepository = {
    createMessage,
    findMessageById,
    updateMessageById,
    getMessagesByChatId,
    deleteMessageById
}