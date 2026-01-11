# NoriJjak Auth Model

## Overview
NoriJjak uses a production-grade authentication system based on JWT (JSON Web Tokens) with a dual-token strategy: Access Tokens and Refresh Tokens.

## Token Strategy
- **Access Token**: Short-lived (15 minutes). Sent in a `httpOnly` cookie for Web and as a Bearer token in headers for Mobile.
- **Refresh Token**: Long-lived (7 days). Stored in the database and Redis for fast validation and revocation.

## Session Lifecycle
1. **Login**: User provides credentials. API generates a `sessionId` (UUID), signs an Access Token and a Refresh Token, and stores the Refresh Token in Redis.
2. **Accessing Protected Routes**: Client sends Access Token. Server validates signature and checks if the `sessionId` is revoked in Redis.
3. **Refreshing**: When Access Token expires, Client calls `/auth/refresh` with the Refresh Token. Server validates it against Redis and issues a new Access Token.
4. **Logout**: Server deletes the Refresh Token from Redis and adds the `sessionId` to a revocation list (blacklist) in Redis for the remainder of its theoretical lifetime.
5. **Multi-device Support**: Each login creates a unique `sessionId`. Revoking one session does not affect others.

## Storage
- **Database (PostgreSQL)**: Stores user credentials (hashed) and deletion requests.
- **Cache (Redis)**: Stores active sessions (refresh tokens) and revoked session IDs for high-performance auth checks.

