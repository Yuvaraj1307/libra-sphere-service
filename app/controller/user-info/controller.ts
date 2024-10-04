import { Response } from "express";
import db from "../../shared/knex";
import { error, success } from "../../shared/response-map";

export const userInfo = async (req: any, res: Response) => {
    const { id } = req.user;
    try {
        const users = await db('users').select().where('id', id).first();
        success(res, users);
    } catch (err: any) {
        error(res, err.message);
    }
};