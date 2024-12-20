import { Router } from 'express';
import { register, login, updateUserProfile, getUserProfile,deleteUserProfile, logout} from '../controllers/userController.js';
import { requestPasswordReset, resetPassword, changePassword } from '../controllers/userController.js';

const router = Router();
import authenticateToken from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);


router.get('/:userId', authenticateToken, getUserProfile);
router.put('/:userId', authenticateToken, updateUserProfile);
router.delete('/:userId', authenticateToken, deleteUserProfile);
router.post('/logout',logout);

router.post('/request_password_reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change_password', authenticateToken, changePassword);

export default router;
