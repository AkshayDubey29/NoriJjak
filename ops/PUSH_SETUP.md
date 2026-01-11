# Push Notifications Setup

## Current Implementation: Mock/Logging Provider
To avoid blocking development on external credentials (FCM/APNs), we are currently using a **Mock Provider**.

### How it works
1. **Mobile**: Generates a mock `ExpoPushToken` (e.g., `ExponentPushToken[mock-token-...]`).
2. **API**: Accepts registration of this token.
3. **Sending**: When `sendPush` is called, the API logs the payload to stdout instead of sending a real network request.

### Switching to Real Push (Expo)
To switch to real Expo push notifications:
1. **Mobile**: install `expo-notifications` and uncomment the permission/token logic in `usePushNotifications.ts`.
2. **API**: Install `expo-server-sdk` and implement the `Expo.sendPushNotificationsAsync` call in `NotificationService.ts`.

### Credentials
No credentials are required for the current mock implementation.
