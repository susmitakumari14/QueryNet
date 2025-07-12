import express from 'express';
import { getComments } from '../controllers/comments';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getComments);

export default router;
