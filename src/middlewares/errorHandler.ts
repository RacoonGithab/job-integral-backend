import {Request, Response, NextFunction} from "express";
import ApiError from "../error/ApiError";
import {error} from "../utils/constants/errorMasseges";


export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        console.error('Unhandled error:', err);
        res.status(500).json({ error: error.INTERNAL_SERVER_ERROR });
    }
};