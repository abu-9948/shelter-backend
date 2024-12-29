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

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password/:userId', authenticateToken, changePassword);

export default router;
