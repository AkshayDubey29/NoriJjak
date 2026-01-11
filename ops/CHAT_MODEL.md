# Chat Model

The Chat domain enables coordination within specific games and future social contexts.

## Schema Definition (Prisma)

```prisma
model ChatMessage {
  id        String   @id @default(uuid())
  gameId    String
  game      Game     @relation(fields: [gameId], references: [id])
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id])
  body      String
  isDeleted Boolean  @default(false)
  reports   Report[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([gameId, createdAt])
}
```

## Realtime Mechanism: Polling (v1)
- **Choice**: HTTP Polling every 5 seconds.
- **Reasoning**: Simplest implementation for initial GA release with minimal infrastructure overhead. Reliable across both Web and Mobile without requiring Socket.io/WebSocket state management in the current Express setup.
- **Tradeoffs**: Up to 5s latency; increased server requests as user base scales.
- **Future**: Migrate to SSE (Server-Sent Events) or WebSockets for true realtime and lower latency.

## Permissions & Eligibility
- **Access**: Only approved participants (`status: 'APPROVED'`) and the `host` of a game can access the chat thread.
- **Read/Write**: The same eligibility applies to both reading messages and sending new ones.
- **Blocked Users**: Messages from users blocked by the current user are automatically filtered out server-side.

## Pagination
- Cursor-based pagination using `id` and `createdAt` (decided by API implementation).
- Default limit: 50 messages per page.

