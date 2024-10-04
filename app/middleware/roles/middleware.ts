import { NextFunction, Response } from "express"
import { error } from "../../shared/response-map"

export const roleAuthorization = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        const { super_admin = null, library_id } = req.query;
        if (super_admin) {
            next();
            (req as any).user = { role: 'super_admin', library_id };
            return;
        }

        if (!roles.includes(req.user.role)) {
            return error(res, { message: 'Forbidden' }, 403)
        }
        next();
    }
}