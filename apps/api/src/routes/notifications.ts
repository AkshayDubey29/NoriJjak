import { Router, Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { authenticate, AuthRequest } from '../middlewares/auth';

const router = Router();

// POST /device - Register token
router.post('/device', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { token, platform } = req.body;
    if (!token || !platform) return res.status(400).json({ error: 'Missing fields' });
    
    const result = await NotificationService.registerDevice(req.user!.id, token, platform);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /preferences
router.get('/preferences', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prefs = await NotificationService.getPreferences(req.user!.id);
    res.json(prefs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /preferences
router.put('/preferences', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await NotificationService.updatePreferences(req.user!.id, req.body);
    res.json(result);
  } catch (err: any) {
     res.status(500).json({ error: err.message });
  }
});

// POST /internal/send-push (Test endpoint)
router.post('/internal/send-push', async (req, res) => {
  try {
    // Ideally protected by admin key
    const { userId, type, payload } = req.body;
    const result = await NotificationService.sendPush(userId, type, payload);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
