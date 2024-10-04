import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const decoded: any = jwt.verify(token, 'secret');
        req.library_id = decoded.libraryId; // Attach library ID to request
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        return res.status(403).send('Access denied');
    }
    next();
};

export const isMember = (req: any, res: Response, next: NextFunction) => {
    if (req.user.role !== 'Member' && req.user.role !== 'Admin' && req.user.role !== 'Super Admin' && req.user.role !== 'Librarian') {
        return res.status(403).send('Access denied');
    }
    next();
};