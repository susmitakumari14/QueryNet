import express from 'express';
import { getNotifications } from '../controllers/notifications';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getNotifications);

export default router;
