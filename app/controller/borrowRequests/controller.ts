import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from "../../shared/knex";
import { error, success } from "../../shared/response-map";

export const getBorrowRequests = async (req: any, res: Response) => {
    const { library_id } = req.user;
    const { status, checkout } = req.query;
    try {
        const borrowRequests = await db('borrow_requests as br')
            .innerJoin('books as b', 'b.id', 'br.book_id')
            .select('br.*', 'b.title')
            .modify((builder) => {
                if (library_id) {
                    builder.where({ 'br.library_id': library_id });
                }
                if (status) {
                    builder.where({ 'br.status': status });
                }
                if (checkout) {
                    builder.whereNotIn('br.id', function () {
                        this.select('bb.borrow_request_id')
                            .from('borrowed_books as bb');
                    });
                }
            }).orderBy('created_at', 'desc')

        success(res, borrowRequests)
    } catch (err: any) {
        error(res, err.message);
    }
};

export const createBorrowRequest = async (req: any, res: Response) => {
    const { id: user_id, library_id } = req.user;
    const { book_id, status } = req.body;
    try {
        await db('borrow_requests').insert({ id: uuidv4(), book_id, library_id, user_id, status });
        success(res, 'Borrow request created', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const updateBorrowRequest = async (req: any, res: Response) => {
    const { id, book_id, status } = req.body;
    try {
        await db('borrow_requests').where({ id }).update({ book_id, status });
        success(res, 'Borrow request updated', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const deleteBorrowRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db('borrow_requests').where({ id }).del();
        success(res, 'Borrow request deleted', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};
