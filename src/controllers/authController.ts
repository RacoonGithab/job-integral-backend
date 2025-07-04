import {Request, Response} from "express";
import {authService} from "../services/authService";


const login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.loginUser(req.body)
    res.status(200).json({accessToken, refreshToken, message:"Login successful"});
}


export const authController = {
    login
}