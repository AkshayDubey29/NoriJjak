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
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        payload: payload as any,
      },
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return null;
  }
}

