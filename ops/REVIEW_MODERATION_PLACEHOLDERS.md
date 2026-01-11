# Review Moderation Placeholders

Safety workflows specifically for the trust layer.

## Audit Trail
- Every rating record includes the `raterId`, `gameId`, and `targetId`.
- Updates to ratings are tracked (versioning or updatedAt) to detect "rating blackmail".

## Moderation Actions (Admin UI Future)
- `Hide Review`: Keeps the rating in DB but hides the comment and excludes the score from aggregation.
- `Revoke Badge`: Manually remove a badge if earned through gaming the system.
- `Ban Rater`: Suspend users who consistently leave abusive reviews.

## Automated Signals
- **Velocity Check**: Flag users who leave more than 10 reviews in 1 hour.
- **Sentiment Analysis**: Scan comments for prohibited language.

