# Push Payloads & Deep Linking

## Payload Structure
All push notifications must include a `data` object with a `url` or `route` for deep linking.

```json
{
  "to": "ExponentPushToken[...]",
  "title": "New Message",
  "body": "Hello world!",
  "data": {
    "type": "chat_message",
    "gameId": "123",
    "url": "norijjak://games/123/chat"
  }
}
```

## Deep Link Routes
| Event | Route |
|---|---|
| Chat Message | `/games/:id/chat` |
| Game Invite | `/games/:id` |
| Game Approved | `/games/:id` |
| Profile Rating | `/profile` |

## Web Support
For web, we treat push notifications as "In-App Notifications" or use Service Workers (future). The `url` field can be used for `window.location`.
