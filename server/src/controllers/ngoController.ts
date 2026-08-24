import { Request, Response } from 'express';
import prisma from '../utils/db';
import { z } from 'zod';

const requestDonationSchema = z.object({
  message: z.string().optional(),
});

export const requestDonation = async (req: Request, res: Response) => {
  try {
    const data = requestDonationSchema.parse(req.body);

    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id as string },
    });

    if (!donation || donation.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Donation not available' });
    }

    // Check expiry
    if (new Date() > donation.expiryTime) {
      return res.status(400).json({ message: 'Donation has expired' });
    }

    const request = await prisma.donationRequest.create({
      data: {
        donationId: donation.id,
        ngoId: req.user!.id,
        message: data.message,
      },
    });

    // Update status to requested
    await prisma.donation.update({
      where: { id: donation.id },
      data: { status: 'REQUESTED' },
    });

    res.status(201).json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.issues });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNearbyDonations = async (req: Request, res: Response) => {
  try {
    // In a real app with PostGIS, we'd use ST_Distance.
    // For now, we will fetch AVAILABLE donations and filter/sort in memory,
    // or use a simple bounding box in SQL.

    // Bounding box approximation (1 degree is ~111km)
    // If NGO profile is available, get their location.
    const ngo = await prisma.nGOProfile.findUnique({
      where: { userId: req.user!.id },
    });

    if (!ngo) {
      return res.status(403).json({ message: 'NGO Profile not found' });
    }

    const { latitude, longitude, operatingRadius } = ngo;
    const radiusDeg = operatingRadius / 111;

    const donations = await prisma.donation.findMany({
      where: {
        status: 'AVAILABLE',
        expiryTime: { gt: new Date() },
        latitude: {
          gte: latitude - radiusDeg,
          lte: latitude + radiusDeg,
        },
        longitude: {
          gte: longitude - radiusDeg,
          lte: longitude + radiusDeg,
        }
      },
      include: {
        donor: { select: { name: true, donorProfile: true } },
      },
    });

    // Haversine filter & sort
    const toRad = (value: number) => (value * Math.PI) / 180;
    const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const sorted = donations
      .map(d => ({ ...d, distance: calcDistance(latitude, longitude, d.latitude, d.longitude) }))
      .filter(d => d.distance <= operatingRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNgoRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.donationRequest.findMany({
      where: { ngoId: req.user!.id },
      include: {
        donation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
