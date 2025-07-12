import express from 'express';
import { getTags, getPopularTags } from '../controllers/tags';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', getTags);
router.get('/popular', getPopularTags);

export default router;
