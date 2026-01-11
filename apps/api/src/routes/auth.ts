import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/db';
import redis from '../lib/redis';
import { SignupSchema, LoginSchema, ConsentSchema } from '../lib/schemas';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

// Brute force mitigation: simple rate limiting per IP for login/signup
const rateLimit = async (req: Request, res: Response, next: () => void) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  const ip = req.ip;
  const key = `rate_limit:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  if (count > 10) {
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
};

router.post('/signup', rateLimit, async (req: Request, res: Response) => {
  console.log('Signup request received:', req.body);
  try {
    const data = SignupSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: data.displayName,
        locale: data.locale || 'ko-KR',
        consents: {
          create: [
            { type: 'TERMS', version: '1.0', accepted: data.termsAccepted },
            { type: 'PRIVACY', version: '1.0', accepted: data.privacyAccepted },
          ],
        },
      },
    });

    res.status(201).json({ message: 'User created', user: { id: newUser.id, email: newUser.email } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid data';
    res.status(400).json({ error: message });
  }
});

router.post('/login', rateLimit, async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.deletedAt) {
      return res.status(403).json({ error: 'Account is pending deletion' });
    }

    const sessionId = uuidv4();
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, sessionId },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, sessionId },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` }
    );

    // Store refresh token in Redis
    await redis.set(`refresh_token:${sessionId}`, refreshToken, 'EX', REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60);

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, displayName: user.displayName, locale: user.locale } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid data';
    res.status(400).json({ error: message });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string; sessionId: string };
    const storedToken = await redis.get(`refresh_token:${decoded.sessionId}`);
    
    if (storedToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, sessionId: decoded.sessionId },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  const sessionId = req.sessionId;
  if (sessionId) {
    await redis.del(`refresh_token:${sessionId}`);
    await redis.set(`revoked_session:${sessionId}`, 'true', 'EX', 24 * 60 * 60); // Revoke for 24h
  }
  res.clearCookie('accessToken');
  res.json({ message: 'Logged out' });
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { consents: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

router.post('/consent', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { type, version, accepted } = ConsentSchema.parse(req.body);
    const consent = await prisma.consent.upsert({
      where: { userId_type: { userId: req.user!.id, type } },
      update: { version, accepted },
      create: { userId: req.user!.id, type, version, accepted },
    });
    res.json(consent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid data';
    res.status(400).json({ error: message });
  }
});

router.post('/delete-request', authenticate, async (req: AuthRequest, res: Response) => {
  const { reason } = req.body;
  await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      deletedAt: new Date(),
      deletionRequest: {
        upsert: {
          create: { reason, status: 'PENDING' },
          update: { reason, status: 'PENDING' },
        },
      },
    },
  });
  
  if (req.sessionId) {
    await redis.del(`refresh_token:${req.sessionId}`);
    await redis.set(`revoked_session:${req.sessionId}`, 'true', 'EX', 24 * 60 * 60);
  }

  res.json({ message: 'Deletion requested. Account is now locked.' });
});

export default router;
