import express from 'express';
import { createUser, deleteUser, getUsers, updateUser } from './controller';

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/', updateUser);
router.delete('/:id', deleteUser);

export default router;