import prisma from '../lib/db';

export class NotificationService {
  /**
   * Register a device token for a user.
   */
  static async registerDevice(userId: string, token: string, platform: 'IOS' | 'ANDROID' | 'WEB') {
    return prisma.deviceToken.upsert({
      where: { token },
      update: { userId, platform, updatedAt: new Date() },
      create: { userId, token, platform },
    });
  }

  /**
   * Unregister a device token.
   */
  static async unregisterDevice(userId: string, token: string) {
    // Only delete if it belongs to the user (security check)
    // Or just delete by token if we trust the token ID is unique enough.
    // Ideally ensure ownership.
    const device = await prisma.deviceToken.findUnique({ where: { token } });
    if (device && device.userId === userId) {
      await prisma.deviceToken.delete({ where: { token } });
    }
  }

  /**
   * Update notification preferences.
   */
  static async updatePreferences(userId: string, data: {
    quietHoursStart?: string | null;
    quietHoursEnd?: string | null;
    timezone?: string;
    typesEnabled?: Record<string, boolean>;
  }) {
    // Upsert preferences
    // If not exists, use defaults
    
    // We need to fetch existing first to merge typesEnabled if partially provided?
    // For simplicity, we assume client sends full object or we merge here.
    // Let's use upsert.
    
    return prisma.notificationPreference.upsert({
      where: { userId },
      update: {
        ...data,
      },
      create: {
        userId,
        // Default values if creating
        quietHoursStart: data.quietHoursStart,
        quietHoursEnd: data.quietHoursEnd,
        timezone: data.timezone || 'Asia/Seoul',
        typesEnabled: data.typesEnabled || { chat: true, game: true },
      },
    });
  }

  /**
   * Get preferences
   */
  static async getPreferences(userId: string) {
    const prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });
    
    if (!prefs) {
      // Return defaults without creating record
      return {
        quietHoursStart: null,
        quietHoursEnd: null,
        timezone: 'Asia/Seoul',
        typesEnabled: { chat: true, game: true },
      };
    }
    return prefs;
  }

  /**
   * Send a push notification (Mock/Stub).
   */
  static async sendPush(userId: string, type: string, payload: Record<string, unknown>) {
    // 1. Check preferences
    const prefs = await this.getPreferences(userId);
    const types = prefs.typesEnabled as Record<string, boolean>;
    
    if (types[type] === false) {
      console.log(`[Push] User ${userId} has disabled ${type} notifications. Skipped.`);
      return { status: 'skipped', reason: 'disabled_by_preference' };
    }

    // 2. Check quiet hours (Mock logic for now)
    if (prefs.quietHoursStart && prefs.quietHoursEnd) {
      // Calculate current time in user's timezone...
      // For now, log and skip check
      console.log(`[Push] Quiet hours check skipped (mock).`);
    }

    // 3. Get tokens
    const tokens = await prisma.deviceToken.findMany({ where: { userId } });
    if (tokens.length === 0) {
      console.log(`[Push] No devices for user ${userId}. Skipped.`);
      return { status: 'skipped', reason: 'no_devices' };
    }

    // 4. "Send" (Log)
    console.log(`[Push] Sending to ${tokens.length} devices for user ${userId}:`, { type, payload });
    // In real implementation: Expo.sendPushNotificationsAsync(...)
    
    return { status: 'sent', count: tokens.length };
  }
}
