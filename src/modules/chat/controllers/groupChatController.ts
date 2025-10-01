import {Request, Response} from "express";
import {groupChatService} from "../services/groupChatService";

const createGroupChat = async (req: Request, res: Response) => {
    const { userId, memberIds, chatName } = req.body;

    const chat = await groupChatService.createGroupChat({userId, memberIds, chatName});
    res.status(201).send({ chat });
}

const leaveGroupChat = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { userId, transferOwnerToUserId } = req.body;

    await groupChatService.leaveGroupChat({ userId, chatId, transferOwnerToUserId });
    res.status(204).send();
}

const deleteGroupChat = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const { userId } = req.body;

    await groupChatService.deleteGroupChat({ userId, chatId });
    res.status(204).send();
}

export const groupChatController = {
    createGroupChat,
    leaveGroupChat,
    deleteGroupChat
}