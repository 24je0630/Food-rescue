import { Request, Response } from 'express';
import prisma from '../utils/db';

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.notification.findUnique({ where: { id: id as string } });
    if (!existing || existing.userId !== req.user!.id) {
      return res.status(404).json({ message: 'Not found' });
    }

    const updated = await prisma.notification.update({
      where: { id: id as string },
      data: { isRead: true },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
