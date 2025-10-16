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

const updateMemberRole = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = req.body.userId;
    const { newRole, targetUserId } = req.body;

    await chatMembersService.updateMemberRole({ chatId, userId, targetUserId, newRole });
    res.status(200).json("User updated")
}

const deleteChatMember = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    const userId = req.body.userId;
    const { deleteUserId } = req.body;

    await chatMembersService.deleteChatMember({ chatId, userId, deleteUserId });
    res.status(204).json()
}

export const chatMembersController = {
    addChatMember,
    getChatMembers,
    updateMemberRole,
    deleteChatMember
}