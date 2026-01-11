# Reputation Model & Badges

Aggregated trust signals are derived from individual ratings.

## Aggregation Strategy
- **Average Score**: Simple arithmetic mean of all ratings.
- **Minimum Thresholds**: A minimum of 3 ratings is required for the average score to be publicly displayed (prevents variance from single ratings).

## Badge System (Deterministic)

| Badge Name | Requirement | Type |
|------------|-------------|------|
| `SUPER_PLAYER` | Avg >= 4.5 and Count >= 10 | User |
| `GOLDEN_MANNER`| Avg category `MANNER` >= 4.5 | User |
| `PUNCTUAL` | Avg category `PUNCTUALITY` >= 4.5 | User |
| `TOP_VENUE` | Avg >= 4.7 and Count >= 5 | Venue |

## Abuse Resistance
- **Bayesian Smoothing (Future)**: To be implemented when volume increases to prevent new users with one 5-star rating from outranking established users.
- **Reporting**: Any rating reported and verified as "Spam" or "Harassment" is excluded from aggregation.
- **Self-Rating Prevention**: Enforced at the database level via unique constraints and API validation.

