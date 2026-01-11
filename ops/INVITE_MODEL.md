# NoriJjak Invitation Model

## Mechanism
- **Invite Codes**: Short, random alphanumeric strings (e.g., `A1B2C3D4`) generated per game.
- **Redemption**: Users enter the code in the UI to gain access to a Private game or to bypass certain restrictions.

## Security & Tradeoffs
- **Guessability**: 8-character codes are used to balance ease of entry with security.
- **Expirations**: Optional `expiresAt` field for time-limited invites.
- **Usage Limits**: `maxUses` ensures codes cannot be reused indefinitely.
- **Revocation**: Hosts can delete invite records (future implementation) to invalidate codes.

## Implementation Details
- Stored in `GameInvite` table.
- Linked to a `Game` ID.
- Incremented `uses` on each successful join.

