import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import redis from '../lib/redis';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  sessionId?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; sessionId: string };
    
    // Check if session is revoked in Redis
    const isRevoked = await redis.get(`revoked_session:${decoded.sessionId}`);
    if (isRevoked) {
      return res.status(401).json({ error: 'Session revoked' });
    }

    req.user = { id: decoded.userId, email: decoded.email };
    req.sessionId = decoded.sessionId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

