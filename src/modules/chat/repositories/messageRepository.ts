import { MessageModel } from "../database/schemas/message.schema";
import {createMessageRepoDto} from "../../../types/dto/message-DTO/messageRepoDto";
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

export const messageRepository = {
    createMessage,
    findMessageById
}