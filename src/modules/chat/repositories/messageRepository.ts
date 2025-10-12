import { MessageModel } from "../database/schemas/message.schema";
import {createMessageRepoDto, updateMessageRepoDto} from "../../../types/dto/message-DTO/messageRepoDto";
import {IMessage} from "../database/types/message.types";
import {Types} from "mongoose";

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


export const messageRepository = {
    createMessage,
    findMessageById,
    updateMessageById
}