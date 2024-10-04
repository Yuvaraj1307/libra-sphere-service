import express from 'express';
import { getDashboardData } from './controller';

const router = express.Router();

router.get('/', getDashboardData);

export default router;