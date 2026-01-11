import { Router, Response } from 'express';
import prisma from '../lib/db';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { CreateReportSchema } from '../lib/schemas';

const router = Router();

// Block a user
router.post('/block/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId: blockedId } = req.params;
    const blockerId = req.user!.id;

    if (blockerId === blockedId) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    await prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      create: { blockerId, blockedId },
      update: {},
    });

    res.json({ message: 'User blocked' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to block user';
    res.status(400).json({ error: message });
  }
});

// Unblock a user
router.post('/unblock/:userId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { userId: blockedId } = req.params;
    const blockerId = req.user!.id;

    await prisma.block.delete({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });

    res.json({ message: 'User unblocked' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to unblock user';
    res.status(400).json({ error: message });
  }
});

// Create report
router.post('/reports', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const body = CreateReportSchema.parse(req.body);
    const reporterId = req.user!.id;

    const report = await prisma.report.create({
      data: {
        ...body,
        reporterId,
      },
    });

    res.status(201).json({ report });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create report';
    res.status(400).json({ error: message });
  }
});

export default router;
