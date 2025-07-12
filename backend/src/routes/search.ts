import express from 'express';
import { searchQuestions } from '../controllers/search';

const router = express.Router();

router.get('/', searchQuestions);

export default router;
