import {Request, Response} from "express";
import {messageService} from "../services/messageService";


const sendMessage = async (req: Request, res: Response) => {
    const chatId = req.params.chatId;
    const senderId = req.body.userId;
    const { text } = req.body;

    const message = await messageService.sendMessage({ chatId, senderId, text });
    res.status(201).send({ message });
}

export const messageController = {
    sendMessage,
}