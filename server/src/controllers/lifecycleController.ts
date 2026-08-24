import { Request, Response } from 'express';
import prisma from '../utils/db';
import { DonationStatus } from '@prisma/client';

const validTransitions: Record<DonationStatus, DonationStatus[]> = {
  AVAILABLE: ['REQUESTED', 'CANCELLED', 'EXPIRED'],
  REQUESTED: ['ASSIGNED', 'CANCELLED', 'EXPIRED'],
  ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export const updateDonationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(DonationStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const donation = await prisma.donation.findUnique({
      where: { id: id as string },
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const currentStatus = donation.status;
    const allowed = validTransitions[currentStatus] || [];

    if (!allowed.includes(status as DonationStatus)) {
      return res.status(400).json({
        message: `Invalid transition from ${currentStatus} to ${status}`,
      });
    }

    // Role-based validation
    if (status === 'ASSIGNED' && req.user!.role !== 'NGO' && req.user!.role !== 'ADMIN') {
      // Typically donor or system assigns, let's say Donor accepts NGO request
      if (req.user!.role !== 'DONOR') {
        return res.status(403).json({ message: 'Only donor can accept and assign' });
      }
    }

    if (status === 'PICKED_UP' || status === 'DELIVERED') {
      if (req.user!.role !== 'VOLUNTEER') {
        return res.status(403).json({ message: 'Only volunteer can update pickup/delivery' });
      }
    }

    const updated = await prisma.donation.update({
      where: { id: id as string },
      data: { status: status as DonationStatus },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
