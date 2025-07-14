import {Request, Response, NextFunction} from "express";
import {tokenUtils} from "../utils/tokenUtils";
import {accessTokenPayload} from "../types/dto/tokenDto";


export const accessTokenValidation = async (
    req: Request & { user?: accessTokenPayload },
    _res: Response, next: NextFunction
): Promise<void> => {
    const {payload} = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyAccessToken,
        'access'
    );

    req.body = { ...req.body, ...payload };
    next();
}
