import express from 'express';
import { 
  getUsers, 
  getUser, 
  getCurrentUser, 
  updateProfile, 
  updatePreferences, 
  changePassword, 
  changeEmail, 
  getUserActivity, 
  deleteAccount 
} from '../controllers/users';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getUsers);
router.get('/:id', getUser);

// Protected routes
router.get('/me/profile', protect, getCurrentUser);
router.get('/me/activity', protect, getUserActivity);
router.get('/:id/activity', getUserActivity);

router.put('/me/profile', protect, updateProfile);
router.put('/me/preferences', protect, updatePreferences);
router.put('/me/password', protect, changePassword);
router.put('/me/email', protect, changeEmail);

router.delete('/me/account', protect, deleteAccount);

export default router;
