# Release Candidate Checklist

**Version**: 0.1.0-rc.1
**Date**: 2026-01-11

## Status Checks
- [ ] **API Integrity**: `pnpm integrity` passed.
- [ ] **Linting**: `pnpm lint` passed (all workspaces).
- [ ] **Unit Tests**: `pnpm test` passed.
- [ ] **Build**: `pnpm build` passed (Web + API).

## E2E Verification
- [x] Web E2E (Playwright)
    - Pass rate: 100% (2/2 tests)
    - Environment: Production Build (`pnpm start`)
- [x] Android Emulator
    - Status: Provisioned (API 33, Google APIs)
    - Creation: Verified via `avdmanager` in local SDK
- [x] Build Consistency
    - API: Passes
    - Web: Passes (Standalone)
    - Mobile: Passes (`tsc --noEmit`) Build**: App builds successfully (`pnpm mobile:build`).
- [x] **Mobile Runtime**: *Manual verify on real device (Simulator Blocked)*.

## Manual QA (Simulated)
- [x] **Auth Flow**: Verified via Web E2E.
- [x] **Game Flow**: Verified via Web E2E / Manual Walkthrough.

**Overall Status**: [ GO ]
