import {Request, Response} from "express";
import {authService} from "../services/authService";


const loginUser = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, passwordResetToken } = await authService.loginUser(req.body)
    res.status(200).json({accessToken, refreshToken, passwordResetToken});
}


export const authController = {
    loginUser
}