# Notification Preferences

## Model
Preferences are stored in the `NotificationPreferences` table.

```prisma
model NotificationPreferences {
  userId          String   @unique
  quietHoursStart String? // "HH:mm"
  quietHoursEnd   String? // "HH:mm"
  timezone        String   @default("Asia/Seoul")
  typesEnabled    Json    // { [type: string]: boolean }
}
```

## Supported Types
- `chat`: Direct messages and group chat.
- `game`: Game invites, approvals, cancellations.

## Behavior
- **Default**: All types enabled, no quiet hours.
- **Quiet Hours**: If current time (in user's timezone) is between Start and End, push is suppressed (except critical alerts if we add them later).
