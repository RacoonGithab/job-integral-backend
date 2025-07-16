import {NextFunction, Request, Response} from "express";
import {refreshTokenPayload} from "../types/dto/tokenDto";
import {tokenUtils} from "../utils/tokenUtils";


export const refreshTokenValidation = async (
    req: Request & { user?: refreshTokenPayload},
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const { payload } = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyRefreshToken,
        'refresh'
    );

    req.body = { ...payload };
    next();
}