import {Request, Response} from "express";
import {chatMembersService} from "../services/chatMembersService";

const getChatMembers = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = req.body.userId;

    const chatMembers = await chatMembersService.getChatMembers({ chatId, userId });
    res.status(200).json(chatMembers);
}

export const chatMembersController = {
    getChatMembers
}