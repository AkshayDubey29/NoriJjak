import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { CreateClubSchema, ClubFilterSchema } from '../lib/schemas';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const query = ClubFilterSchema.parse(req.query);
    const clubs = await prisma.club.findMany({
      take: query.limit,
      include: { sports: true, _count: { select: { members: { where: { status: 'APPROVED' } } } } },
    });
    res.json({ clubs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch clubs';
    res.status(400).json({ error: message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const body = CreateClubSchema.parse(req.body);
    const { sportIds, ...data } = body;
    const club = await prisma.club.create({
      data: {
        ...data,
        sports: { connect: sportIds.map(id => ({ id })) },
        members: { create: { userId: req.user!.id, role: 'OWNER', status: 'APPROVED' } },
      },
    });
    res.status(201).json({ club });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create club';
    res.status(400).json({ error: message });
  }
});

export default router;
