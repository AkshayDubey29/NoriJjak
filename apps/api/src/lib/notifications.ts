import prisma from './db';

export async function sendNotification(
  userId: string,
  type: 'GAME_REQUEST' | 'GAME_APPROVED' | 'GAME_DENIED' | 'GAME_CANCELLED' | 'WAITLIST_PROMOTED',
  payload: Record<string, unknown>
) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        type,
        payload: payload as Record<string, unknown>,
      },
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return null;
  }
}

