import express from 'express';
import { getUsers, getUser } from '../controllers/users';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);

export default router;
