import { Router, Response } from 'express';
import prisma from '../lib/db';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ notifications });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
    res.status(500).json({ error: message });
  }
});

router.put('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id, userId: req.user!.id },
      data: { isRead: true },
    });
    res.json({ message: 'Read' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update notification';
    res.status(500).json({ error: message });
  }
});

export default router;
