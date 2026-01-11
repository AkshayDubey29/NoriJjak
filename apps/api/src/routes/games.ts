import { Router, Response, Request } from 'express';
import prisma from '../lib/db';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { 
  CreateGameSchema, 
  GameFilterSchema, 
  JoinGameSchema
} from '../lib/schemas';
import { Prisma } from '@prisma/client';

const router = Router();

// Create a game
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (user?.onboardingStep !== 'DONE') {
      return res.status(403).json({ error: 'Please complete onboarding first' });
    }

    const data = CreateGameSchema.parse(req.body);

    if (data.clubId) {
      const membership = await prisma.clubMember.findUnique({
        where: { clubId_userId: { clubId: data.clubId, userId: req.user!.id } },
      });
      if (!membership || membership.status !== 'APPROVED') {
        return res.status(403).json({ error: 'Must be an approved member of the club to create club games' });
      }
    }

    const game = await prisma.game.create({
      data: {
        ...data,
        hostId: req.user!.id,
        participants: {
          create: {
            userId: req.user!.id,
            role: 'HOST',
            status: 'APPROVED',
          },
        },
      },
      include: {
        sport: true,
        club: { select: { id: true, name: true } },
        host: { select: { id: true, displayName: true } },
        participants: true,
      },
    });
    res.status(201).json({ game });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create game';
    res.status(400).json({ error: message });
  }
});

// List games
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = GameFilterSchema.parse(req.query);
    const where: Prisma.GameWhereInput = { 
      status: query.status || 'OPEN',
      visibility: query.visibility || 'PUBLIC'
    };

    if (query.sportId) where.sportId = query.sportId;
    if (query.homeArea) where.homeArea = { contains: query.homeArea, mode: 'insensitive' };
    if (query.startTime) where.startTime = { gte: new Date(query.startTime) };
    if (query.endTime) where.endTime = { lte: new Date(query.endTime) };

    const games = await prisma.game.findMany({
      where,
      take: query.limit,
      skip: query.cursor ? 1 : 0,
      cursor: query.cursor ? { id: query.cursor } : undefined,
      include: {
        sport: true,
        host: { select: { id: true, displayName: true } },
        _count: { select: { participants: { where: { status: 'APPROVED' } } } },
      },
      orderBy: { startTime: 'asc' },
    });

    const nextCursor = games.length === query.limit ? games[games.length - 1].id : null;
    res.json({ games, nextCursor });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch games';
    res.status(400).json({ error: message });
  }
});

// Get detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: req.params.id },
      include: {
        sport: true,
        venue: true,
        club: { select: { id: true, name: true } },
        host: { select: { id: true, displayName: true } },
        participants: { include: { user: { select: { id: true, displayName: true } } } },
      },
    });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json({ game });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch game';
    res.status(500).json({ error: message });
  }
});

// Join
router.post('/:id/join', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (user?.onboardingStep !== 'DONE') return res.status(403).json({ error: 'Please complete onboarding first' });

    const { inviteToken } = JoinGameSchema.parse(req.body);
    const game = await prisma.game.findUnique({
      where: { id: req.params.id },
      include: { participants: { where: { status: 'APPROVED' } }, invites: { where: { token: inviteToken } } },
    });

    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.status !== 'OPEN') return res.status(400).json({ error: 'Game is not open' });

    if (game.visibility === 'PRIVATE' && !inviteToken) return res.status(403).json({ error: 'Private game requires invite token' });

    const isFull = game.participants.length >= game.capacity;
    const status = isFull ? 'WAITLISTED' : (game.joinPolicy === 'OPEN' ? 'APPROVED' : 'REQUESTED');

    const participant = await prisma.participant.upsert({
      where: { gameId_userId: { gameId: game.id, userId: req.user!.id } },
      update: { status },
      create: { gameId: game.id, userId: req.user!.id, status },
    });

    res.json({ message: 'Success', participant });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to join game';
    res.status(400).json({ error: message });
  }
});

export default router;
