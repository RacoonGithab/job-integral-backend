import {Request, Response} from "express";
import {authService} from "../services/authService";
import {LoginResultDto} from "../types/dto/authDto";


const loginUser = async (req: Request, res: Response) => {
    const result: LoginResultDto = await authService.loginUser(req.body)
    res.status(200).json({ LoginResultDto: result });
}

const verifyLoginCode = async (req: Request, res: Response) => {
    const result: LoginResultDto = await authService.verifyLoginCode(req.body)
    res.status(200).json({ LoginResultDto: result });
}

const refreshTokens = async (req: Request, res: Response)=> {
    const result: LoginResultDto = await authService.refreshTokens(req.body);
    res.status(200).json({ LoginResultDto: result, message: "Refresh token successful" });
}

const logoutUser = async (req: Request, res: Response) => {
    await authService.logoutUser(req.body)
    res.status(200).json({message:"You are logged out"});
}

export const authController = {
    loginUser,
    verifyLoginCode,
    refreshTokens,
    logoutUser
}