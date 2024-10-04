import express from 'express';
import { createLibrary, deleteLibrary, getLibraries, updateLibrary } from './controller';

const router = express.Router();

router.get('/', getLibraries);
router.post('/', createLibrary);
router.put('/', updateLibrary);
router.delete('/:id', deleteLibrary);

export default router;