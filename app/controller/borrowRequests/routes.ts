import express from 'express';
import { createBorrowRequest, deleteBorrowRequest, getBorrowRequests, updateBorrowRequest } from './controller';

const router = express.Router();

router.get('/', getBorrowRequests);
router.post('/', createBorrowRequest);
router.put('/', updateBorrowRequest);
router.delete('/:id', deleteBorrowRequest);

export default router;
