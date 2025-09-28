import {Request, Response} from "express";
import {groupChatService} from "../services/groupChatService";

const createGroupChat = async (req: Request, res: Response) => {
    const { userId, memberIds, chatName } = req.body;

    const chat = await groupChatService.createGroupChat({userId, memberIds, chatName});
    res.status(201).send({ chat });
}

export const groupChatController = {
    createGroupChat
}