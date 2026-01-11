# NoriJjak Architecture

## Tech Stack

- **Monorepo**: pnpm Workspaces
- **Backend API**: Express with TypeScript
- **Frontend Web**: Next.js (App Router) with Tailwind CSS
- **Mobile App**: Expo (React Native)
- **Database**: PostgreSQL (v17)
- **Cache**: Redis (v7)
- **Testing**:
  - API & Shared: Vitest
  - Web: Vitest + React Testing Library
  - Mobile: Jest + React Native Testing Library (Note: Setup in progress)
- **CI**: GitHub Actions

## Design Decisions

1. **Shared Package**: A `@norijjak/shared` package contains common types and translation dictionaries. This ensures consistency between Web and Mobile.
2. **Localization First**: All UI strings are managed in `packages/shared/src/index.ts`. No hard-coded strings in apps.
3. **Skeleton Pattern**: Apps are initialized with minimal functionality (health checks, landing pages, locale toggles) to verify the plumbing before feature development.

## Production Readiness Plan

- **Environments**: Development, Staging, Production.
- **CI/CD**: Automated testing on PRs, deployment to staging on merge to `main`, manual GA release gate.
- **Infrastructure**: Dockerized services for local development, Kubernetes or Managed Services for production.

