import { Request, Response, NextFunction } from 'express';
import { MessageType } from '../modules/chat/database/enums/message.enums';
import ApiError from '../error/ApiError';
import {fileUploadUtil} from "../utils/chat-utils/fileUploadUtil";
import {error} from "../utils/constants/errorMasseges";

export const validateMessageFiles = (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    const messageType = req.body.type as MessageType;

    if (!files || files.length === 0) {
        return next();
    }

    if (![MessageType.IMAGE, MessageType.FILE, MessageType.VOICE].includes(messageType)) {
        return next(new ApiError(400, error.INVESTMENT_REQUIRED));
    }

    try {
        for (const file of files) {
            fileUploadUtil.validateFile(file, messageType);
        }
        next();
    } catch (err) {
        next(new ApiError(400, (err as Error).message));
    }
};