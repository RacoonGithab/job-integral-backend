import { Request, Response, NextFunction } from "express";
import ApiError from "../error/ApiError";
import {fireBaseConstants} from "../utils/constants/fireBaseConstatnts";

export const validateImageFile = (req: Request, _res: Response, next: NextFunction) => {
    const file = req.file;

    if (!file) {
        return next();
    }

    try {
        if (!file.mimetype.startsWith("image/")) {
            throw new Error("Avatar must be an image");
        }
        if (file.size > fireBaseConstants.MAX_AVATAR_SIZE) {
            throw new Error("Avatar size must not exceed 5MB");
        }
        next();
    } catch (err) {
        return next(new ApiError(400, (err as Error).message));
    }
};
