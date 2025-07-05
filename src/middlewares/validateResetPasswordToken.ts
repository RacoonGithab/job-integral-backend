import {NextFunction, Request, Response} from "express";
import {resetTokenPayload} from "../types/dto/tokenDto";
import {tokenUtils} from "../utils/tokenUtils";



export const validateResetPasswordToken = async (
    req: Request & { user?: resetTokenPayload},
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const {payload, token} = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyPasswordResetToken,
        'reset_token'
    );

    req.params = { ...payload, resetToken: token };
    next();
}