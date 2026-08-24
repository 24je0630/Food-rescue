import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));

router.get('/stats', getDashboardStats);

export default router;
