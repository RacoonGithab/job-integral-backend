import {Request, Response} from "express";
import {chatService} from "../services/chatService";

const getUserActiveChats = async (req: Request, res: Response) => {
    const { userId } = req.body;

    const chats = await chatService.getUserActiveChats({ userId });
    res.status(200).send({ chats });
}

const getUserChat = async (req: Request, res: Response) => {
    const {chatId} = req.params;
    const { userId } = req.body;

    const chat = await chatService.getUserChat({ userId, chatId });
    res.status(200).send({ chat });
}

const createPrivateChat = async (req: Request, res: Response) => {
    const { userId, otherUserId } = req.body;

    const chat = await chatService.createPrivateChat({userId, otherUserId});
    res.status(201).send({ chat });
}

const createGroupChat = async (req: Request, res: Response) => {
    const { userId, memberIds, chatName } = req.body;

    const chat = await chatService.createGroupChat({userId, memberIds, chatName});
    res.status(201).send({ chat });
}

export const chatController = {
    createPrivateChat,
    getUserActiveChats,
    getUserChat,
    createGroupChat
}