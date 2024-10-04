import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import { success, error } from "../../shared/response-map";
import db from "../../shared/knex";

export const getBooks = async (req: any, res: Response) => {
    try {
        const { library_id } = req.user;
        const books = await db('books').where({ library_id }).select().orderBy('created_at', 'desc');
        success(res, books);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const getApprovedBooks = async (req: any, res: Response) => {
    try {
        const { id: user_id } = req.user;
        const approvedBooks = await db('borrow_requests').where({ user_id, status: 'approved' }).orderBy('created_at', 'desc');
        success(res, approvedBooks);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const createBook = async (req: any, res: Response) => {
    const { library_id, } = req.user;
    const { title, author, isbn, genre, status, quantity_available, quantity_total } = req.body;
    try {
        const id = uuidv4();
        await db('books').insert({ id, library_id, title, author, isbn, genre, status, quantity_available, quantity_total });
        success(res, { message: 'Book created', id }, 201);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const updateBook = async (req: Request, res: Response) => {
    const { id, title, author, isbn, genre, status, quantity_available, quantity_total } = req.body;
    try {
        await db('books').where({ id }).update({ title, author, isbn, genre, status, quantity_available, quantity_total });
        success(res, 'Book created');
    } catch (err: any) {
        error(res, err.message);
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db('books').where({ id }).del();
        success(res, 'Book created');
    } catch (err: any) {
        error(res, err.message);
    }
};
