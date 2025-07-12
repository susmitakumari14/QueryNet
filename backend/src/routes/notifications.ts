import express from 'express';
import { 
  getNotifications, 
  markNotificationRead, 
  markNotificationUnread, 
  markAllNotificationsRead, 
  deleteNotification,
  getNotificationPreferences,
  updateNotificationPreferences
} from '../controllers/notifications';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get notifications with optional filtering
router.get('/', protect, getNotifications);

// Get notification preferences
router.get('/preferences', protect, getNotificationPreferences);

// Update notification preferences
router.put('/preferences', protect, updateNotificationPreferences);

// Mark all notifications as read
router.put('/mark-all-read', protect, markAllNotificationsRead);

// Mark specific notification as read
router.put('/:id/read', protect, markNotificationRead);

// Mark specific notification as unread
router.put('/:id/unread', protect, markNotificationUnread);

// Delete notification
router.delete('/:id', protect, deleteNotification);

export default router;
