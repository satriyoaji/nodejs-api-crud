import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

export const hasRole = (roles: string[]) => {
    return function (
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!roles.includes(res.locals.user.role)) {
                return next(
                    new AppError(403, `Route ${req.originalUrl} forbidden`)
                );
            }

            next();
        } catch (err: any) {
            next(err);
        }
    }
};
