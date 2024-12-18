import { Router } from 'express';
import { register, login, updateUserProfile, getUserProfile,deleteUserProfile, logout} from '../controllers/userController.js';
import { requestPasswordReset, resetPassword, changePassword } from '../controllers/userController.js';

const router = Router();
import authenticateToken from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.get('/api/users/:id', authenticateToken, getUserProfile);

//router.get('/:id', authenticateToken, getUserProfile);
router.put('/:id', authenticateToken, updateUserProfile);
router.delete('/:id', authenticateToken, deleteUserProfile);
router.post('/logout',logout);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticateToken, changePassword);

export default router;
