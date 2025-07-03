import {Request, Response} from "express";


const login = async (req: Request, res: Response) => {
    res.status(200).json({message: "Hello User"});
}


export const authController = {
    login
}