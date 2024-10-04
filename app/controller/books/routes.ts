import express from 'express';
import { createBook, deleteBook, getApprovedBooks, getBooks, updateBook } from './controller';

const router = express.Router();

router.get('/', getBooks);
router.get('/approved', getApprovedBooks);
router.post('/', createBook);
router.put('/', updateBook);
router.delete('/:id', deleteBook);

export default router;
