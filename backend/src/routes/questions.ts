import express from 'express';
import {
  getQuestions,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  getQuestionsByTag,
  getQuestionsByUser,
  getRelatedQuestions,
  getPopularQuestions,
} from '../controllers/questions';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getQuestions);
router.get('/popular', getPopularQuestions); // Must be before /:id
router.get('/tag/:tag', getQuestionsByTag);
router.get('/user/:userId', getQuestionsByUser);
router.get('/:id', getQuestion);
router.get('/:id/related', getRelatedQuestions);

// Protected routes
router.post('/', protect, createQuestion);
router.put('/:id', protect, updateQuestion);
router.delete('/:id', protect, deleteQuestion);
router.post('/:id/vote', protect, voteQuestion);

export default router;
