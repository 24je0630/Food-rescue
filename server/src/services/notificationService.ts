import prisma from '../utils/db';
import { io } from '../index';

export const sendNotification = async (userId: string, message: string, type: string, link?: string) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        message,
        type,
        link,
      },
    });

    // Emit real-time event to the specific user's room
    io.to(userId).emit('notification', notification);

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};
