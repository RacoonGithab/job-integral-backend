import {Request, Response} from "express";
import {resetPasswordService} from "../services/resetPasswordService";


const resetPassword = async (req: Request, res: Response) => {
    const { newPassword, userId, resetToken } = req.body;
    await resetPasswordService.resetPassword({userId, newPassword, resetToken})
    res.status(200).json({message:"Password changed"})
}

export const resetPasswordController = {
    resetPassword
}