# Safety Rules & Enforcement

NoriJjak prioritizes user safety through built-in abuse controls.

## Blocking System
- **Action**: Users can block any other user.
- **Effect (Chat)**: If User A blocks User B:
    - User A will not see any messages from User B in any game chat.
    - User B's historical messages are also hidden from User A.
    - (Future) User B will not be able to join games hosted by User A.
- **Storage**: Persisted in the `Block` model.

## Reporting System
- **Action**: Users can report messages or other users for violations.
- **Reason Codes**:
    - `SPAM`: Unsolicited commercial content or repetitive messages.
    - `ABUSE`: Bullying, harassment, or hate speech.
    - `INAPPROPRIATE`: Explicit or offensive content.
    - `HARASSMENT`: Targeted harassment.
    - `OTHER`: General catch-all.
- **Persistence**: Reports are saved in the `Report` model with metadata (reporter, reported, game context, message link).

## Data Retention
- Deleted messages are soft-deleted (`isDeleted: true`) to preserve audit trails for moderation.
- Reports are kept indefinitely unless dismissed by an admin.

