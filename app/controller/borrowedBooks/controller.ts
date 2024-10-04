import { Response, Request } from "express";
import { v4 as uuidv4 } from 'uuid';
import db from "../../shared/knex";
import { calculateOverdueFee } from "../../utils";
import { error, success } from "../../shared/response-map";

export const getBorrowedBooks = async (req: any, res: Response) => {
    try {
        const { library_id, status } = req.user;
        const borrowedBooks = await db('borrowed_books as bb')
            .innerJoin('books as b', 'b.id', 'bb.book_id')
            .select('bb.*', 'b.title')
            .modify((builder) => {
                if (library_id) {
                    builder.where({ 'bb.library_id': library_id });
                }
                if (status) {
                    builder.where({ status })
                }
            }).orderBy('created_at', 'desc')
        success(res, borrowedBooks)
    } catch (err: any) {
        error(res, err.message);
    }
};

export const createBorrowedBook = async (req: any, res: Response) => {
    const { library_id } = req.user;
    const { user_id, book_id, due_date, status, borrow_date, id } = req.body;
    try {
        await db('borrowed_books').insert({ id: uuidv4(), library_id, user_id, book_id, borrow_date: new Date(borrow_date), due_date: new Date(due_date), status, borrow_request_id: id });
        success(res, 'Book borrowed', 201);
    } catch (err: any) {
        error(res, err.message);
    }
};

export const updateBorrowedBook = async (req: any, res: Response) => {
    const { id, due_date, return_date, status } = req.body;
    const finePerDay = 10;
    try {

        const payload: any = {
            id,
            status,
        }

        payload.due_date = new Date(due_date);
        let fine_amount = 0;

        if (status === 'returned') {
            const actualReturnDate = return_date ? new Date(return_date) : new Date();
            payload.return_date = actualReturnDate;

            const dueDate = new Date(due_date);
            const overdueDays = Math.floor((actualReturnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

            if (overdueDays > 0) {
                fine_amount = overdueDays * finePerDay;
                payload.status = 'overdue';
            }
        }

        await db('borrowed_books')
            .where({ id })
            .update({ ...payload, fine_amount });

        return success(res, 'Updated successfully');
    } catch (err: any) {
        error(res, err.message);
    }
};

export const deleteBorrowedBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db('borrowed_books').where({ id }).del();
        success(res, 'Borrowed book deleted');
    } catch (err: any) {
        error(res, err.message);
    }
};
