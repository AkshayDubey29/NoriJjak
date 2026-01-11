import { Router, Request, Response } from 'express';
import prisma from '../lib/db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const sports = await prisma.sport.findMany({
      orderBy: { slug: 'asc' },
    });
    res.json({ sports });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sports';
    res.status(500).json({ error: message });
  }
});

export default router;
