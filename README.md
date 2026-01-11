# NoriJjak (놀이짝)

NoriJjak is a platform for finding games, booking venues, and tracking achievements.

## Project Structure

- `apps/api`: Backend API skeleton
- `apps/web`: Frontend Web skeleton
- `apps/mobile`: Mobile App skeleton
- `packages/shared`: Shared types and i18n keys
- `infra`: Local infrastructure (Postgres, Redis)
- `ops`: Manifest and protocol definitions
- `reports`: Step-by-step progress reports

## Getting Started

### Prerequisites

- Node.js (v24+)
- pnpm (v10+)
- Docker & Docker Compose

### Local Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start local infrastructure:
   ```bash
   cd infra
   docker compose up -d
   ```

3. Start development servers:
   ```bash
   pnpm dev
   ```

## Scripts

- `pnpm dev`: Start all apps in development mode
- `pnpm lint`: Run linting for all packages
- `pnpm test`: Run tests for all packages
- `pnpm build`: Build all packages

