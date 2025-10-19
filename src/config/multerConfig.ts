import multer from 'multer';
import { Request} from 'express';

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, _file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    cb(null, true);
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 10
    },
    fileFilter
});
