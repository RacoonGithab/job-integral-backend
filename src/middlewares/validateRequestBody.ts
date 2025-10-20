import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validateRequestBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = schema.parse(req.body);
        req.body = { ...req.body, ...parsedData };
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            res.status(400).json({ errors });
        }
    }
};