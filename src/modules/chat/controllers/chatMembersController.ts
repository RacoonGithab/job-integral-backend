import {Request, Response} from "express";
import {chatMembersService} from "../services/chatMembersService";

const addChatMember = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = req.body.userId;
    const newUserId = req.body.newUserId;

    await chatMembersService.addChatMember({chatId, userId, newUserId});
    res.status(201).json("User added")
}

const getChatMembers = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = req.body.userId;

    const chatMembers = await chatMembersService.getChatMembers({ chatId, userId });
    res.status(200).json(chatMembers);
}


export const chatMembersController = {
    addChatMember,
    getChatMembers
}