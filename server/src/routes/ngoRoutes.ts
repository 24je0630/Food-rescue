import { Router } from 'express';
import { requestDonation, getNearbyDonations, getNgoRequests } from '../controllers/ngoController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/donations/:id/request', authorize(['NGO']), requestDonation);
router.get('/donations/nearby', authorize(['NGO']), getNearbyDonations);
router.get('/requests/my', authorize(['NGO']), getNgoRequests);

export default router;
