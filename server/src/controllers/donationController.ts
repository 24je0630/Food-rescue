import { Request, Response } from 'express';
import prisma from '../utils/db';
import { z } from 'zod';

const createDonationSchema = z.object({
  foodName: z.string().min(2),
  description: z.string().optional(),
  category: z.string(),
  quantity: z.number().positive(),
  quantityUnit: z.string(),
  estimatedMeals: z.number().positive(),
  preparationTime: z.string(), // ISO string
  availableFrom: z.string(),
  expiryTime: z.string(),
  isVegetarian: z.boolean().optional(),
  allergens: z.string().optional(),
  imageUrl: z.string().optional(),
  pickupAddress: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const createDonation = async (req: Request, res: Response) => {
  try {
    const data = createDonationSchema.parse(req.body);

    if (new Date(data.expiryTime) <= new Date(data.availableFrom)) {
      return res.status(400).json({ message: 'Expiry time must be after available time' });
    }

    const donation = await prisma.donation.create({
      data: {
        donorId: req.user!.id,
        foodName: data.foodName,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        quantityUnit: data.quantityUnit,
        estimatedMeals: data.estimatedMeals,
        preparationTime: new Date(data.preparationTime),
        availableFrom: new Date(data.availableFrom),
        expiryTime: new Date(data.expiryTime),
        isVegetarian: data.isVegetarian || false,
        allergens: data.allergens,
        imageUrl: data.imageUrl,
        pickupAddress: data.pickupAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        status: 'AVAILABLE',
      },
    });

    res.status(201).json(donation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.issues });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyDonations = async (req: Request, res: Response) => {
  try {
    const donations = await prisma.donation.findMany({
      where: { donorId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDonationDetails = async (req: Request, res: Response) => {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id as string },
      include: {
        donor: { select: { name: true, donorProfile: true } },
        requests: { include: { ngo: { select: { name: true, ngoProfile: true } } } },
        task: { include: { volunteer: { select: { name: true } } } },
      },
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // if user is donor, ensure it's theirs OR they are an admin.
    // Assuming simple access for now, will secure later if needed
    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const editDonation = async (req: Request, res: Response) => {
  try {
    // Only allow editing if status is AVAILABLE
    const existing = await prisma.donation.findUnique({ where: { id: req.params.id as string } });
    if (!existing || existing.donorId !== req.user!.id) {
      return res.status(404).json({ message: 'Donation not found or unauthorized' });
    }

    if (existing.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Cannot edit donation after it has been requested' });
    }

    const data = createDonationSchema.partial().parse(req.body);

    const updated = await prisma.donation.update({
      where: { id: req.params.id as string },
      data: {
        ...data,
        preparationTime: data.preparationTime ? new Date(data.preparationTime) : undefined,
        availableFrom: data.availableFrom ? new Date(data.availableFrom) : undefined,
        expiryTime: data.expiryTime ? new Date(data.expiryTime) : undefined,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelDonation = async (req: Request, res: Response) => {
  try {
    const existing = await prisma.donation.findUnique({ where: { id: req.params.id as string } });
    if (!existing || existing.donorId !== req.user!.id) {
      return res.status(404).json({ message: 'Donation not found or unauthorized' });
    }

    if (['DELIVERED', 'PICKED_UP'].includes(existing.status)) {
      return res.status(400).json({ message: 'Cannot cancel an already completed or picked up donation' });
    }

    const updated = await prisma.donation.update({
      where: { id: req.params.id as string },
      data: { status: 'CANCELLED' },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
