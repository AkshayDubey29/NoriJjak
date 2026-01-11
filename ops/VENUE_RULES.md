# Venue Rules & Strategy

## Korea Wedge Strategy
For the initial GA release, we focus on the **Seoul Metropolitan Area**.

### Seeded Areas
- **Gangnam-gu**: Private sports centers.
- **Mapo-gu**: Public park facilities (World Cup Park).
- **Songpa-gu**: Olympic Park facilities.
- **Banpo**: Hangang River Park multi-sport areas.

### Naming & Localization
- **Proper Nouns**: Venue names are kept in their official primary language (usually Korean) or English equivalent if globally recognized (e.g., "Olympic Park").
- **Coarse Areas**: We use administrative divisions (City + Gu/Dong) for filtering.

## Data Rules
- **Idempotency**: Seed scripts must check for existence by `name` before creating to avoid duplicates.
- **Status**: Only `ACTIVE` venues are returned to users for discovery.
- **Capacity**: Venues don't currently enforce a hard capacity (that remains at the `Game` level).

