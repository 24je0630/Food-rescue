import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalDonors = await prisma.user.count({ where: { role: 'DONOR' } });
    const totalNGOs = await prisma.user.count({ where: { role: 'NGO' } });
    const totalVolunteers = await prisma.user.count({ where: { role: 'VOLUNTEER' } });

    const totalDonations = await prisma.donation.count();
    const activeDonations = await prisma.donation.count({ where: { status: 'AVAILABLE' } });
    const completedDonations = await prisma.donation.count({ where: { status: 'DELIVERED' } });
    
    const donationsWithMeals = await prisma.donation.findMany({
      where: { status: 'DELIVERED' },
      select: { estimatedMeals: true },
    });
    const mealsSaved = donationsWithMeals.reduce((acc, curr) => acc + curr.estimatedMeals, 0);

    res.json({
      totalUsers,
      totalDonors,
      totalNGOs,
      totalVolunteers,
      totalDonations,
      activeDonations,
      completedDonations,
      mealsSaved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
