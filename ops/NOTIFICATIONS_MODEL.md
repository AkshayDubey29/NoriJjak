# NoriJjak Notifications Model

## Notification Types
- `GAME_REQUEST`: Sent to Host when a user requests to join.
- `GAME_APPROVED`: Sent to User when their request is approved.
- `GAME_DENIED`: Sent to User when their request is denied.
- `GAME_CANCELLED`: Sent to all Approved participants when a game is cancelled.
- `WAITLIST_PROMOTED`: Sent to User when they move from waitlist to approved.

## Payload Structure
Standard JSON payload includes:
- `gameId`: The ID of the game.
- `gameTitle`: The title of the game.
- `userId` / `userName`: (Optional) Information about the subject of the notification.

## Delivery
- **In-App**: Persisted in the `Notification` table.
- **Push**: (Future) Firebase Cloud Messaging or similar to be added later.
- **Read State**: Tracked via `isRead` boolean and updated via dedicated API endpoint.

