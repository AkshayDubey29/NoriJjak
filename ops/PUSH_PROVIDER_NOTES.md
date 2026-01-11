# Push Provider Notes

## Choice: Mock/Logging
We chose to mock the provider at this stage to:
1. Keep the "foundation" CI green without requiring secret keys.
2. Allow frontend dev to proceed with UI/UX for permissions and preferences.
3. Decouple "logic" (when to send) from "infrastructure" (how to send).

## Future Migration: FCM/APNs via Expo
We recommend using [Expo Push API](https://docs.expo.dev/push-notifications/overview/) as it handles the complexity of FCM/APNs certs. The backend simply POSTs to `https://exp.host/--/api/v2/push/send`.
