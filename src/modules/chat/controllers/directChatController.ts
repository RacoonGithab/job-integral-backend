import {Request, Response} from "express";
import {directChatService} from "../services/directChatService";

const createDirectChat = async (req: Request, res: Response) => {
    const { userId, otherUserId } = req.body;

    const chat = await directChatService.createDirectChat({userId, otherUserId});
    res.status(201).send({ chat });
}

const leaveDirectChat = async (req: Request, res: Response) => {
    const { chatId } = req.params
    const { userId } = req.body;

    await directChatService.leaveDirectChat({ userId, chatId });
    res.status(204).send();
}

export const directChatController = {
    createDirectChat,
    leaveDirectChat
}