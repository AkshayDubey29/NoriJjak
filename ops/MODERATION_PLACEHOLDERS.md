# Moderation Placeholders

Future-proofing the moderation workflow.

## Admin Dashboard (Future)
- **Review Queue**: A prioritized list of `Report` records.
- **Actions**:
    - `Dismiss`: Clear report if no violation.
    - `Warning`: Send a system notification to the reported user.
    - `Ban`: Disable user account globally.
    - `Clear Message`: Force-delete a specific `ChatMessage`.

## Automated Filters (Future)
- **Keyword Blacklist**: Server-side filtering of prohibited terms.
- **Rate Limiting**: Current basic rate limiting prevents spam bursts.
- **Image Analysis**: (Future) Scan uploaded images for inappropriate content.

## User Trust Score (Future)
- Users with multiple dismissed reports against them may have their "Trust Score" lowered, affecting visibility or join eligibility.

