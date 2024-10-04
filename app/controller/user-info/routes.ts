import express from 'express';
import { userInfo } from './controller';

const router = express.Router();

router.get('/', userInfo);

export default router;