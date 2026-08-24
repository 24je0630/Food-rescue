import { Router } from 'express';
import { createDonation, getMyDonations, getDonationDetails, editDonation, cancelDonation } from '../controllers/donationController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['DONOR']), createDonation);
router.get('/my', authorize(['DONOR']), getMyDonations);
router.get('/:id', getDonationDetails); // Allows all authenticated users (NGOs will need this)
router.patch('/:id', authorize(['DONOR']), editDonation);
router.delete('/:id', authorize(['DONOR']), cancelDonation);

export default router;
