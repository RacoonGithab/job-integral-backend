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

export const messageController = {
    sendMessage,
}