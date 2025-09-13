import {Request, Response} from "express";
import {resetPasswordService} from "../services/resetPasswordService";


const requestResetPassword = async (req: Request, res: Response) => {
    const passwordResetToken = await resetPasswordService.initiatePasswordReset(req.body)
    res.status(200).json(passwordResetToken)
}

const resetPassword = async (req: Request, res: Response) => {
    const { newPassword, userId, resetToken } = req.body;
    await resetPasswordService.resetPassword({userId, newPassword, resetToken})
    res.status(200).json({message:"Password changed"})
}

const verifyResetPasswordCode = async (req: Request, res: Response) => {
    const { userId, resetToken, verificationCode } = req.body;
    await resetPasswordService.verifyPasswordResetCode({userId, verificationCode, resetToken})
    res.status(200).json({message:"Successful code verification"})
}

export const resetPasswordController = {
    requestResetPassword,
    verifyResetPasswordCode,
    resetPassword
}