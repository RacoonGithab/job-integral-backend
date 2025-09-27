import { MessageModel } from "../database/schemas/message.schema";
import { Types } from "mongoose";
import {sendMessageRepoDto} from "../../../types/dto/message-DTO/messageRepoDto";
import {IMessage} from "../database/types/message.types";

const createMessage = async (data: sendMessageRepoDto): Promise<IMessage> => {
    const newMessage = new MessageModel({
        chatId: new Types.ObjectId(data.chatId),
        senderId: new Types.ObjectId(data.senderId),
        text: data.text,
        createdAt: data.createdAt,
    });

    return await newMessage.save();
};

export const messageRepository = {
    createMessage,
}