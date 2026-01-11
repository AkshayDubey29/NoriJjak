import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { VenueFilterSchema } from '../lib/schemas';
import { Prisma } from '@prisma/client';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = VenueFilterSchema.parse(req.query);
    const where: Prisma.VenueWhereInput = { status: 'ACTIVE' };
    if (query.sportId) where.sports = { some: { id: query.sportId } };
    if (query.area) where.area = { contains: query.area, mode: 'insensitive' };
    const venues = await prisma.venue.findMany({
      where,
      take: query.limit,
      include: { sports: true },
      orderBy: { name: 'asc' },
    });
    res.json({ venues });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch venues';
    res.status(400).json({ error: message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: req.params.id },
      include: { sports: true },
    });
    res.json({ venue });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch venue';
    res.status(500).json({ error: message });
  }
});

export default router;
