import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getAvailableTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.donation.findMany({
      where: {
        status: 'ASSIGNED', // Or whatever status means waiting for volunteer
        task: null,         // Not yet picked by a volunteer
      },
      include: {
        donor: { select: { name: true, donorProfile: true } },
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // donation id

    const donation = await prisma.donation.findUnique({
      where: { id: id as string },
      include: { task: true },
    });

    if (!donation || donation.status !== 'ASSIGNED' || donation.task) {
      return res.status(400).json({ message: 'Task not available for pickup' });
    }

    const task = await prisma.pickupTask.create({
      data: {
        donationId: donation.id,
        volunteerId: req.user!.id,
        status: 'ASSIGNED',
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.pickupTask.findMany({
      where: { volunteerId: req.user!.id },
      include: {
        donation: {
          include: { donor: { select: { name: true, donorProfile: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
