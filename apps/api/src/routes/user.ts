import { Router, Response } from 'express';
import prisma from '../lib/db';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        preferences: true,
        userSports: { include: { sport: true } },
      },
    });
    res.json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    res.status(500).json({ error: message });
  }
});

router.patch('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { displayName, bio, locale, timezone, homeArea, preferredRadius, sports } = req.body;
    
    await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        displayName,
        bio,
        locale,
        timezone,
        preferences: {
          upsert: {
            create: { homeArea, preferredRadius },
            update: { homeArea, preferredRadius },
          },
        },
      },
    });

    if (sports) {
      await prisma.userSport.deleteMany({ where: { userId: req.user!.id } });
      await prisma.userSport.createMany({
        data: sports.map((s: { sportId: string; level: string }) => ({
          userId: req.user!.id,
          sportId: s.sportId,
          level: s.level,
        })),
      });
    }

    res.json({ message: 'Profile updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    res.status(400).json({ error: message });
  }
});

router.post('/onboarding', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { step } = req.body;
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { onboardingStep: step },
    });
    res.json({ message: 'Onboarding step updated' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update onboarding';
    res.status(400).json({ error: message });
  }
});

export default router;
