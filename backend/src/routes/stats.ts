import express from 'express';
import { getStats } from '../controllers/stats';

const router = express.Router();

// Get community stats
router.get('/', getStats);

export default router;
