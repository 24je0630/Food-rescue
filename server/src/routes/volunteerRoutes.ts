import { Router } from 'express';
import { getAvailableTasks, acceptTask, getMyTasks } from '../controllers/volunteerController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/tasks/available', authorize(['VOLUNTEER']), getAvailableTasks);
router.post('/tasks/:id/accept', authorize(['VOLUNTEER']), acceptTask);
router.get('/tasks/my', authorize(['VOLUNTEER']), getMyTasks);

export default router;
