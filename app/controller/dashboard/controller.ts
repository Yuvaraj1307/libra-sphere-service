import { Response } from "express";
import db from "../../shared/knex";
import { error, success } from "../../shared/response-map";

const countRecords = async (table: string, conditions: any) => {
    const result = await db(table).where(conditions).count('id as total');
    return result[0]?.total || 0;
};

const fetchBorrowCounts = async (conditions: any) => {
    const pending = await countRecords('borrow_requests', { ...conditions, status: 'pending' });
    const approved = await countRecords('borrow_requests', { ...conditions, status: 'approved' });
    const rejected = await countRecords('borrow_requests', { ...conditions, status: 'rejected' });

    return { pending, approved, rejected };
};

const fetchBookStatusCounts = async (conditions: any) => {
    const borrowed = await countRecords('borrowed_books', { ...conditions, status: 'borrowed' });
    const overdue = await countRecords('borrowed_books', { ...conditions, status: 'overdue' });
    const returned = await countRecords('borrowed_books', { ...conditions, status: 'returned' });

    return { borrowed, overdue, returned };
};

export const getDashboardData = async (req: any, res: Response) => {
    try {
        const { id, role, library_id } = req.user;
        const baseLibraryCondition = { library_id };

        if (role === 'admin' || role === 'librarian') {
            const [books, borrowCounts, bookStatusCounts, users] = await Promise.all([
                countRecords('books', baseLibraryCondition),
                fetchBorrowCounts(baseLibraryCondition),
                fetchBookStatusCounts(baseLibraryCondition),
                countRecords('users', baseLibraryCondition),
            ]);

            const data: any = {
                books,
                borrowRequestsPending: borrowCounts.pending,
                borrowRequestsApproved: borrowCounts.approved,
                borrowRequestsRejected: borrowCounts.rejected,
                borrowedBooks: bookStatusCounts.borrowed,
                overdueBooks: bookStatusCounts.overdue,
                returnedBooks: bookStatusCounts.returned,
                users,
            };

            if (role === 'librarian') {
                data.members = await countRecords('users', { ...baseLibraryCondition, role: 'member' });
            }

            success(res, data);
        } else if (role === 'member') {
            const baseUserCondition = { user_id: id };

            const [books, borrowCounts, bookStatusCounts] = await Promise.all([
                countRecords('books', baseLibraryCondition),
                fetchBorrowCounts(baseUserCondition),
                fetchBookStatusCounts(baseUserCondition),
            ]);

            const data = {
                books,
                borrowRequestsPending: borrowCounts.pending,
                borrowRequestsApproved: borrowCounts.approved,
                borrowRequestsRejected: borrowCounts.rejected,
                borrowedBooks: bookStatusCounts.borrowed,
                overdueBooks: bookStatusCounts.overdue,
                returnedBooks: bookStatusCounts.returned,
            };

            success(res, data);
        }
    } catch (err: any) {
        error(res, err.message);
    }
};
