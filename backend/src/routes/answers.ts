import express from 'express';
import {
  getAnswers,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
  acceptAnswer,
} from '../controllers/answers';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/question/:questionId', getAnswers);

// Protected routes
router.post('/', protect, createAnswer);
router.put('/:id', protect, updateAnswer);
router.delete('/:id', protect, deleteAnswer);
router.post('/:id/vote', protect, voteAnswer);
router.post('/:id/accept', protect, acceptAnswer);

export default router;
