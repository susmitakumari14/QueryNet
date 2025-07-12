import express from 'express';
import { getTags } from '../controllers/tags';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getTags);

export default router;
