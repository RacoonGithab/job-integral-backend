import { Request, Response, NextFunction } from 'express';
import ApiError from "../error/ApiError";
import {error} from "../utils/constants/errorMasseges";

export const requireRole = (requiredRole: string) => {
    return (req: Request<{ userId: string; role: string }>, res: Response, next: NextFunction) => {
        const userRole = req.body.data?.role;;

        if (userRole !== requiredRole) {
            throw new ApiError(403, error.FORBIDDEN)
        }

        next();
    };
};