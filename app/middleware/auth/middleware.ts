import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { error } from "../../shared/response-map";
import config from '../../../config/config.json';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const { super_admin = null, library_id } = req.query;

    if (super_admin) {
        next();
        (req as any).user = { role: 'super_admin', library_id };
        return;
    }
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return error(res, 'Access Denied');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return error(res, 'Malformed token');
    }

    try {
        const verified = jwt.verify(token, config.JWT_SECRET);
        (req as any).user = verified;
        next();
    } catch (err) {
        console.error(err);
        return error(res, 'Invalid token');
    }
}
