import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from "../../shared/knex";
import { error, success } from "../../shared/response-map";

export const getUsers = async (req: any, res: Response) => {
    const { library_id } = req.user;
    const { role } = req.query;
    try {
        const users = await db('users').select().modify((buider) => {
            if (library_id) {
                buider.where({ library_id })
            }
            if (role) {
                buider.where({ role })
            }
        }).orderBy('created_at', 'desc');
        success(res, users);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const createUser = async (req: any, res: Response) => {
    const { library_id } = req.user;
    const { name, email, password, role, address, phone_number } = req.body;
    try {
        const id = uuidv4();
        await db('users').insert({ id, library_id, name, email, password, role, address, phone_number });
        success(res, { id, message: 'User created' }, 201);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id, name, email, password, role, address, phone_number } = req.body;
    try {
        await db('users').where({ id }).update({ name, email, password, role, address, phone_number });
        success(res, 'User updated', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db('users').where({ id }).del();
        success(res, 'User deleted', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};
