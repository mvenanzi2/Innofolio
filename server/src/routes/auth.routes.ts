import { Router } from 'express';
import { 
  signup, 
  login, 
  getMe, 
  updateProfile, 
  changePassword,
  requestPasswordReset,
  resetPassword,
  getNotifications
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/notifications', authenticate, getNotifications);

export default router;
