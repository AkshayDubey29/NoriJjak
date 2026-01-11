import { Router } from 'express';
import { NotificationService } from '../services/NotificationService';
// Assuming auth middleware exists
// import { requireAuth } from '../middleware/auth';

const router = Router();

// Mock auth middleware (replace with real one when integrated)
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.user) {
    // For dev ease if not fully auth'd or create a mock user
    // req.user = { id: 'mock-user-id' };
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// POST /device - Register token
router.post('/device', requireAuth, async (req, res) => {
  try {
    const { token, platform } = req.body;
    if (!token || !platform) return res.status(400).json({ error: 'Missing fields' });
    
    const result = await NotificationService.registerDevice(req.user.id, token, platform);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /preferences
router.get('/preferences', requireAuth, async (req, res) => {
  try {
    const prefs = await NotificationService.getPreferences(req.user.id);
    res.json(prefs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /preferences
router.put('/preferences', requireAuth, async (req, res) => {
  try {
    const result = await NotificationService.updatePreferences(req.user.id, req.body);
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
