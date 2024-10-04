import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from "../../shared/knex";
import { error, success } from "../../shared/response-map";

export const getLibraries = async (req: Request, res: Response): Promise<void> => {
    try {
        const libraries = await db('libraries').select('*').orderBy('created_at', 'desc');
        success(res, libraries)
    } catch (err: any) {
        error(res, err.message);
    }
}

export const createLibrary = async (req: Request, res: Response): Promise<void> => {
    const { name, address, email, phone_number } = req.body;
    try {
        const id = uuidv4();
        await db('libraries').insert({ id, name, address, email, phone_number });
        success(res, { id, message: 'Library created' }, 201);
    } catch (err: any) {
        error(res, err.message);
    }
}

export const updateLibrary = async (req: Request, res: Response) => {
    const { id, name, address, email, phone_number } = req.body;
    try {
        await db('libraries').where({ id }).update({ name, address, email, phone_number });
        success(res, 'Library updated', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const deleteLibrary = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db('libraries').where({ id }).del();
        success(res, 'Library deleted', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};
