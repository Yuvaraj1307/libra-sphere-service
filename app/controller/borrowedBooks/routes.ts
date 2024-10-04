import express from 'express';
import { createBorrowedBook, updateBorrowedBook, deleteBorrowedBook, getBorrowedBooks } from './controller';

const router = express.Router();

router.get('/', getBorrowedBooks);
router.post('/', createBorrowedBook);
router.put('/', updateBorrowedBook);
router.delete('/:id', deleteBorrowedBook);

export default router;
