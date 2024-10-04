import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../../shared/knex";
import { error, success } from "../../shared/response-map";
import config from "../../../config/config.json";

export const login = async (req: Request, res: Response) => {
    const { email, password, super_admin_library_id } = req.body;

    try {
        const user = await db('users').select('*').where({ email, password }).first();

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const { id, role, library_id = null } = user;
        const token = jwt.sign({ id, role, library_id: library_id || super_admin_library_id }, config.JWT_SECRET, { expiresIn: '3h' });

        return success(res, { token });
    } catch (err: any) {
        error(res, err.message);
    }
};
