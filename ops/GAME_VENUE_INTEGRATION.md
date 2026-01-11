# Game ↔ Venue Integration

Games can optionally be associated with a canonical `Venue`.

## Implementation Rules
1. **Optionality**: A game can have a `homeArea` (free text) but no `venueId`.
2. **Validation**: If a `venueId` is provided during game creation/update, it must exist in the database and be `ACTIVE`.
3. **Data Integrity**: When a `Venue` is attached to a `Game`, the UI should prefer showing the Venue's `address` and `name` over the Game's generic `homeArea`.

## UI/UX Rules
- **Venue Picker**: Filtered by the selected `sportId` of the game.
- **Visual Feedback**: On the Game Detail page, the venue name should link to the Venue Detail page.
- **Change Management**: If a host changes the venue of a game, a notification is stored for all participants.

