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

export const messageController = {
    sendMessage,
    updateMessage
}