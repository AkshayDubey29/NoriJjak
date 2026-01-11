# NoriJjak Domain Model

## Core Models

### User
Extends the basic authentication model with profile fields and onboarding state.
- `displayName`: User's preferred name.
- `locale`: 'ko-KR' or 'en-US'.
- `timezone`: Default is 'Asia/Seoul'.
- `onboardingStep`: 'START', 'PROFILE', 'SPORTS', 'DONE'.

### Sport
Canonical list of sports.
- `slug`: Unique identifier (e.g., 'football').
- `name_ko`: Korean display name.
- `name_en`: English display name.

### UserPreference
User's discovery settings.
- `homeArea`: Coarse location (e.g., "Seoul", "Gangnam-gu").
- `preferredRadius`: Distance in km for game discovery.
- `availability`: JSON object representing preferred times.

### UserSport
Association between Users and Sports with skill levels.
- `level`: 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'.

## Onboarding Flow
New users are gated by their `onboardingStep`. They must provide:
1. Display Name
2. Home Area
3. At least one Sport with a skill level.

Once these are provided, `onboardingStep` is set to 'DONE', and the user is granted access to the main dashboard.

## Future Extensions
- **Games**: Will link to `Sport` and `User` (as organizer/participant).
- **Venues**: Will link to `Sport` and use `homeArea` for spatial indexing.
- **Clubs**: Will group users based on `UserSport` preferences.

