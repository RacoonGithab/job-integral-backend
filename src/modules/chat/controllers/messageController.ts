import {Request, Response} from "express";
import {messageService} from "../services/messageService";


const sendMessage = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const senderId = req.body.userId;
    const { type, text, attachments, replyTo, systemType } = req.body;

    const message = await messageService.sendMessage({
        chatId,
        senderId,
        type,
        text,
        attachments,
        replyTo,
        systemType
    });

    res.status(201).json({ message });
}

const updateMessage = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const senderId = req.body.userId;
    const { messageId, text, attachments, type } = req.body;

    const updateMessage = await messageService.updateMessage({
        chatId,
        senderId,
        messageId,
        text,
        attachments,
        type
    });

    res.status(200).json({updateMessage});
}


const getChatMessages = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = req.body.userId;
    const lastMessageId = req.body.lastMessageId;

    const { messages, hasMore } = await messageService.getChatMessages({
        chatId,
        userId,
        lastMessageId
    });

    res.status(200).json({ messages, hasMore });
}

export const messageController = {
    sendMessage,
    updateMessage,
    getChatMessages
}