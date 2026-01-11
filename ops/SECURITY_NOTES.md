# NoriJjak Security Notes

## Threat Considerations
- **Brute Force**: Mitigated via Redis-based rate limiting on sensitive endpoints (`/auth/login`, `/auth/signup`).
- **Session Hijacking**: Mitigated via `httpOnly`, `secure` cookies for Web and short-lived access tokens.
- **Database Compromise**: User passwords are hashed using `bcryptjs` with a salt factor of 10.

## Secret Handling
- **Development**: Secrets are managed via `.env` files (ignored by git).
- **Production**: Secrets should be injected via environment variables in the CI/CD or hosting provider (e.g., GitHub Secrets, AWS Secrets Manager).

## Future Social Login
The current auth model is designed to be extensible. To add social login (OAuth2/OIDC):
- A `Provider` model can be added to associate social IDs with local `User` accounts.
- The `/auth/login` endpoint will be augmented with provider-specific logic.

## Account Deletion
In compliance with privacy regulations (GDPR/KR-PIPA), a deletion request flow is implemented. Requests are stored as `PENDING`, and the account is immediately locked (`deletedAt` set). A background worker (future step) will permanently scrub the data after a grace period.

