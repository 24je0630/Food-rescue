import { Router } from 'express';
import { updateDonationStatus } from '../controllers/lifecycleController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

// Update status endpoint
router.patch('/donations/:id/status', updateDonationStatus);

export default router;
