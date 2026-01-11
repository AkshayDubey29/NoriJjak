# Release Gates

To ensure a stable release, every change must pass the following gates both locally and in CI.

## 1. Repo Integrity
**Command**: `pnpm integrity`
- **Checks**:
    - No null bytes or corruption.
    - Critical files exist and are not empty.
    - JSON files are valid.
    - Required directory structure exists.

## 2. Linting
**Command**: `pnpm lint`
- **Scope**: All apps (api, web, mobile) and packages (shared).
- **Policy**: Zero warnings/errors allowed for release.

## 3. Tests
**Command**: `pnpm test`
- **Scope**: Unit and integration tests for all apps.
- **Policy**: All tests must pass.

## 4. Build
**Command**: `pnpm build`
- **Scope**:
    - `apps/api`: Compiles TypeScript to `dist`.
    - `apps/web`: Next.js build (production optimization).
    - `apps/mobile`: Expo export/build check.
    - `packages/shared`: TypeScript build.
- **Policy**: Must build without error.

## CI Enforcement
The GitHub Workflow `release-gates.yml` enforces these gates on every Pull Request and Push to main/develop.
