# NoriJjak Game Model

## Core Schema

### Game
- `sportId`: Reference to the `Sport`.
- `hostId`: Reference to the `User` who created the game.
- `title`: Short title for the match.
- `description`: Optional details.
- `startTime` / `endTime`: Scheduled window.
- `homeArea`: Coarse location for discovery.
- `capacity`: Maximum approved participants.
- `visibility`: `PUBLIC` (discoverable) or `PRIVATE` (link-only).
- `joinPolicy`: `OPEN` (instant join) or `APPROVAL` (host must confirm).
- `status`: `OPEN`, `CANCELLED`, `COMPLETED`.

### Participant
- `gameId`: Reference to the `Game`.
- `userId`: Reference to the `User`.
- `role`: `HOST` or `PARTICIPANT`.
- `status`: `REQUESTED`, `APPROVED`, `DENIED`, `CANCELLED`, `LEFT`, `WAITLISTED`.

## Lifecycle States
1. **Creation**: Status is `OPEN`. Host is automatically added as `APPROVED` participant with `HOST` role.
2. **Joining**:
   - If `OPEN` policy: Status is `APPROVED`.
   - If `APPROVAL` policy: Status is `REQUESTED`.
   - If `capacity` reached: Status is `WAITLISTED`.
3. **Leaving**: Status becomes `LEFT`. If the game was full, the first `WAITLISTED` user is promoted.
4. **Cancellation**: Game status becomes `CANCELLED`.
5. **Completion**: (Future) Game status becomes `COMPLETED` after `endTime`.

