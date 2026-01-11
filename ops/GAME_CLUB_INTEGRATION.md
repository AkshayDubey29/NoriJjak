# Game ↔ Club Integration

Games can be associated with a `Club` to indicate they are "Club Hosted".

## Implementation Rules
1. **Club-First Creation**: Users can create games from within a club context or by selecting a club during general game creation.
2. **Membership Requirement**: To host a game for a club, the user must be an `APPROVED` member of that club.
3. **Visibility**: Club-hosted games are currently public unless the game visibility itself is set to `PRIVATE`.

## UI/UX Rules
- **Game Detail**: Displays the club name and provides a link to the club detail page.
- **Club Detail**: Shows a list of upcoming games hosted by the club.
- **Notifications**: (Future) Club members can be notified when a new club game is created.

