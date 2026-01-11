# NoriJjak Onboarding Requirements

To ensure a high-quality GA launch and effective matchmaking/discovery, every user must complete a minimum onboarding set.

## Required Fields

1. **Display Name**
   - Reason: Needed for social interactions and game rosters.
   - Validation: Minimum 2 characters.

2. **Home Area (Coarse)**
   - Reason: Powers local game discovery without requiring precise GPS coordinates (privacy-first).
   - Representation: String (e.g., "Gangnam-gu, Seoul").

3. **Sports Selection (at least one)**
   - Reason: You can't find games or be found without knowing what you play.
   - Data: Sport ID + Skill Level.

## Gating Logic
- The `onboardingStep` field in the `User` model tracks progress.
- API endpoints check this status for core features.
- Frontend (Web/Mobile) routes users to the `/onboarding` flow if the status is not `DONE`.

